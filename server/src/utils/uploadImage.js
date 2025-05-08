import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

(async function run() {
  // Configuration
  cloudinary.config({
    cloud_name: 'dnx1z3x3h',
    api_key: '382563131649838',
    api_secret: '8r2weTOOAhr-S9rVb2ycW2Xixy8', // Click 'View API Keys' above to copy your API secret
  });

  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload('logop.png', {
      public_id: 'logop', // The public ID used to store the image in your Cloudinary account
      resource_type: 'image',
    })
    .then((result) => {
      console.log(result);
      return result;
    })
    .catch((error) => {
      console.log(error);
    });

  console.log(uploadResult);

  // Optimize delivery by resizing and applying auto-format and auto-quality
  const optimizeUrl = cloudinary.url('logo', {
    fetch_format: 'auto',
    quality: 'auto',
  });

  console.log(optimizeUrl);

  // Transform the image: auto-crop to square aspect_ratio
  const autoCropUrl = cloudinary.url('logo', {
    crop: 'auto',
    gravity: 'auto',
    width: 500,
    height: 500,
  });

  console.log(autoCropUrl);
}());
