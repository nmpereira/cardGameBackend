// when user logs in, check if user exists in db. If not, create user in db.

const { auth } = require("express-openid-connect");
const User = require("../../models/users/users");

async function addUserToDb(req, res, next) {
  // check if user is logged in
  if (req.oidc.isAuthenticated()) {
    const user = await User.findOne({ email: req.oidc.user.email });

    if (!user) {
      // create user in db
      const newUser = new User({ ...req.oidc.user, role: "user" });
      console.log("req.oidc.user", newUser);
      await newUser.save();
    }
  }

  next();
}

module.exports = { addUserToDb };
