import React from 'react';
import { useMessages } from '../../contexts/MessageContext';
import { useAuth } from '../../contexts/AuthContext';
import { MessageCircle, User, UserCog } from 'lucide-react';

interface MessageListProps {
  ticketId: string;
}

export function MessageList({ ticketId }: MessageListProps) {
  const { getMessagesByTicketId } = useMessages();
  const { user } = useAuth();
  const messages = getMessagesByTicketId(ticketId);

  if (messages.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-3 ${
            message.userId === user?.id ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`flex gap-3 max-w-xs lg:max-w-md ${
              message.userId === user?.id ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              message.isAdmin 
                ? 'bg-indigo-100 text-indigo-600' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {message.isAdmin ? (
                <UserCog className="w-4 h-4" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            
            <div className={`flex flex-col ${
              message.userId === user?.id ? 'items-end' : 'items-start'
            }`}>
              <div className={`rounded-lg px-4 py-2 ${
                message.userId === user?.id
                  ? 'bg-indigo-600 text-white'
                  : message.isAdmin
                  ? 'bg-blue-50 text-blue-900 border border-blue-200'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm">{message.content}</p>
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">{message.userName}</span>
                <span className="text-xs text-gray-400">
                  {new Date(message.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}