import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { PostProvider } from './context/PostContext'
import { NotificationProvider } from './context/NotificationContext'
import { SocketProvider } from './context/SocketContext'
import { ConversationProvider } from './context/ConversationContext'
import { MessageProvider } from './context/MessageContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <ConversationProvider>
            <MessageProvider>
              <PostProvider>
                <NotificationProvider>
                  <App />
                </NotificationProvider>
              </PostProvider>
            </MessageProvider>
          </ConversationProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
