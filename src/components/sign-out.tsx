import { signOut } from "@/auth"

 
export function SignOut() {
  return (
    <form
      action={async () => {
        "use server"
        await signOut({
          redirectTo: '/'
        })
      }}
    >
      <button type="submit" className="bg-slate-400">Sign Out</button>
    </form>
  )
}