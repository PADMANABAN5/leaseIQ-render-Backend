const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  endpoint: process.env.DO_SPACES_ENDPOINT,
  accessKeyId: process.env.DO_SPACES_KEY,
  secretAccessKey: process.env.DO_SPACES_SECRET,
});

exports.uploadFile = async ({ buffer, filename, mimetype }) => {
  const key = `leases/${Date.now()}-${filename}`;

  await s3
    .putObject({
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
      ACL: "private",
    })
    .promise();

  return key;
};
