const admin = require("firebase-admin");
const serviceAccount = require("../eshopper-4ff67-firebase-adminsdk-xfgnm-e4490c8aad.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
