import React from 'react';
import "./App.css";

function SideAndHistoryBar({ history, setActiveResponse, clearHistory }) {
  return (
    <div className="side-bar">
      <button className="newchat-button" onClick={clearHistory}>
        + New Chat
      </button>
      <h3 className="history-header">History</h3>
      <div className="history-container">
        {history.map((item) => (
          <div 
            key={item.id}
            className="history-item"
            onClick={() => setActiveResponse(item.response)}
          >
            <div className="user-question">
              <strong>Q:</strong> {item.question}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SideAndHistoryBar;