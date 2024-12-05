import React from 'react';
import { MathJax3Config, MathJaxContext } from 'better-react-mathjax';

const config: MathJax3Config = {
    tex:{
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        //processEscapes: true,
        //processEnvironments: true,
        //packages: {'[+]': ['ams', 'newcommand', 'configMacros']}
    }
};


const MarkdownViewer: React.FC<{Markdown: React.FC}> = (props) => {
  return (
    <MathJaxContext config={config}>
        <div className="markdown-body">
          <props.Markdown />
        </div>
    </MathJaxContext>
  );
};

export default MarkdownViewer;