import { sessionCheck } from "@//app/session/session"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function AuthLayout({ children }) {

  //check for session
  let sessionStatus = await sessionCheck()

  if (sessionStatus.status == 400) 
    return (<div><main>Error: Please contact us and let us know so we can fix this issue.</main></div>)
  if (sessionStatus.status == 200) 
  {
    if (sessionStatus.message[0].user_id == "1") //TODO || ADMIN CHECK
      return (<div>{ children }</div>)
    
    redirect('/')
  }

  redirect('/login')
}