const { SESClient } = require("@aws-sdk/client-ses");
require("dotenv").config();
// Set the AWS Region
const REGION = "eu-north-1";

// console.log("Access Key:", process.env.AWS_ACCESS_KEY);
// console.log("Secret Key:", process.env.AWS_SECRET_KEY);


// Create SES service object
const sesClient = new SESClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

module.exports = { sesClient }; 
