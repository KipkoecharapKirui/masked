import React, { useRef } from 'react';
import './App.css'

export const ChatInput = ({
  question,
  setQuestion,
  loading,
  imageSearch,
  setImageSearch,
  handleSubmit,
  toggleVoiceRecognition,
  isListening,
  textareaRef
}) => {
  const fileInputRef = useRef(null);

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

  return (
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
        <textarea 
          ref={textareaRef}
          className="input-bar"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={imageSearch ? "Ask about this image..." : "Talk to me..."}
          disabled={loading}
          rows={1}
          onInput={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
          }}
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
  );
};