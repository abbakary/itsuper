import React, { useState } from 'react';
import { useMessages } from '../../contexts/MessageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Send } from 'lucide-react';

interface MessageInputProps {
  ticketId: string;
}

export function MessageInput({ ticketId }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const { addMessage } = useMessages();
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !user) return;

    addMessage({
      ticketId,
      userId: user.id,
      userName: user.name,
      content: message.trim(),
      isAdmin: user.role === 'admin'
    });

    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex-1">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          rows={3}
        />
      </div>
      <button
        type="submit"
        disabled={!message.trim()}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 h-fit"
      >
        <Send className="w-4 h-4" />
        Send
      </button>
    </form>
  );
}