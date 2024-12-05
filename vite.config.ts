import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { plugin as markdown, PluginOptions as MdOption, Mode as MdMode } from "vite-plugin-markdown"

const mdOption: MdOption = {
  mode: [MdMode.HTML],
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
