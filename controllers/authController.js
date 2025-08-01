const { signupSchema, signinSchema, emailSchema, verificationCodeSchema, changePasswordSchema } = require("../middlewares/validator")
const User = require("../models/userModel");
const { dohash, dohashValidation, hmacProcess } = require("../utils/hashing");
const transport = require("../middlewares/sendmail")

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(401).json({ success: false, message: "User already exists!" })
    }

    const hashedPassword = await dohash(password, 12);

    const newUser = await new User({
      name,
      email,
      password: hashedPassword,
    })

    const result = await newUser.save();
    res.status(201).json({ success: true, message: "Your Account has been created successfuly", result });
    res.redirect("/login");
  } catch (error) {
    console.log(error)
  }
}


exports.signin = async (username, password, done) => {

  try {

    const user = await User.findOne({ email: username }).select("+password");

    if (!user) {
      done(null, false);
    }

    const validPassword = await dohashValidation(password, user.password);

    if (!validPassword) {
      done(null, false);
    }

    done(null, user);
  } catch (error) {
    console.log(error)
  }
}


exports.adminSignout = async (req, res) => {
  try {
    this.makeInActive(req, res);
    req.logout((err) => {
      if (err) {
        res.status(500).send("An error occured trying to log you out!. Please try again later");
      }
      res.redirect("/admin/login");
    });
  } catch (err) {
    console.log(err);
  }
}


exports.signout = async (req, res) => {
  try {
    this.makeInActive(req, res);
    req.logout((err) => {
      if (err) {
        res.status(500).send("An error occured trying to log you out!. Please try again later");
      }
      res.redirect("/login");
    });
  } catch (err) {
    console.log(err)
  }
}


exports.sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  try {
    const { error, value } = emailSchema.validate({ email });

    if (error) {
      return res.status(401).json({
        email,
        success: false,
        message: error.details[0].message
      })
    }

    const existingUser = await User.findOne({ email }).select("+verificationCode +verificationCodeValidation");
    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "user does not exist!",
      })
    }

    const codeValue = Math.floor(Math.random() * 100000).toString();

    const info = await transport.sendMail({
      from: process.env.NODEMAILER_CODE_SENDING_EMAIL_ADDRESS,
      to: existingUser.email,
      subject: "Email Verification Code",
      html: `<div style="background-color: black; width: 100%; height: 100vh; display: flex; align-items: center; justify-content: center; padding: 10px;">
    <div style="max-width: 400px; width: 100%; height: fit-content; border: none; border-radius: 10px; background-color: rgba(255, 255, 255, 0.1);">
      <div style=" margin-bottom: 30px; background-color: purple; height: 50px; width: 100%; display: flex; flex-direction: column; justify-content: center; border-top-right-radius: 10px; border-top-left-radius: 10px; align-items: center;">
        <p style="color: white;">Powered by Gwin Mail</p>
      </div>
      <div
        style="display: flex; height: 100%; justify-content: center; flex-direction: column; gap: 3rem; padding: 10px;">
        <div
          style="padding: 20px; border-radius: 5px; align-self: center; width: fit-content; background-color: rgba(255, 255, 255, 0.09); border: none; display: flex; justify-content: center; gap: 3rem;">
          <span style="color: white; font-size: 30px; font-weight: bold; letter-spacing: 0.3rem;">${codeValue}</span>
        </div>
        <div style="color: white;">
          <p>This is your verification code. Do not share with any other person!</p>
        </div>
      </div>

    </div>
  </div>`
    })

    if (info.accepted[0] === existingUser.email) {
      const hashedCodeValue = hmacProcess(codeValue, process.env.HMACPROCESSKEY);
      existingUser.verificationCode = hashedCodeValue;
      existingUser.verificationCodeValidation = Date.now();
      await existingUser.save();
      return res.status(200).json({
        success: true,
        message: "Code Sent",
      })
    }
    return res.status(400).json({
      success: false,
      message: "Code not sent, something went wrong!"
    })
  } catch (err) {
    console.error(err)
  }
}

exports.verifyVerificationCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    const { error, value } = verificationCodeSchema.validate({ email, code });
    if (error) {
      return res.status(401).json({
        success: false,
        message: error.details[0].message,
      })
    }

    const existingUser = await User.findOne({ email }).select("+verificationCode +verificationCodeValidation");

    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "User does not exist!"
      })
    }

    if (existingUser.verified) {
      return res.status(401).json({
        success: false,
        message: "User already verified!"
      })
    }

    if (!existingUser.verificationCode || !existingUser.verificationCodeValidation) {
      const codeValue = Math.floor(Math.random() * 100000).toString();

      const info = await transport.sendMail({
        from: process.env.NODEMAILER_CODE_SENDING_EMAIL_ADDRESS,
        to: existingUser.email,
        subject: "Email Verification Code",
        html: `<div style="background-color: black; width: 100%; height: 100vh; display: flex; align-items: center; justify-content: center; padding: 10px;">
    <div style="max-width: 400px; width: 100%; height: fit-content; border: none; border-radius: 10px; background-color: rgba(255, 255, 255, 0.1);">
      <div style=" margin-bottom: 30px; background-color: purple; height: 50px; width: 100%; display: flex; flex-direction: column; justify-content: center; border-top-right-radius: 10px; border-top-left-radius: 10px; align-items: center;">
        <p style="color: white;">Powered by Gwin Mail</p>
      </div>
      <div
        style="display: flex; height: 100%; justify-content: center; flex-direction: column; gap: 3rem; padding: 10px;">
        <div
          style="padding: 20px; border-radius: 5px; align-self: center; width: fit-content; background-color: rgba(255, 255, 255, 0.09); border: none; display: flex; justify-content: center; gap: 3rem;">
          <span style="color: white; font-size: 30px; font-weight: bold; letter-spacing: 0.3rem;">${codeValue}</span>
        </div>
        <div style="color: white;">
          <p>This is your verification code. Do not share with any other person!</p>
        </div>
      </div>

    </div>
  </div>`
      })

      if (info.accepted[0] === existingUser.email) {
        const hashedCodeValue = hmacProcess(codeValue, process.env.HMACPROCESSKEY);
        existingUser.verificationCode = hashedCodeValue;
        existingUser.verificationCodeValidation = Date.now();
        await existingUser.save();
        return res.status(200).json({
          success: true,
          message: "Something went wrong! Code has been resent",
        })
      }
      return res.status(400).json({
        success: false,
        message: "something wrong sending the code!"
      })
    }


    if (Date.now() - existingUser.verificationCodeValidation > 5 * 60 * 1000) {
      return res.status(401).json({
        success: false,
        message: "Code Expired"
      })
    }

    const hashedcode = hmacProcess(code, process.env.HMACPROCESSKEY);

    if (hashedcode === existingUser.verificationCode) {
      existingUser.verified = true;
      existingUser.verificationCode = undefined;
      existingUser.verificationCodeValidation = undefined;
      await existingUser.save();
      return res.status(200).json({
        success: true,
        message: "Your account has been verified"
      })
    }

    return res.status(400).json({
      success: false,
      message: "Invalid Code"
    })


  } catch (err) {
    console.error(err)
  }
}


exports.sendForgotPasswordCode = async (req, res) => {
  const { email } = req.body;
  try {
    const { error, value } = emailSchema.validate({ email });

    if (error) {
      return res.status(401).json({
        email,
        success: false,
        message: error.details[0].message
      })
    }

    const existingUser = await User.findOne({ email }).select("+verificationCode +verificationCodeValidation");
    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "user does not exist!",
      })
    }

    const codeValue = Math.floor(Math.random() * 100000).toString();

    const info = await transport.sendMail({
      from: process.env.NODEMAILER_CODE_SENDING_EMAIL_ADDRESS,
      to: existingUser.email,
      subject: "Password Reset Code",
      html: `<div style="background-color: black; width: 100%; height: 100vh; display: flex; align-items: center; justify-content: center; padding: 10px;">
    <div style="max-width: 400px; width: 100%; height: fit-content; border: none; border-radius: 10px; background-color: rgba(255, 255, 255, 0.1);">
      <div style=" margin-bottom: 30px; background-color: purple; height: 50px; width: 100%; display: flex; flex-direction: column; justify-content: center; border-top-right-radius: 10px; border-top-left-radius: 10px; align-items: center;">
        <p style="color: white;">Powered by Gwin Mail</p>
      </div>
      <div
        style="display: flex; height: 100%; justify-content: center; flex-direction: column; gap: 3rem; padding: 10px;">
        <div
          style="padding: 20px; border-radius: 5px; align-self: center; width: fit-content; background-color: rgba(255, 255, 255, 0.09); border: none; display: flex; justify-content: center; gap: 3rem;">
          <span style="color: white; font-size: 30px; font-weight: bold; letter-spacing: 0.3rem;">${codeValue}</span>
        </div>
        <div style="color: white;">
          <p>This is your password reset code. Do not share with any other person!</p>
        </div>
      </div>

    </div>
  </div>`
    })

    if (info.accepted[0] === existingUser.email) {
      const hashedCodeValue = hmacProcess(codeValue, process.env.HMACPROCESSKEY);
      existingUser.forgotPasswordCode = hashedCodeValue;
      existingUser.forgotPasswordCodeValidation = Date.now();
      await existingUser.save();
      return res.status(200).json({
        success: true,
        message: "Code Sent",
      })
    }
    return res.status(400).json({
      success: false,
      message: "Password Reset Code not sent, something went wrong!"
    })
  } catch (err) {
    console.error(err)
  }

}

exports.verifyForgotPasswordcode = async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    const { error, value } = FPCodeSchema.validate({ email, code, newPassword });
    if (error) {
      return res.status(401).json({
        success: false,
        message: error.details[0].message,
      })
    }

    const existingUser = await User.findOne({ email }).select("+forgotPasswordCode +forgotPasswordCodeValidation");

    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "User does not exist!"
      })
    }

    if (!existingUser.verified) {
      return res.status(401).json({
        success: false,
        message: "User email not verified!"
      })
    }

    if (!existingUser.forgotPasswordCode || !existingUser.forgotPasswordCodeValidation) {
      const codeValue = Math.floor(Math.random() * 100000).toString();

      const info = await transport.sendMail({
        from: process.env.NODEMAILER_CODE_SENDING_EMAIL_ADDRESS,
        to: existingUser.email,
        subject: "Password Reset Code",
        html: `<div style="background-color: black; width: 100%; height: 100vh; display: flex; align-items: center; justify-content: center; padding: 10px;">
    <div style="max-width: 400px; width: 100%; height: fit-content; border: none; border-radius: 10px; background-color: rgba(255, 255, 255, 0.1);">
      <div style=" margin-bottom: 30px; background-color: purple; height: 50px; width: 100%; display: flex; flex-direction: column; justify-content: center; border-top-right-radius: 10px; border-top-left-radius: 10px; align-items: center;">
        <p style="color: white;">Powered by Gwin Mail</p>
      </div>
      <div
        style="display: flex; height: 100%; justify-content: center; flex-direction: column; gap: 3rem; padding: 10px;">
        <div
          style="padding: 20px; border-radius: 5px; align-self: center; width: fit-content; background-color: rgba(255, 255, 255, 0.09); border: none; display: flex; justify-content: center; gap: 3rem;">
          <span style="color: white; font-size: 30px; font-weight: bold; letter-spacing: 0.3rem;">${codeValue}</span>
        </div>
        <div style="color: white;">
          <p>This is your new password reset code. Do not share with any other person!</p>
        </div>
      </div>

    </div>
  </div>`
      })

      if (info.accepted[0] === existingUser.email) {
        const hashedCodeValue = hmacProcess(codeValue, process.env.HMACPROCESSKEY);
        existingUser.forgotPasswordCode = hashedCodeValue;
        existingUser.forgotPasswordCodeValidation = Date.now();
        await existingUser.save();
        return res.status(200).json({
          success: true,
          message: "Something went wrong! Code has been resent",
        })
      }
      return res.status(400).json({
        success: false,
        message: "something wrong sending the code!"
      })
    }


    if (Date.now() - existingUser.forgotPasswordCodeValidation > 5 * 60 * 1000) {
      return res.status(401).json({
        success: false,
        message: "Code Expired"
      })
    }

    const hashedCode = hmacProcess(code, process.env.HMACPROCESSKEY);

    if (hashedCode === existingUser.forgotPasswordCodeValidation) {
      const hashedPassword = await dohash(newPassword, 12)
      existingUser.password = hashedPassword;
      existingUser.forgotPasswordCode = undefined;
      existingUser.forgotPasswordCodeValidation = undefined;
      await existingUser.save();
      return res.status(200).json({
        success: true,
        message: "Password Changed"
      })
    }

    return res.status(400).json({
      success: false,
      message: "Invalid Code"
    })


  } catch (err) {
    console.error(err)
  }

}

exports.changePassword = async (req, res) => {
  const { id, verified } = req.user;
  const { oldPassword, newPassword } = req.body;

  const { error, value } = changePasswordSchema.validate({ oldPassword, newPassword });
  if (error) {
    return res.status(401).json({
      success: false,
      message: error.details[0].message
    })
  }

  const existingUser = await User.findOne({ _id: id }).select("+password");

  if (!existingUser) {
    return res.status(401).json({
      success: false,
      message: "user not found"
    })
  }

  if (!existingUser.verified) {
    return res.status(401).json({
      success: false,
      message: "user not verified"
    })
  }

  const comparedpassword = await dohashValidation(oldPassword, existingUser.password);

  if (!comparedpassword) {
    return res.status(401).json({
      success: false,
      message: "invalid password"
    })
  }


  const hashedPassword = await dohash(newPassword, 12);
  existingUser.password = hashedPassword;
  await existingUser.save();

  return res.status(200).json({
    success: true,
    message: "password changed successfully"
  })
}


exports.makeActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.active = true
      user.status = "Active"
    }
    const results = await user.save();
  } catch (err) {
    if (err) console.log(err)
  }
  next();
}

exports.makeInActive = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.active = false
      user.status = "Inactive"
    }
    const results = await user.save();
  } catch (err) {
    if (err) console.log(err)
  }
}
