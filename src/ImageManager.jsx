// ImageManager.jsx
import React, { useState } from 'react';

function ImageManager({ onImagesUpdate, onClose }) {  // Added onClose prop
  const [images, setImages] = useState([]);
  const [newImage, setNewImage] = useState(null);

  // Load saved images from localStorage on component mount
  useEffect(() => {
    const savedImages = localStorage.getItem('backgroundImages');
    if (savedImages) {
      setImages(JSON.parse(savedImages));
    }
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addImage = () => {
    if (newImage) {
      const updatedImages = [newImage, ...images];
      setImages(updatedImages);
      localStorage.setItem('backgroundImages', JSON.stringify(updatedImages));
      setNewImage(null);
      onImagesUpdate(updatedImages);
      onClose();  // Close the manager after adding
    }
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    localStorage.setItem('backgroundImages', JSON.stringify(updatedImages));
    onImagesUpdate(updatedImages);
  };

  return (
    <div className="image-manager">
      <h3>Manage Background Images</h3>
      
      <div className="image-upload">
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {newImage && (
          <>
            <img src={newImage} alt="Preview" className="image-preview" />
            <button onClick={addImage}>Add This Image</button>
          </>
        )}
      </div>

      <div className="image-list">
        {images.map((img, index) => (
          <div key={index} className="image-item">
            <img src={img} alt={`Background ${index}`} />
            <button onClick={() => removeImage(index)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageManager;