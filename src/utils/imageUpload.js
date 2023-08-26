import s3 from "../config/s3_config.js";

//upload file to AWS
export const s3FileUpload = async ({ bucketName, key, body, contentType }) => {
  return await s3
    .upload({
      Bucket: bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
    .promise();
};

//delete file from AWS
export const s3delete = async ({ bucketName, key }) => {
  return await s3
    .deleteObject({
      Bucket: bucketName,
      Key: key,
    })
    .promise();
};
