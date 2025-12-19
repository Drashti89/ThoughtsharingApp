import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import store from './store/store'
import { BrowserRouter } from "react-router-dom";


createRoot(document.getElementById('root')).render(
      <Provider store={store}>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
    </Provider>
)
