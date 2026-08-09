import UserDetail from "@/_components/profile/UserDetail";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../../_lib/supabase/auth";

export const dynamic = "force-dynamic";

const Page = async () => {
  if (!(await getCurrentUser())) redirect("/login?next=/profile");
  return <UserDetail />;
};

export default Page;
