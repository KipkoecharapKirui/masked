import React from 'react';
import ReactMarkdown from 'react-markdown';
import { PrismAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import "./MarkDownRenderer.css"

export const MarkdownRenderer = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
       code({ node, inline, className = '', children, ...props }) {
  const match = /language-(\w+)/.exec(className);
  const codeString = Array.isArray(children) ? children.join('') : String(children);

  if (!inline && match) {
    return (
      <SyntaxHighlighter
        style={atomDark}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {codeString.trim()}
      </SyntaxHighlighter>
    );
  }

  return (
    <code className={className} {...props}>
      {codeString.trim()}
    </code>
  );
},

        p({ node, children }) {
          return <p className="markdown-paragraph">{children}</p>;
        },
        a({ node, children, ...props }) {
          return (
            <a {...props} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          );
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );
};