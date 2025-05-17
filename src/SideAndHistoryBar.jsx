import React, { useState, useEffect } from 'react';
import './App.css';

function SideAndHistoryBar({ history, setActiveResponse, clearHistory, deleteHistoryItem }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle mobile sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile); // Open sidebar on desktop, closed on mobile
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

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

      <aside className={`side-bar ${sidebarOpen ? 'sidebar-open' : ''}`}>
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
          {history.length === 0 ? (
            <p className="empty-history">No chat history yet.</p>
          ) : (
            history.map(item => (
              <div key={item.id} className="history-item">
                <div
                  className="user-question"
                  onClick={() => {
                    setActiveResponse(item.response);
                    if (isMobile) setSidebarOpen(false);
                  }}
                >
                  <strong>{item.title}</strong>
                </div>
                <button
                  className="delete-history-button"
                  onClick={() => deleteHistoryItem(item.id)}
                  aria-label="Delete chat"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </aside>

      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar} />
      )}
    </>
  );
}

export default SideAndHistoryBar;
