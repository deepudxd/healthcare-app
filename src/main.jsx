import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import './styles/mobile.css'

// Initialize Capacitor plugins for mobile (dynamic import to avoid crashes on web)
const initCapacitor = async () => {
  try {
    const { Capacitor } = await import('@capacitor/core')
    if (Capacitor.isNativePlatform()) {
      const { StatusBar, Style } = await import('@capacitor/status-bar')
      const { SplashScreen } = await import('@capacitor/splash-screen')

      // Set status bar style
      await StatusBar.setStyle({ style: Style.Light })
      await StatusBar.setBackgroundColor({ color: '#2563eb' })

      // Hide splash screen after app is ready
      window.addEventListener('load', () => {
        setTimeout(async () => {
          try {
            await SplashScreen.hide()
          } catch (error) {
            console.log('Splash screen already hidden')
          }
        }, 2000)
      })
    }
  } catch (error) {
    // Capacitor not available in web-only environment
    console.log('Running in web mode, Capacitor plugins skipped')
  }
}

// Initialize Capacitor
initCapacitor()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
