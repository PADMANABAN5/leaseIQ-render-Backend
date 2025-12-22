const { Storage } = require("@google-cloud/storage");

const storage = new Storage();
const bucket = storage.bucket(process.env.GCP_BUCKET_NAME);

exports.uploadFile = async ({ buffer, filename, mimetype }) => {
  const filePath = `leases/${Date.now()}-${filename}`;
  const file = bucket.file(filePath);

  await file.save(buffer, {
    contentType: mimetype,
    resumable: false,
  });

  return filePath;
};
