import React, { useState, useEffect, useRef } from 'react';
import { fetchGeminiResponse } from './fetchGeminiResponse';
import 'speech-recognition-polyfill';
import { ImageManager } from './ImageManager';
import { ResponseContainer } from './ResponseContainer';
import { ChatInput } from './ChatInput';
import './App.css';

function MainPage({ addToHistory, activeResponse }) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [bgImages, setBgImages] = useState([]);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [showImageManager, setShowImageManager] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [imageSearch, setImageSearch] = useState(null);
  const recognitionRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        160
      )}px`;
    }
  }, [question]);

  // Initialize background images and speech recognition
  useEffect(() => {
    const savedImages = localStorage.getItem('backgroundImages');
    if (savedImages) {
      setBgImages(JSON.parse(savedImages));
    } else {
      setBgImages([
        'https://i.pinimg.com/736x/6c/5f/45/6c5f45a6877ff424cf103aba4881c7e4.jpg'
      ]);
    }

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

  const generateTitle = async (question, response) => {
    try {
      // Ask Gemini to generate a concise title
      const titleResponse = await fetchGeminiResponse(
        `Generate a 3-5 word title summarizing this Q&A pair:\n\n` +
        `Q: ${question}\nA: ${response}\n\n` +
        `Respond with ONLY the title, no additional text.`
      );
      
      // Clean up the title response
      return titleResponse.replace(/['"]/g, '').trim().slice(0, 50);
    } catch (error) {
      console.error("Title generation failed:", error);
      // Fallback to first few words of the question
      return question.split(/\s+/).slice(0, 5).join(' ') || "New Chat";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() && !imageSearch) return;
    setLoading(true);

    try {
      let response;
      if (imageSearch) {
        response = await fetchGeminiResponse(
          `[Image attached] ${question || "What's in this image?"}`, 
          imageSearch
        );
        setImageSearch(null);
      } else {
        response = await fetchGeminiResponse(question);
      }
      
      // Generate title for this conversation
      const title = await generateTitle(question, response);
      
      // Add to history with the generated title only
      addToHistory({
        title,
        question: title,
        response,
        isImageQuery: !!imageSearch
      });
      
      setCurrentBgIndex((prev) => (prev + 1) % bgImages.length);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setQuestion('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
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
    <div className="app-mainpagecontainer">
      <div className="main-page">
        <button 
          className="settings-button"
          onClick={() => setShowImageManager(!showImageManager)}
        >
          ⚙️
        </button>

        <ImageManager 
          showImageManager={showImageManager}
          setShowImageManager={setShowImageManager}
          bgImages={bgImages}
          setBgImages={setBgImages}
          currentBgIndex={currentBgIndex}
          setCurrentBgIndex={setCurrentBgIndex}
        />

        <div className={`content-wrapper ${showImageManager ? 'blur-content' : ''}`}>
          <ResponseContainer activeResponse={activeResponse} loading={loading} />
          
          <ChatInput
            question={question}
            setQuestion={setQuestion}
            loading={loading}
            imageSearch={imageSearch}
            setImageSearch={setImageSearch}
            handleSubmit={handleSubmit}
            toggleVoiceRecognition={toggleVoiceRecognition}
            isListening={isListening}
            textareaRef={textareaRef}
          />
        </div>
      </div>
    </div>
  );
}

export default MainPage;