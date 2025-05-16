import React, { useState } from 'react';
import './App.css';

function SideAndHistoryBar({ history, setActiveResponse, clearHistory }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
    
      <button className="settings-button" onClick={toggleSidebar}>
        ☰
      </button>

      
      <div className={`side-bar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <button className="newchat-button" onClick={clearHistory}>
          + New Chat
        </button>
        <h3 className="history-header">History</h3>
        <div className="history-container">
          {history.map((item) => (
            <div
              key={item.id}
              className="history-item"
              onClick={() => {
                setActiveResponse(item.response);
                setSidebarOpen(false); 
              }}
            >
              <div className="user-question">
                <strong>Q:</strong> {item.question}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default SideAndHistoryBar;
