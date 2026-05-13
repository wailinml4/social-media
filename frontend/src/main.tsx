import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { PostProvider } from './context/PostContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'
import { SocketProvider } from './context/SocketContext.jsx'
import { ConversationProvider } from './context/ConversationContext.jsx'
import { MessageProvider } from './context/MessageContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')!).render(
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
