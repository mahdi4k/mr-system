"use client"
import LoginModal from '@/_components/loginModal/LoginModal'
import { Card, Container, Flex } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useCallback, useState } from 'react'

const Page = () => {
    const handleLoginSuccess = () => {
        // Trigger re-checking the token after login
        checkAuth();
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [openedLogin, { open: openLogin, close: closeLogin }] = useDisclosure(false);

    const HandleModalLoginOpen = () => {
        if (token) {
            closeLogin();
        } else {
            openLogin()
        }
    }
    const checkAuth = useCallback(async () => {
        try {
            const authResponse = await fetch('/api/check-auth'); // Call your API to check the token
            const { token } = await authResponse.json();

            if (!token) {
                setIsModalOpen(true); // Open modal if no token
            } else {
                setToken(token.value); // Save the token
                setIsModalOpen(false); // Close modal
            }
        } catch (error) {

        }
    }, []);

    return (
        <Flex h={'100%'} justify={'center'} align={'center'}>
            <Container styles={{ root: { flex: '1 0 auto', width: '100%' } }} size={'xl'}>

                <Card >
                    <LoginModal
                        style={{ width: '348px', padding: '23px', borderRadius: '10px', border: '1px solid #a0bb5f' }}
                        onLoginSuccess={handleLoginSuccess}
                        isAdsSection={false}
                        setIsModalOpen={setIsModalOpen}
                        close={HandleModalLoginOpen}
                    />
                </Card>
            </Container>

        </Flex>
    )
}

export default Page
