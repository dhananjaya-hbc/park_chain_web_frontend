export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  // Replace these with your actual Cloudinary details or use environment variables
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'your_unsigned_preset');
  
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your_cloud_name';
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error('Cloudinary upload error:', errorData);
    throw new Error(`Failed to upload to Cloudinary: ${errorData?.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.secure_url;
};
