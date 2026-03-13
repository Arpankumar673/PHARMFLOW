import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    registerSW({
        onNeedRefresh() {
            if (window.confirm('New update available. Reload now?')) {
                window.location.reload()
            }
        },
        onOfflineReady() {
            console.log('PharmFlow Node initialized for offline operations.')
        },
    })
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
