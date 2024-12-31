"use client"

import { ActionIcon, Box, Card, Flex, SimpleGrid, Text } from '@mantine/core'
import { IconEdit } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'
import NameEdit from './edit/NameEdit';
import { useDisclosure } from '@mantine/hooks';
import EmailEdit from './edit/EmailEdit';
import { useRouter } from 'next/navigation';



interface UserResponse {
    message: string;
    userData: UserData;
}

interface UserData {
    id: number;
    name: string;
    username: string;
    phone: string;
    email: string | null;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

const UserDetail = () => {
    const [userData, setUserData] = useState<UserResponse>();
    const [error, setError] = useState(null);
    const [opened, { open, close }] = useDisclosure(false);
    const [openedEmail, { open: openEmail, close: closeEmail }] = useDisclosure(false);
    const router = useRouter();
    const [loading, setLoading] = useState(true); // Add a loading state
    const [token, setToken] = useState<string | null>(null);


    useEffect(() => {
        const checkAuth = async () => {
            try {
                const authResponse = await fetch('/api/check-auth'); // Call your API to check the token
                const { token } = await authResponse.json();

                if (!token.value) {
                    // router.push('/'); // Redirect if no token
                } else {
                    setToken(token.value); // Set the token
                }
            } catch (error) {
                router.push('/'); // Redirect on error
            }
        };

        checkAuth();
    }, [router]);


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
                setUserData(data); // Assuming userData is in the response
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Something went wrong');
            }
        } catch (error) {
            // setError(error.message || 'An error occurred');
        }
    };
    // useEffect(() => {
    //     if (!token) {
    //         router.replace('/'); // Use `replace` to avoid adding to history
    //     } else {
    //         setLoading(false); // Set loading to false once the token is confirmed
    //     }
    // }, [token, router]);

    useEffect(() => {
        fetchUserData();
    }, []);



    return (
        <Card mb={'xl'} shadow='sm'>
            <SimpleGrid p={'lg'} verticalSpacing="xl" cols={2}>
                <Flex justify={'space-between'} style={{ borderLeft: '1px solid var(--mantine-color-gray-4)' }} pl={'lg'}>
                    <Flex direction={'column'}>
                        <Text fz={'xs'} c={'dimmed'}>نام </Text>
                        <Text mt={'md'}>{userData?.userData?.name || '---'}</Text>
                    </Flex>
                    <ActionIcon onClick={open} variant='subtle'>
                        <IconEdit size={20} />
                    </ActionIcon>
                </Flex>

                <Flex justify={'space-between'} pr={'xs'}>
                    <Flex direction={'column'}>
                        <Text fz={'xs'} c={'dimmed'}>ایمیل</Text>
                        <Text mt={'md'}>{userData?.userData?.email || '---'}</Text>
                    </Flex>
                    <ActionIcon onClick={openEmail} variant='subtle'>
                        <IconEdit size={20} />
                    </ActionIcon>
                </Flex>
                <Flex justify={'space-between'} style={{ borderLeft: '1px solid var(--mantine-color-gray-4)' }} pl={'lg'}>
                    <Flex direction={'column'}>
                        <Text fz={'xs'} c={'dimmed'}>شماره موبایل</Text>
                        <Text mt={'md'}>{userData?.userData?.phone || '---'}</Text>
                    </Flex>
                    {/* <ActionIcon variant='subtle'>
                        <IconEdit size={20} />
                    </ActionIcon> */}
                </Flex>
                {token ? (
                    <>
                        <NameEdit fetchUserData={fetchUserData} close={close} opened={opened} token={token} />
                        <EmailEdit fetchUserData={fetchUserData} close={closeEmail} opened={openedEmail} token={token} />

                    </>
                ) : ''}
            </SimpleGrid>
        </Card>
    )
}

export default UserDetail