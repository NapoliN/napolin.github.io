import "./Markdown.css";
import React, { useEffect, useState } from 'react';
import { MathJax3Config, MathJaxContext } from 'better-react-mathjax';
import { Graphviz } from "@hpcc-js/wasm-graphviz";

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
  const [html, sethtml] = useState("")
  useEffect(() => {
    let result = props.Markdown
    const convertSvg = async () => {
      const matches = result.matchAll(/graphvizcontent\{\{(.*?)\}\}graphvizcontent/gs).toArray();
      if (matches.length === 0) {
        sethtml(result);
        return;
      }

      Graphviz.load().then((graphviz) => {
        return Promise.all(
          matches.map(async (match) => {
            const content = match[1];
            return graphviz.dot(content, "svg");
          })
        );
      }).then((svgs) => {
        svgs.forEach((svg, idx) => {
          result = result.replace(matches[idx][0], svg);
        });
        sethtml(result);
      }).finally(() => {
        Graphviz.unload();
      })
    }
    convertSvg();
  }, [])
  return (
    <MathJaxContext config={config}>
      <div className="markdown-top">
        <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }}>
        </div>
      </div>
    </MathJaxContext>
  );
};

export default MarkdownViewer;