import "./Markdown.css";
import React from 'react';
import { MathJax3Config, MathJaxContext } from 'better-react-mathjax';

const config: MathJax3Config = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
    //processEscapes: true,
    //processEnvironments: true,
    //packages: {'[+]': ['ams', 'newcommand', 'configMacros']}
  }
};


const MarkdownViewer: React.FC<{ Markdown: string }> = (props) => {
  return (
    <MathJaxContext config={config}>
      <div className="markdown-top">
        <div className="markdown-body" dangerouslySetInnerHTML={{ __html: props.Markdown }}>
        </div>
      </div>
    </MathJaxContext>
  );
};

export default MarkdownViewer;