'use client';

import { Button } from '@/components/ui/button';
import { useSocket } from '@/lib/socket/useSocket';
import { useEffect, useState } from 'react';

export default function SocketInfo() {
  const { isConnected, socketId, on, emit, disconnect } = useSocket();
  const [notification, setNotification] = useState<any>(null);

  useEffect(() => {
    // Listen ke notification:reminder
    on('notification:reminder', (data) => {
      console.log('Notifikasi diterima:', data);
      setNotification(data);
    });
  }, [on]);

  const sendTestNotification = () => {
    emit('notification:test', { message: 'Hello from Frontend!' });
  };

  const handleDisconnect = () => {
    disconnect();
    console.log('Socket disconnected manually');
  };
  return null;
  return (
    <div className="fixed bottom-[4.8rem] right-4 z-[100000000000] bg-white p-4 border border-gray-300 rounded shadow-lg">
      <p>Status: {isConnected ? '✅ Connected' : '❌ Disconnected'}</p>
      <p>Socket ID: {socketId}</p>

      {notification && (
        <div>
          <h3>Notifikasi</h3>
          <p>{notification.message}</p>
        </div>
      )}

      <Button
        onClick={sendTestNotification}
        disabled={!isConnected}
      >
        Kirim Test
      </Button>
      <Button
        onClick={handleDisconnect}
        disabled={!isConnected}
        variant="destructive"
      >
        Off Socket
      </Button>
    </div>
  );
}
