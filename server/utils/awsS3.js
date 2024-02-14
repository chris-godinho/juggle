// awsS3.js
const AWS = require("aws-sdk");
const path = require("path");
const dotenv = require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});

// Generate pre-signed URL for file download
const generatePresignedUrl = async (username, fileName) => {
  // Initialize AWS S3 client
  AWS.config.update({
    accessKeyId: process.env.AMAZON_S3_IAM_ACCESS_KEY,
    secretAccessKey: process.env.AMAZON_S3_IAM_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  const s3 = new AWS.S3();

  const prefix = `${username}/`;

  // Parameters for listing objects with the specified prefix
  const listParams = {
    Bucket: process.env.AMAZON_S3_BUCKET,
    Prefix: prefix,
  };

  console.log(`[awsS3.js]: listParams:`, listParams);

  try {
    // List objects with the specified prefix
    const listData = await s3.listObjectsV2(listParams).promise();

    console.log(`[awsS3.js]: listData:`, listData);

    // Check if the array is empty (no files found)
    if (listData.Contents.length === 0) {
      console.log(`[awsS3.js]: No files found for the username: ${username}`);
      return null;
    }

    // Continue with generating the pre-signed URL
    const params = {
      Bucket: process.env.AMAZON_S3_BUCKET,
      Key: `${username}/${fileName}`,
      Expires: 7200,
      ResponseContentDisposition: `attachment; filename="${fileName}"`,
    };

    // Generate pre-signed URL
    const url = await s3.getSignedUrlPromise("getObject", params);
    console.log(`[awsS3.js]: Pre-signed URL for ${fileName}: ${url}`);
    return url;
  } catch (error) {
    console.error("[awsS3.js]: Error generating pre-signed URL:", error);
    throw error;
  }
};

// Delete file from S3
const deleteFile = async (username, fileName) => {
  // Initialize AWS S3 client
  AWS.config.update({
    accessKeyId: process.env.AMAZON_S3_IAM_ACCESS_KEY,
    secretAccessKey: process.env.AMAZON_S3_IAM_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  const s3 = new AWS.S3();

  const params = {
    Bucket: process.env.AMAZON_S3_BUCKET,
    Key: `${username}/${fileName}`,
  };

  try {
    // Delete file from S3
    await s3.deleteObject(params).promise();
    return true;
  } catch (error) {
    console.error("[awsS3.js]: Error deleting file from S3:", error);
    throw error;
  }
};

module.exports = { generatePresignedUrl, deleteFile };
