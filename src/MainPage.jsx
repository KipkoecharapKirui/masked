import React, { useState, useEffect, useRef } from 'react';
import { fetchOpenAIResponse } from './FetchOpenAI';
import './App.css';

function MainPage({ addToHistory, activeResponse }) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [bgImages, setBgImages] = useState([]);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [showImageManager, setShowImageManager] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [imageSearch, setImageSearch] = useState(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

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

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuestion(transcript);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
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
    if (!question.trim() && !imageSearch) return;
    setLoading(true);

    try {
      let result;
      if (imageSearch) {
        // Here you would typically send the image to your API
        // For demo purposes, we'll just use a placeholder
        result = await fetchOpenAIResponse(
          `[Image attached] ${question || "What's in this image?"}`, 
          imageSearch
        );
        setImageSearch(null); // Clear after submission
      } else {
        result = await fetchOpenAIResponse(question);
      }
      
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

  const handleImageSearch = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSearch(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleVoiceRecognition = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
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
          {imageSearch && (
            <div className="image-preview-container">
              <img src={imageSearch} alt="Search preview" className="image-search-preview" />
              <button 
                type="button" 
                className="remove-image-button"
                onClick={() => setImageSearch(null)}
              >
                ×
              </button>
            </div>
          )}
          <div className="input-container">
            <input 
              className="input-bar"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={imageSearch ? "Ask about this image..." : "Talk to me..."}
              disabled={loading}
            />
            <div className="input-buttons">
              <button 
                type="button" 
                className={`voice-button ${isListening ? 'listening' : ''}`}
                onClick={toggleVoiceRecognition}
                disabled={loading}
              >
                {isListening ? '🎤' : '🎤'}
              </button>
              <button 
                type="button" 
                className="image-upload-button"
                onClick={() => fileInputRef.current.click()}
                disabled={loading}
              >
                📷
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageSearch}
                style={{ display: 'none' }}
              />
            </div>
          </div>
          <button className="submit-button" type="submit" disabled={loading}>
            {loading ? 'Thinking...' : '➢'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default MainPage;