import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';


const SocketContext = createContext(null);


export function SocketProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifUnreadCount, setNotifUnreadCount] = useState(0);


  const pathRef = useRef(location.pathname);
  useEffect(() => {
    pathRef.current = location.pathname;
  }, [location.pathname]);


  useEffect(() => {
    if (!isAuthenticated) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setConnected(false);
      return;
    }


    const socket = io('http://localhost:5000', { withCredentials: true });
    socketRef.current = socket;


    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));


    socket.on('message:new', ({ message }) => {
      if (message.sender._id === user.id) return;


      const onMessagesPage = pathRef.current.startsWith('/messages');
      if (!onMessagesPage) {
        setUnreadCount((prev) => prev + 1);
      }


      if (document.hidden && Notification.permission === 'granted') {
        new Notification(`New message from ${message.sender.name}`, {
          body: message.body,
          icon: '/favicon-32x32.png',
        });
      }
    });


    socket.on('notification:new', (notification) => {
      const onNotificationsPage = pathRef.current.startsWith('/notifications');
      if (!onNotificationsPage) {
        setNotifUnreadCount((prev) => prev + 1);
      }


      if (document.hidden && Notification.permission === 'granted') {
        new Notification('Devnexa', { body: notification.message, icon: '/favicon-32x32.png' });
      }
    });


    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, user]);


  function clearUnread() {
    setUnreadCount(0);
  }


  function clearNotifUnread() {
    setNotifUnreadCount(0);
  }


  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        connected,
        unreadCount,
        clearUnread,
        notifUnreadCount,
        clearNotifUnread,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}


export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used inside a <SocketProvider>');
  return ctx;
}