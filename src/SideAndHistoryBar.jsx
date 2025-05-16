import React, { useState, useEffect } from 'react';
import './App.css';

function SideAndHistoryBar({ history, setActiveResponse, clearHistory }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile view on mount and resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      // Close sidebar by default on mobile
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true); // Open by default on desktop
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      
      {isMobile && (
        <button 
          className={`sidebar-toggle ${sidebarOpen ? 'open' : ''}`}
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>
      )}

      
      <div className={`side-bar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        
        {isMobile && (
          <button 
            className="sidebar-close" 
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        )}
        
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
                if (isMobile) setSidebarOpen(false);
              }}
            >
              <div className="user-question">
                <strong>Q:</strong> {item.question}
              </div>
            </div>
          ))}
        </div>
      </div>

      
      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar} />
      )}
    </>
  );
}

export default SideAndHistoryBar;