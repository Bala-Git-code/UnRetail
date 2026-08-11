import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'unretail-cloud',
  api_key: process.env.CLOUDINARY_API_KEY || '123456789012345',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'YourCloudinaryApiSecretHere',
});

export const generateCloudinarySignature = (folder: string = 'unretail-listings') => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const paramsToSign = {
    timestamp,
    folder,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET || 'YourCloudinaryApiSecretHere'
  );

  return {
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY || '123456789012345',
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'unretail-cloud',
    folder,
  };
};

export default cloudinary;
