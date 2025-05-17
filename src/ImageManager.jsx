import React from 'react';
import './App.css'

export const ImageManager = ({ 
  showImageManager, 
  setShowImageManager, 
  bgImages, 
  setBgImages,
  currentBgIndex,
  setCurrentBgIndex
}) => {
  const handleImageUpload = (files) => {
    const newImages = [...bgImages];
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newImages.push(e.target.result);
        setBgImages(newImages);
        localStorage.setItem('backgroundImages', JSON.stringify(newImages));
      };
      reader.readAsDataURL(file);
    });
    setShowImageManager(false);
  };

  return (
    showImageManager && (
      <div className="image-manager-modal">
        <div className="image-manager">
          <h3>Upload Background Images</h3>
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={(e) => handleImageUpload(e.target.files)}
            className="image-upload-input"
          />
          <div className="current-images">
            <h4>Current Backgrounds ({bgImages.length})</h4>
            <div className="image-grid">
              {bgImages.map((img, index) => (
                <div key={index} className="image-thumbnail">
                  <img 
                    src={img} 
                    alt={`Background ${index}`}
                    className={index === currentBgIndex ? 'active' : ''}
                  />
                  <button 
                    onClick={() => {
                      const updated = bgImages.filter((_, i) => i !== index);
                      setBgImages(updated);
                      localStorage.setItem('backgroundImages', JSON.stringify(updated));
                      if (currentBgIndex >= updated.length) {
                        setCurrentBgIndex(0);
                      }
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button 
            className="close-manager"
            onClick={() => setShowImageManager(false)}
          >
            Close
          </button>
        </div>
      </div>
    )
  );
};