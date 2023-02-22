// adminjs

const AdminJS = require("adminjs");
const AdminJSExpress = require("@adminjs/express");
const dbUri = process.env.MONGODB_URI;
const User = require("../../models/users/users");
const ConvoCards = require("../../models/convoCards/convoCards");
const UserCards = require("../../models/userCards/userCards");
const router = require("express").Router();

// const Connect = require("connect-pg-simple");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  uri: dbUri,
  collection: "mySessions",
});
// Catch errors
store.on("error", function (error) {
  console.log(error);
});

const DEFAULT_ADMIN = {
  email: process.env.ADMINJSUSER,
  password: process.env.ADMINJSPASS,
};

const authenticate = async (email, password) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};
const AdminJSMongoose = require("@adminjs/mongoose");

AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});
const adminOptions = {
  // We pass Category to `resources`
  resources: [User, ConvoCards, UserCards],
};
const admin = new AdminJS(adminOptions);

const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  admin,
  {
    authenticate,
    cookieName: "adminjs",
    cookiePassword: "sessionsecret",
  },
  null,
  // {
  //   store: store,
  //   resave: true,
  //   saveUninitialized: true,
  //   secret: "sessionsecret",
  //   cookie: {
  //     httpOnly: process.env.NODE_ENV === "production",
  //     secure: process.env.NODE_ENV === "production",
  //   },
  //   name: "adminjs",
  // }
  { saveUninitialized: true, resave: true }
);
router.use(admin.options.rootPath, adminRouter);

module.exports = router;
