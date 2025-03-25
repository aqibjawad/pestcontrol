// ... existing imports ...
import { uploadToCloudinary } from '../../../components/CloudinaryUpload';

function ServiceProduct() {
  // ... existing code ...

  const handleImageUpload = async (file) => {
    try {
      const imageUrl = await uploadToCloudinary(file);
      // Use the imageUrl as needed
    } catch (error) {
      // Handle error
    }
  };

  // ... rest of the component code ...
}