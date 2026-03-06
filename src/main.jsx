import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import './styles/mobile.css'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'
import { SplashScreen } from '@capacitor/splash-screen'

// Initialize Capacitor plugins for mobile
const initCapacitor = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      // Set status bar style
      await StatusBar.setStyle({ style: Style.Light })
      await StatusBar.setBackgroundColor({ color: '#2563eb' })
      
      // Hide splash screen after app is ready
      window.addEventListener('load', () => {
        setTimeout(async () => {
          try {
            await SplashScreen.hide()
          } catch (error) {
            // Ignore errors if splash screen already hidden
            console.log('Splash screen already hidden')
          }
        }, 2000)
      })
    } catch (error) {
      // Ignore errors in web environment
      console.log('Capacitor plugins not available in web environment')
    }
  }
}

// Initialize Capacitor
initCapacitor()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
