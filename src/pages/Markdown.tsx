import "./Markdown.css";
import React, { useEffect, useState } from 'react';
import { MathJax3Config, MathJaxContext, MathJax } from 'better-react-mathjax';
import { Graphviz } from "@hpcc-js/wasm-graphviz";
import { Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import mermaid from "mermaid";

const config: MathJax3Config = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
    //processEscapes: true,
    //processEnvironments: true,
    //packages: {'[+]': ['ams', 'newcommand', 'configMacros']}
  }
};

const MarkdownViewer: React.FC = (_) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const path = queryParams.getAll("path");

  const loadPage = async (path: string[]): Promise<string> => {
    // パスを連結して "../notes/xxx/yyy.md" の形に変換
    const fullPath = `../notes/${path.join("/").slice(0, -3)}.md`;

    // すべてのMarkdownファイルを事前にマップ化
    const modules = import.meta.glob("../notes/**/*.md");

    // 対応するファイルが存在するかチェック
    const importer = modules[fullPath];
    if (!importer) {
      throw new Error(`Markdown file not found: ${fullPath}`);
    }

    // 動的importを実行してモジュールを読み込み
    const module = await importer();
    // @ts-ignore
    return module.html;
  };

  const [html, sethtml] = useState("")
  useEffect(() => {

    const convertSvg = async (html: string): Promise<string> => {
      const matches = html.matchAll(/graphvizcontent\{\{(.*?)\}\}graphvizcontent/gs).toArray();
      if (matches.length === 0) {
        return html;
      }

      return Graphviz.load().then((graphviz) => {
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
        return html;
      }).finally(() => {
        Graphviz.unload();
      });
    }

    loadPage(path)
      .then(async (_html) => convertSvg(_html))
      .then((_html) => {
        sethtml(_html);
      });
  }, [html])

  return (

    <MathJaxContext config={config}>
      <Link to="../notes"><Button variant="primary">目次へ戻る</Button></Link>
      <MathJax>
        <div className="markdown-top">
          <div className="markdown-body"
            dangerouslySetInnerHTML={{ __html: html }}
            // mermaidの描画
            ref={(el) => {
              if (!el) return;
              const mermaidDivs = el.getElementsByClassName("mermaid");
              Array.from(mermaidDivs).map((div, _) => {
                // @ts-ignore
                mermaid.init({}, div);
              })

            }}
          >
          </div>
        </div>
      </MathJax>

    </MathJaxContext>
  );
};

export default MarkdownViewer;