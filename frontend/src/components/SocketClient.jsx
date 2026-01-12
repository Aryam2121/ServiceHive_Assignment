import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

let socket;

function SocketClient() {
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      // Connect to socket server
      socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
        withCredentials: true
      });

      // Join user's personal room
      socket.emit('join', user._id);

      // Listen for hire notifications
      socket.on('hired', (data) => {
        toast.success(data.message, {
          autoClose: 5000,
        });
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  return null;
}

export default SocketClient;
