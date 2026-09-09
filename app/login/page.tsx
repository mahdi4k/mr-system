"use client";

import LoginModal from "@/_components/loginModal/LoginModal";
import { Card, Container, Flex } from "@mantine/core";

export default function LoginPage() {
  return (
    <Flex h="100%" justify="center" align="center">
      <Container
        styles={{ root: { flex: "1 0 auto", width: "100%", padding: "20px" } }}
        size="xl"
      >
        <Card mx="auto" maw={400}>
          <LoginModal
            style={{
              width: "100%",
              padding: "17px",
              borderRadius: "10px",
              border: "1px solid #a0bb5f",
            }}
            close={() => undefined}
          />
        </Card>
      </Container>
    </Flex>
  );
}
