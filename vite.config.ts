import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { plugin as markdown, PluginOptions as MdOption, Mode as MdMode } from "vite-plugin-markdown"
import Shiki from '@shikijs/markdown-it'
import MarkdownIt from 'markdown-it'

const md = MarkdownIt()

Shiki({
  themes: {
    light: 'tokyo-night',
    dark: 'tokyo-night'
  }
}).then((highlighter) => {
  md.use(highlighter)
})


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
