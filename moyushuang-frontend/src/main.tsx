import { createRoot } from 'react-dom/client'
import { App } from './App'
import '@ant-design/v5-patch-for-react-19'
import './assets/css/index.css'

createRoot(document.getElementById('root')!).render(<App />)
