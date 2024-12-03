import { ReactComponent as Markdown } from '../notes/helloworld.md';


const MarkdownViewer = () => {
  return (
    <div className="markdown-body">
        <Markdown />
    </div>
  );
};

export default MarkdownViewer;