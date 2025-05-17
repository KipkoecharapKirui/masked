
import React, { useState, useEffect } from 'react';
import MainPage from './MainPage';
import SideAndHistoryBar from './SideAndHistoryBar';
import './App.css';

function App() {
  const [activeResponse, setActiveResponse] = useState('');
  const [history, setHistory] = useState([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch {
        localStorage.removeItem('chatHistory'); // Clean corrupted data
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(history));
    } else {
      localStorage.removeItem('chatHistory');
    }
  }, [history]);

  // Updated addToHistory function to accept title
  const addToHistory = ({ title, question, response, isImageQuery = false }) => {
    const finalResponse = response?.trim() ? response : "No response generated";
    
    // Generate fallback title if none provided
    const finalTitle = title || 
      question.split(/\s+/).slice(0, 5).join(' ') || 
      (isImageQuery ? "Image Query" : "New Chat");

    const newItem = {
      id: Date.now(),
      title: finalTitle,
      question,
      response: finalResponse,
      isImageQuery,
      timestamp: new Date().toISOString(),
    };

    setHistory(prev => [newItem, ...prev]);
    setActiveResponse(finalResponse);
  };

  // Clear all history and active response
  const clearHistory = () => {
    setHistory([]);
    setActiveResponse('');
  };

  return (
    <div className="app-container">
      <SideAndHistoryBar
        history={history}
        setActiveResponse={setActiveResponse}
        clearHistory={clearHistory}
      />
      <MainPage
        addToHistory={addToHistory}
        activeResponse={activeResponse}
      />
    </div>
  );
}

export default App;