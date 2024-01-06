import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.jsx'
import './index.css'

const sessionId = import.meta.env.VITE_SESH
console.log(sessionId)
document.cookie = `jet-session=${sessionId}; path=/; Secure; SameSite=None`;
console.log(`Cookie set:  ${document.cookie}`);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
