import UserDetail from "@/_components/profile/UserDetail";
import { cookies } from "next/headers";
import { redirect } from "next/navigation"; // Import redirect utility

interface ProfilePageProps {
  token: string;
}

const Page: React.FC = () => {
  // const token = cookies().get('authToken')?.value;
  // if (!token) {
  //     // If token doesn't exist, redirect to the home page
  //     redirect('/');
  // }

  return <UserDetail />;
};

export default Page;
