'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ScrollArea, Card, Text, TextInput, Stack, Divider, Box, Flex, Container, Paper, Alert, LoadingOverlay, ActionIcon } from '@mantine/core';
import { Apiconversation, Transaction } from 'api/conversations/route';
import { UserResponse } from '@/_components/profile/UserDetail';
import { useSearchParams } from 'next/navigation';
import { formatJalaliTimeAgo } from '@/_utils/utils';
import { IconArrowRight, IconCircleArrowUpFilled } from '@tabler/icons-react';
import Image from 'next/image'
import NoMessageSvg from '../../../public/svg/no-message.svg'
import styles from './Chat.module.css'
import ImgNoProduct from '../../../public/no-product.png'

interface Message {
  id: number;
  content: string;
  user_id: number;
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
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const searchParams = useSearchParams();
  const conversationId = searchParams.get('conversationId');
  const viewport = useRef<HTMLDivElement | null>(null);

  // Connect to Socket.IO server
  useEffect(() => {
    const newSocket = io('wss://kiwipart.ir:4001', {
      path: "/socket.io/", // Ensure correct WebSocket path
      transports: ['websocket', 'polling'],
      secure: true,
      reconnection: true
    });

    newSocket.on('connect', () => {
      console.log('✅ Connected to Socket.IO:', newSocket.id);
    });

    newSocket.on('connect_error', (err) => {
      console.error('❌ Connection error:', err);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Fetch conversations on page load
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/conversations');
        const data: Apiconversation = await response.json();
        setLoading(false)
        setConversations(data);
        if (conversationId && data.data.length > 0) {
          console.log(conversationId);
          setSelectedConversation(data.data.find(item => item.id === Number(conversationId)))
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setLoading(false)
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
    setLoadingMessage(true)
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/conversations/${selectedConversation.id}/messages`);
        const data = await response.json();
        setTimeout(scrollToBottom, 100);
        setMessages(data ? data : []);
        setLoadingMessage(false)
      } catch (error) {
        setLoadingMessage(false)
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [selectedConversation]);

  // Listen for real-time messages
  useEffect(() => {
    if (!socket || !selectedConversation) return;
    console.log(`Joining conversation: ${selectedConversation.id}`);
    if (!selectedConversation) {
      console.warn("⚠️ selectedConversation is undefined!");
      return;
    }
    socket.emit('joinConversation', { conversationId: selectedConversation.id });

    socket.on('newMessage', (message) => {
      console.log('📥📩📩 New message received:', message);
      setMessages((prev) => [...prev, message]); // Update messages state
      setTimeout(scrollToBottom, 100);
    });
    // Scroll to the bottom when a new message is added


    return () => {
      socket.emit('leaveConversation', selectedConversation.id);
      socket.off('newMessage');
    };
  }, [socket, selectedConversation]);

  const scrollToBottom = () =>
    viewport.current!.scrollTo({ top: viewport.current!.scrollHeight, behavior: 'smooth' });



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
      console.log("🚀 ~ handleSendMessage ~ message:", message)
      // Scroll to the bottom when a new message is added
      setTimeout(scrollToBottom, 100);

      // Emit the new message via Socket.IO
      socket?.emit('sendMessage', {
        conversationId: selectedConversation.id,
        message,
      });

      // Update the message list
      // setMessages((prev) => [...prev, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleImageAds = (image: string, title: string) => {

    const images: string[] = JSON.parse(image);
    if (images.length > 0) {
      return (
        <Image
          alt={title}
          style={{ borderRadius: '7px' }}
          width={40}
          height={40}
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/storage/${images[0]}`}
        />
      );

    } else {
      return (
        <Image style={{ objectFit: 'contain' }} width={40} height={40} alt='no img' src={ImgNoProduct} />
      )
    }
  }


  return (
    <Container pos="relative" my={'lg'} styles={{ root: { flex: '1 0 auto', width: '100%' } }} size={'lg'}>
      <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      {conversations?.data && conversations?.data.length > 0 ? <Text fz={'h1'} mt={'xs'} mb={'md'}>پیام‌ها</Text> : ''}
      <Paper withBorder>
        {conversations?.data && conversations?.data.length > 0 ? (
          <Flex style={{ height: '80vh' }}>
            {/* Sidebar */}
            <Box p={{ base: selectedConversation ? '0' : '16px', lg: '16px' }} w={{ base: selectedConversation ? '0' : '100%', lg: '25%' }}
              style={{
                backgroundColor: 'light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-7))', // Matches bg-gray-100
                borderLeft: '1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))', // Matches border-r
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
                    <Text fz={'sm'} fw={'bold'} mb={'5px'}>{conversation.seller.name}</Text>
                    <Flex align={'center'} >
                      {handleImageAds(conversation.product.image as string, conversation.product.title)}
                      <Box>
                        <Text fz={'sm'}>{conversation.product.title}</Text>
                      </Box>
                    </Flex>
                    <Text fz={'xs'} c={'dimmed'} mt={'xs'}>{formatJalaliTimeAgo(conversation.created_at)}</Text>

                  </Card>
                ))}
              </Flex>
            </Box>

            {/* Main Chat Area */}
            <Box w={{ base: selectedConversation ? '100%' : '0', lg: '75%' }} style={{ display: 'flex', flexDirection: 'column' }}>
              {selectedConversation ? (
                <>
                  <Flex pt={{ base: '20px', lg: '0' }} py={'xs'} pr={'lg'}
                    bg={'light-dark(var(--mantine-color-green-0), var(--mantine-color-dark-8))'}>
                    <Box
                      onClick={() => setSelectedConversation(undefined)} ml={'4px'}
                      display={{ base: 'flex', lg: 'none' }}>
                      <IconArrowRight size={20} />
                    </Box>
                    <Text fz={'13px'} >{selectedConversation.seller.name}</Text>
                  </Flex>

                  <Flex pr={{ base: '10px' }} pt={{ base: '10px', lg: '0' }} align={'center'}>

                    {handleImageAds(selectedConversation.product.image as string, selectedConversation.product.title)}
                    <Text size="md" fw={700} >
                      {selectedConversation.product.title}
                    </Text>
                  </Flex>
                  <Divider />
                  <ScrollArea p={'md'} pb={'0'} offsetScrollbars={true} viewportRef={viewport} pos={'relative'} style={{ flex: 1, marginBottom: '16px' }}>
                    <LoadingOverlay visible={loadingMessage} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                    <Stack>
                      {messages.map((message) => (
                        <Flex
                          key={message.id}
                          justify={
                            message.user_id === userData?.userData.id ? 'flex-start' : 'flex-end'
                          }
                        >
                          <Card
                            mr={{ base: message.user_id === userData?.userData.id ? '10px' : '', lg: '0' }}
                            ml={{ base: message.user_id === userData?.userData.id ? '0' : '10px', lg: '0' }}
                            shadow="sm"
                            padding="md"
                            radius="md"
                            style={{
                              backgroundColor:
                                message.user_id === userData?.userData.id ? 'light-dark(#E3F2FD,  #041622)' : 'light-dark(#F5F5F5,  #053555)',
                              maxWidth: '60%',
                              textAlign: 'right',
                            }}
                          >
                            <Text>{message.content}</Text>
                            <Text size="11px" mt={'3px'} c="dimmed">
                              {formatJalaliTimeAgo(message.created_at)}
                            </Text>
                          </Card>
                        </Flex>
                      ))}
                    </Stack>

                  </ScrollArea>

                  {/* Send Message Input */}
                  <Box style={{ display: 'flex', gap: '8px', borderTop: '1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))' }}>
                    <TextInput styles={{ input: { border: 'unset' } }}
                      rightSection={<ActionIcon variant='transparent' size='compact-lg' onClick={handleSendMessage}><IconCircleArrowUpFilled size={22} /></ActionIcon>}
                      size='lg'
                      placeholder="متن خود را وارد کنید"
                      value={newMessage}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSendMessage();
                        }
                      }}
                      onChange={(e) => setNewMessage(e.currentTarget.value)}
                      style={{ flex: 1 }}
                    />

                  </Box>
                </>
              ) : (
                <Alert display={{ base: 'none', lg: 'flex' }}>لطفا یک گفتگو انتخاب کنید</Alert>
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
        )
        }

      </Paper >
    </Container >
  );
};

export default ChatPage;
