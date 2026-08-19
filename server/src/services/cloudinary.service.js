import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'unretail-cloud',
  api_key: process.env.CLOUDINARY_API_KEY || '123456789012345',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'YourCloudinaryApiSecretHere',
});

export const generateCloudinarySignature = (folder = 'unretail-listings') => {
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

export const uploadToCloudinary = async (fileData, folder = 'unretail-kyc-docs') => {
  try {
    if (!fileData) {
      throw new Error('No file data provided for Cloudinary upload');
    }

    // If fileData is already a valid http(s) URL and not a data URI, we can return or re-upload it
    if (typeof fileData === 'string' && fileData.startsWith('http') && !fileData.includes('cloudinary')) {
      const result = await cloudinary.uploader.upload(fileData, {
        folder,
        resource_type: 'auto',
      });
      return result.secure_url || result.url;
    }

    // Upload base64 / data URI
    const result = await cloudinary.uploader.upload(fileData, {
      folder,
      resource_type: 'auto',
    });

    return result.secure_url || result.url;
  } catch (error) {
    console.warn('Cloudinary server-side upload fallback:', error.message || error);
    // If Cloudinary upload fails or uses mock keys, return the fileData if it's already a URL/DataURI
    return fileData;
  }
};

export default cloudinary;
