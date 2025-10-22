import "./Markdown.css";
import React, { useEffect, useState } from 'react';
import { MathJax3Config, MathJaxContext, MathJax } from 'better-react-mathjax';
import { Graphviz } from "@hpcc-js/wasm-graphviz";
import { Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const config: MathJax3Config = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
    //processEscapes: true,
    //processEnvironments: true,
    //packages: {'[+]': ['ams', 'newcommand', 'configMacros']}
  }
};

const MarkdownViewer: React.FC = (props) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const path = queryParams.getAll("path");

  const loadPage = async (path: string[]) : Promise<string> => {
    return new Promise<string>(async (resolve) => {
      let fullPath = "";
      path.forEach((p) => {
        fullPath += `${p}/`;
      });
      fullPath = fullPath.slice(0, -1); //最後の/を削除
      console.log(fullPath);
      const md: string = await import(`../notes/${fullPath}`).then((module) => {
        return module.html;
      }
      );
      resolve(md);
    });
  }

  const [html, sethtml] = useState("")
  useEffect(() => {

    const convertSvg = async (html: string) => {
      const matches = html.matchAll(/graphvizcontent\{\{(.*?)\}\}graphvizcontent/gs).toArray();
      if (matches.length === 0) {
        sethtml(html);
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
          html = html.replace(matches[idx][0], svg);
        });
        sethtml(html);
      }).finally(() => {
        Graphviz.unload();
      })
    }
    loadPage(path).then((html) => {
      convertSvg(html);
    })
  })
  return (
    
    <MathJaxContext config={config}>
      <Link to="../notes"><Button variant="primary">目次へ戻る</Button></Link>
      <MathJax>
      <div className="markdown-top">
        <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }}>
        </div>
      </div>
      </MathJax>

    </MathJaxContext>
  );
};

export default MarkdownViewer;