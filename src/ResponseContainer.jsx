import React from 'react';
import { MarkdownRenderer } from './MarkDownRenderer';
import './App.css'

export const ResponseContainer = ({ activeResponse, loading }) => {
  return (
    activeResponse && (
      <div className="response-container">
        <div className="response">
          <h3>🤖 Gemini</h3>
          <div className="response-content">
            {loading ? (
              <div className="loading-indicator">
                <div className="loading-spinner"></div>
                <p>Generating response...</p>
              </div>
            ) : (
              <MarkdownRenderer content={activeResponse} />
            )}
          </div>
        </div>
      </div>
    )
  );
};