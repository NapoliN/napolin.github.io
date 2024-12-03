import { ReactComponent as Markdown } from '../notes/helloworld.md';
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


const MarkdownViewer = () => {
  return (
    <MathJaxContext config={config}>
        <div className="markdown-body">
            <Markdown />
        </div>
    </MathJaxContext>
  );
};

export default MarkdownViewer;