// function to protect routes

const { auth } = require("express-openid-connect");
const User = require("../../models/users/users");

async function requireAuth(req, res, next) {
  try {
    if (req.oidc.isAuthenticated()) {
      return next();
    }
    res
      .status(401)
      .json({ message: "Need to be logged in", requireLogin: true });
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}

// function to restrict access to admin role
async function requireAdmin(req, res, next) {
  try {
    // find user in db
    if (req.oidc.isAuthenticated()) {
      const user = await User.find({ email: req.oidc.user.email });
      console.log("user", user);
      if (user.role === "admin") {
        return next();
      }
    }
    res.status(401).json({ message: "Unauthorized" });
  } catch (error) {
    console.log("error", error);
  }
}

module.exports = { requireAuth, requireAdmin };
