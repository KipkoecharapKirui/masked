import React, { useState, useEffect } from 'react';
import MainPage from './MainPage';
import SideAndHistoryBar from './SideAndHistoryBar';
import './App.css';

function App() {
  const [activeResponse, setActiveResponse] = useState('');
  const [history, setHistory] = useState([]);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("chatHistory");
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  // Save history when it changes
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(history));
  }, [history]);

  const addToHistory = (question, response) => {
    const newItem = {
      question,
      response,
      timestamp: new Date().toISOString(),
      id: Date.now()
    };
    setHistory(prev => [newItem, ...prev]);
    setActiveResponse(response);
  };

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