/**
 * Helper function to ensure Cloudinary images load properly
 * Adds necessary parameters to prevent tracking prevention issues
 */
export const getCloudinaryImageUrl = (url) => {
  if (!url) return '';
  
  // If it's already a Cloudinary URL, ensure it has proper parameters
  if (url.includes('res.cloudinary.com')) {
    // Add fetch_format and quality parameters if not present
    const urlObj = new URL(url);
    
    // Add parameters to prevent tracking issues
    if (!urlObj.searchParams.has('f')) {
      urlObj.searchParams.set('f', 'auto'); // Auto format
    }
    if (!urlObj.searchParams.has('q')) {
      urlObj.searchParams.set('q', 'auto'); // Auto quality
    }
    
    return urlObj.toString();
  }
  
  return url;
};

