import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from "dotenv"
import path, { dirname } from "path" // We can use this module here bcs "vite.config.js" runs on NodeJs environment
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const __dirname = dirname(filename)

// console.log(__dirname)
// console.log(path.resolve(__dirname, "src/Config/.env"))

dotenv.config({
  path: path.resolve(__dirname, "src/Config/.env")
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
