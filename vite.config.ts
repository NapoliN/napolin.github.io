import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { plugin as markdown, PluginOptions as MdOption, Mode as MdMode } from "vite-plugin-markdown"
import Shiki from '@shikijs/markdown-it'
import MarkdownIt from 'markdown-it'
import MarkdownItContainer from 'markdown-it-container'

const md = MarkdownIt()

Shiki({
  themes: {
    light: 'tokyo-night',
    dark: 'tokyo-night'
  }
}).then((highlighter) => {
  md.use(highlighter)
})

const containers = [
  { type: 'info', class: 'info' },
  { type: 'warning', class: 'warning' },
  { type: 'error', class: 'error' },
  { type: 'success', class: 'success' },
];

containers.forEach((container) => {
  md.use(MarkdownItContainer, container.type, {
    render(tokens, idx) {
      const token = tokens[idx];
      if (token.nesting === 1) {
        // 開始タグ
        return `<div class="${container.class}">\n`;
      } else {
        // 終了タグ
        return '</div>\n';
      }
    },
  });
});

const mdOption: MdOption = {
  mode: [MdMode.HTML],
  markdownIt: md
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), markdown(mdOption)],
  build: {
    outDir: './docs',

  },
  optimizeDeps: {
    exclude: ["react-icons", "react-router-dom"]
  }
})
