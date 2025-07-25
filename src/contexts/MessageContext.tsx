import React, { createContext, useContext, useState, useEffect } from 'react';
import { Message } from '../types';

interface MessageContextType {
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'createdAt'>) => void;
  getMessagesByTicketId: (ticketId: string) => Message[];
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Load messages from localStorage
    const storedMessages = localStorage.getItem('helpdesk_messages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    } else {
      // Initialize with demo messages
      const demoMessages: Message[] = [
        {
          id: '1',
          ticketId: '1',
          userId: '2',
          userName: 'John Doe',
          content: 'I tried unplugging and plugging back in, but still no response.',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          isAdmin: false
        },
        {
          id: '2',
          ticketId: '1',
          userId: '1',
          userName: 'John Smith (IT Manager)',
          content: 'Thanks for the additional info. Can you check if the power LED on the power supply is lit?',
          createdAt: new Date(Date.now() - 1800000).toISOString(),
          isAdmin: true
        },
        {
          id: '3',
          ticketId: '2',
          userId: '1',
          userName: 'Sarah Johnson (Senior Tech)',
          content: 'I\'ve run initial diagnostics and found potential memory issues. Please keep the system running and avoid intensive tasks while I investigate further.',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          isAdmin: true
        }
      ];
      setMessages(demoMessages);
      localStorage.setItem('helpdesk_messages', JSON.stringify(demoMessages));
    }
  }, []);

  const addMessage = (messageData: Omit<Message, 'id' | 'createdAt'>) => {
    const newMessage: Message = {
      ...messageData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem('helpdesk_messages', JSON.stringify(updatedMessages));
  };

  const getMessagesByTicketId = (ticketId: string) => {
    return messages.filter(message => message.ticketId === ticketId);
  };

  return (
    <MessageContext.Provider value={{ messages, addMessage, getMessagesByTicketId }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
}