const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}

const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.admin) {
    next();
  } else {
    res.redirect("/admin/login");
  }
}

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect("/dashboard")
  } else {
    next();
  }
}

const isAdminAuth = (req, res, next) => {
  if (req.isAuthenticated() && req.user.admin) {
    res.redirect("/admin");
  } else {
    next()
  }
}

module.exports = { isLoggedIn, isAdmin, isAuth, isAdminAuth }
