import React, { useState, useEffect } from 'react';
import { fetchOpenAIResponse } from './FetchOpenAI';
import './App.css';

function MainPage({ addToHistory, activeResponse }) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [bgImages, setBgImages] = useState([]);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [showImageManager, setShowImageManager] = useState(false);

  // Load images from localStorage
  useEffect(() => {
    const savedImages = localStorage.getItem('backgroundImages');
    if (savedImages) {
      setBgImages(JSON.parse(savedImages));
    } else {
      setBgImages([
        'https://i.pinimg.com/736x/6c/5f/45/6c5f45a6877ff424cf103aba4881c7e4.jpg'
      ]);
    }
  }, []);

  // Apply background style
  useEffect(() => {
    const mainPage = document.querySelector('.main-page');
    if (bgImages.length > 0) {
      mainPage.style.backgroundImage = `url(${bgImages[currentBgIndex]})`;
    }
  }, [bgImages, currentBgIndex]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);

    try {
      const result = await fetchOpenAIResponse(question);
      addToHistory(question, result);
      setCurrentBgIndex(prev => (prev + 1) % bgImages.length);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setQuestion('');
    }
  };

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
    <div className="main-page">
      <button 
        className="settings-button"
        onClick={() => setShowImageManager(!showImageManager)}
      >
        ⚙️
      </button>

      {showImageManager && (
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
      )}

      <div className={`content-wrapper ${showImageManager ? 'blur-content' : ''}`}>
        {activeResponse && (
          <div className="response-container">
            <div className="response">
              <h3>Response:</h3>
              <p>{activeResponse}</p>
            </div>
          </div>
        )}
        
        <form className={`chat-form ${loading ? 'loading' : ''}`} onSubmit={handleSubmit}>
          <input 
            className="input-bar"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Talk to me ..."
            disabled={loading}
          />
          <button className="submit-button" type="submit" disabled={loading}>
            {loading ? 'Thinking...' : '➢'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default MainPage;
