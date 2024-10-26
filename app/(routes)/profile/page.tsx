import UserDetail from "@/_components/profile/UserDetail";

interface ProfilePageProps {
    token: string;
}

export default function ProfilePage({ token }: ProfilePageProps) {
    return <UserDetail token={token} />;
}