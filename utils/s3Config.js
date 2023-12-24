const { S3Client } = require("@aws-sdk/client-s3");
const s3 = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRETE_ACCESS_KEY,
  },
});

module.exports = s3;
