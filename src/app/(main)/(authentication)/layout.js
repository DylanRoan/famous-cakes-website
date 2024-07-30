import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { sessionCheck } from "../../session/session"
import { CookiesProvider } from "next-client-cookies/server"

export default async function AuthLayout({ children }) {

  //check for session
  let sessionStatus = await sessionCheck()

  if (sessionStatus.status == 400) 
    return (<div><main>Error: Please contact us and let us know so we can fix this issue.</main></div>)
  if (sessionStatus.status == 200) 
    return (<CookiesProvider>{ children }</CookiesProvider>)

  redirect('/login')
}