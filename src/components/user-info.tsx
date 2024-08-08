/* eslint-disable @next/next/no-img-element */
import { auth } from "@/auth"

 
export default async function UserInfo() {
  const session = await auth()
  let name: string | null | undefined;
  
  if (session) {
    if (!session.user) return null
    name = session.user.name
  }

 
  return (
    <div>
      <h1>{ name }</h1>
    </div>
  )
}