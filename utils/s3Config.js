const { S3Client } = require("@aws-sdk/client-s3");
const s3 = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: "AKIA3UOW5B2DWJJSICAE",
    secretAccessKey: "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",
  },
});

module.exports = s3;
