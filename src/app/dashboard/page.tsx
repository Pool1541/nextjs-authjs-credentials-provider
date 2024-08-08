import { SignOut } from "@/components/sign-out";
import UserInfo from "@/components/user-info";

export default function Dashboard() {
  return (
    <>
    <div>Welcome to your dashbaord <UserInfo /> </div>
    <SignOut />
    </>
  )
}