'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ScrollArea, Card, Text, Button, TextInput, Stack, Divider, Box, Flex, Container, Paper } from '@mantine/core';
import { Apiconversation, Transaction } from 'api/conversations/route';
import { UserResponse } from '@/_components/profile/UserDetail';



interface Message {
  id: number;
  content: string;
  sender_id: number;
  created_at: string;
}

const ChatPage = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [conversations, setConversations] = useState<Apiconversation>();
  const [selectedConversation, setSelectedConversation] = useState<Transaction | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userData, setUserData] = useState<UserResponse>();
  const [error, setError] = useState(null);

  // Connect to Socket.IO server
  useEffect(() => {
    const newSocket = io('http://localhost:4001'); // Update with your server URL
    setSocket(newSocket);

    // Clean up on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Fetch conversations on page load
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch('/api/conversations');
        const data = await response.json();
        console.log("🚀 ~ fetchConversations ~ data:", data)
        setConversations(data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
  }, []);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user-profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Check if the request was successful
        if (response.ok) {
          const data = await response.json();
          console.log("🚀 ~ fetchUserData ~ data:", data)
          setUserData(data); // Assuming userData is in the response
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Something went wrong');
        }
      } catch (error) {
        // setError(error.message || 'An error occurred');
      }
    };
    fetchUserData()
  }, [])


  // Fetch messages for the selected conversation
  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/conversations/${selectedConversation.id}/messages`);
        const data = await response.json();
        console.log("🚀 ~ fetchMessages ~ data:", data)
        setMessages(data ? data : []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [selectedConversation]);

  // Listen for real-time messages
  useEffect(() => {
    if (!socket || !selectedConversation) return;

    socket.emit('joinConversation', selectedConversation.id);

    socket.on('newMessage', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.emit('leaveConversation', selectedConversation.id);
      socket.off('newMessage');
    };
  }, [socket, selectedConversation]);

  // Send a new message
  const handleSendMessage = async () => {
    if (!selectedConversation || !newMessage.trim()) return;

    try {
      const response = await fetch(`/api/conversations/${selectedConversation.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const message = await response.json();

      // Emit the new message via Socket.IO
      socket?.emit('sendMessage', {
        conversationId: selectedConversation.id,
        message,
      });

      // Update the message list
      setMessages((prev) => [...prev, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Container my={'lg'} styles={{ root: { flex: '1 0 auto', width: '100%' } }} size={'lg'}>

      <Paper withBorder>
        <Flex style={{ height: '80vh' }}>
          {/* Sidebar */}
          <Box
            style={{
              width: '25%',
              backgroundColor: '#f5f5f5', // Matches bg-gray-100
              borderRight: '1px solid #e0e0e0', // Matches border-r
              padding: '16px', // Matches p-4
            }}
          >
            <Text size="lg" fw={700} style={{ marginBottom: '16px' }}>
              Conversations
            </Text>
            <ScrollArea>
              {conversations?.data.map((conversation) => (
                <Card
                  key={conversation.id}
                  shadow="sm"
                  padding="md"
                  radius="md"
                  onClick={() => setSelectedConversation(conversation)}
                  style={{
                    marginBottom: '8px', // Matches mb-2
                    cursor: 'pointer',
                    backgroundColor: selectedConversation?.id === conversation.id ? '#e3f2fd' : 'white', // Matches bg-blue-50
                  }}
                >
                  <Text>Ad ID: {conversation.product_id}</Text>
                  <Text size="sm" color="dimmed">
                    {new Date(conversation.created_at).toLocaleString()}
                  </Text>
                </Card>
              ))}
            </ScrollArea>
          </Box>

          {/* Main Chat Area */}
          <Box style={{ width: '75%', padding: '16px', display: 'flex', flexDirection: 'column' }}>
            {selectedConversation ? (
              <>
                <Text size="lg" fw={700} style={{ marginBottom: '16px' }}>
                  Chat for Ad ID: {selectedConversation.product_id}
                </Text>
                <Divider my="sm" />
                <ScrollArea style={{ flex: 1, marginBottom: '16px' }}>
                  <Stack>
                    {messages.map((message) => (
                      <Flex
                        key={message.id}
                        justify={
                          message.sender_id === userData?.userData.id ? 'flex-end' : 'flex-start'
                        }
                      >
                        <Card
                          shadow="sm"
                          padding="md"
                          radius="md"
                          style={{
                            backgroundColor:
                              message.sender_id === userData?.userData.id ? '#E3F2FD' : '#F5F5F5',
                            maxWidth: '60%',
                            textAlign: message.sender_id === userData?.userData.id ? 'right' : 'left',
                          }}
                        >
                          <Text>{message.content}</Text>
                          <Text size="xs" color="dimmed">
                            {new Date(message.created_at).toLocaleString()}
                          </Text>
                        </Card>
                      </Flex>
                    ))}
                  </Stack>
                </ScrollArea>

                {/* Send Message Input */}
                <Box style={{ display: 'flex', gap: '8px' }}>
                  <TextInput
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.currentTarget.value)}
                    style={{ flex: 1 }}
                  />
                  <Button onClick={handleSendMessage}>Send</Button>
                </Box>
              </>
            ) : (
              <Text>Select a conversation to start chatting.</Text>
            )}
          </Box>
        </Flex>
      </Paper>
    </Container>
  );
};

export default ChatPage;
