require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const { default: pLimit } = require("p-limit");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploader = async (file) => {
  const results = await cloudinary.uploader.upload(file);
  const url = cloudinary.url(results.public_id, {
    transformation: [
      {
        quality: 'auto',
        fetch_format: 'auto'
      },
      {
        width: 500,
        height: 500,
        crop: 'fill',
        gravity: 'auto'
      }
    ]
  });
  return { url, publicId: results.public_id };
}

async function uploadMultiple(documentPaths) {
  const limit = pLimit(10); // Limit concurrent uploads to 10
  const uploadPromises = documentPaths.map(path =>
    limit(() => cloudinary.uploader.upload(path))
  );
  const results = await Promise.all(uploadPromises);
  // This array will contain the upload results for each document
  const finalResults = results.map((result) => {
    const url = cloudinary.url(result.public_id, {
      transformation: [
        {
          quality: 'auto',
          fetch_format: 'auto'
        },
        {
          width: 500,
          height: 500,
          crop: 'fill',
          gravity: 'auto'
        }
      ]
    })
    return { url, publicId: result.public_id };
  });
  return finalResults;
}


module.exports = { uploader, uploadMultiple }

