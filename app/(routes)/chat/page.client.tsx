'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ScrollArea, Card, Text, Button, TextInput, Stack, Divider, Box, Flex, Container, Paper } from '@mantine/core';
import { Apiconversation, Transaction } from 'api/conversations/route';
import { UserResponse } from '@/_components/profile/UserDetail';
import { useSearchParams } from 'next/navigation';
import { formatJalaliTimeAgo } from '@/_utils/utils';
import { IconArrowRight } from '@tabler/icons-react';
import Image from 'next/image'
import NoMessageSvg from '../../../public/svg/no-message.svg'
import styles from './Chat.module.css'

interface Message {
  id: number;
  content: string;
  sender_id: number;
  created_at: string;
}

const ChatPage = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [conversations, setConversations] = useState<Apiconversation>();
  const [selectedConversation, setSelectedConversation] = useState<Transaction | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userData, setUserData] = useState<UserResponse>();
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();
  const conversationId = searchParams.get('conversationId');

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
        const data: Apiconversation = await response.json();

        setConversations(data);
        if (conversationId && data.data.length > 0) {
          console.log(conversationId);
          setSelectedConversation(data.data.find(item => item.id === Number(conversationId)))
        }
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
        {conversations?.data && conversations?.data.length > 0 ? (
          <Flex style={{ height: '80vh' }}>
            {/* Sidebar */}
            <Box p={{ base: selectedConversation ? '0' : '16px', lg: '16px' }} w={{ base: selectedConversation ? '0' : '100%', lg: '25%' }}
              style={{
                backgroundColor: 'light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-7))', // Matches bg-gray-100
                borderLeft: '1px solid #e0e0e0', // Matches border-r
                overflow: 'auto'
              }}
            >

              <Flex direction={'column-reverse'}>
                {conversations?.data.map((conversation) => (
                  <Card
                    w={'100%'}
                    key={conversation.id}
                    shadow="sm"
                    padding="md"
                    radius="md"
                    onClick={() => setSelectedConversation(conversation)}
                    style={{
                      marginBottom: '8px', // Matches mb-2
                      cursor: 'pointer',
                      backgroundColor: selectedConversation?.id === conversation.id ? 'light-dark(var(--mantine-color-blue-0), var(--mantine-color-dark-9))' : 'var(--mantine-color-body)', // Matches bg-blue-50
                    }}
                  >
                    <Text fz={'sm'}>{conversation.product.title}</Text>
                    <Text size="sm" c="dimmed">
                      {formatJalaliTimeAgo(conversation.created_at)}
                    </Text>
                  </Card>
                ))}
              </Flex>
            </Box>

            {/* Main Chat Area */}
            <Box p={{ base: '0', lg: '16px' }} w={{ base: selectedConversation ? '100%' : '0', lg: '75%' }} style={{ display: 'flex', flexDirection: 'column' }}>
              {selectedConversation ? (
                <>
                  <Flex pr={{ base: '10px' }} pt={{ base: '15px', lg: '0' }} align={'center'}>
                    <Box onClick={() => setSelectedConversation(undefined)} ml={'4px'} display={{ base: 'flex', lg: 'none' }}>
                      <IconArrowRight size={22} />
                    </Box>
                    <Text size="md" fw={700} >
                      {selectedConversation.product.title}
                    </Text>
                  </Flex>
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
                                message.sender_id === userData?.userData.id ? 'light-dark(#E3F2FD,  #041622)' : 'light-dark(#F5F5F5,  #053555)',
                              maxWidth: '60%',
                              textAlign: message.sender_id === userData?.userData.id ? 'right' : 'left',
                            }}
                          >
                            <Text>{message.content}</Text>
                            <Text size="xs" c="dimmed">
                              {formatJalaliTimeAgo(message.created_at)}
                            </Text>
                          </Card>
                        </Flex>
                      ))}
                    </Stack>
                  </ScrollArea>

                  {/* Send Message Input */}
                  <Box style={{ display: 'flex', gap: '8px' }}>
                    <TextInput
                      placeholder="متن خود را وارد کنید"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.currentTarget.value)}
                      style={{ flex: 1 }}
                    />
                    <Button onClick={handleSendMessage}>ارسال</Button>
                  </Box>
                </>
              ) : (
                <Text></Text>
              )}
            </Box>
          </Flex>
        ) : (
          <Flex py={'xl'} direction={'column'} justify={'center'} align={'center'}>
            <Image alt='kiwipart no message'
              sizes="100vw"
              className={styles.imgNoDescription}
              style={{
                height: 'auto',
              }} src={NoMessageSvg} />
            <Text fw={'bold'} fz={'lg'} pt={'xl'}>چتی یافت نشد ...!!</Text>
            <Text px={'md'} pt={'xs'} fz={'sm'} c={'dimmend'}>
              با کلیک بروی دکمه «چت» در صفحه آگهی می‌توانید با دیگران گفتگو کنید.
            </Text>
          </Flex>
        )}

      </Paper>
    </Container>
  );
};

export default ChatPage;
