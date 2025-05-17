
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

  // Add new chat entry to history
  const addToHistory = ({ title, question, response, isImageQuery = false }) => {
    const finalResponse = response?.trim() ? response : "No response generated";
    const finalTitle = title || question.split(/\s+/).slice(0, 5).join(' ') || (isImageQuery ? "Image Query" : "New Chat");

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

  // Clear all chat history
  const clearHistory = () => {
    setHistory([]);
    setActiveResponse('');
  };

  // Delete a single history item by id
  const deleteHistoryItem = (id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    // Optional: If the deleted item was activeResponse, clear it
    if (activeResponse && history.find(item => item.id === id)?.response === activeResponse) {
      setActiveResponse('');
    }
  };

  return (
    <div className="app-container">
      <SideAndHistoryBar
        history={history}
        setActiveResponse={setActiveResponse}
        clearHistory={clearHistory}
        deleteHistoryItem={deleteHistoryItem}  
      />
      <MainPage
        addToHistory={addToHistory}
        activeResponse={activeResponse}
      />
    </div>
  );
}

export default App;
