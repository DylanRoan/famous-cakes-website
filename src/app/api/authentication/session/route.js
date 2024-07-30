
import { session } from '@//database/authentication'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const bcrypt = require('bcrypt')

let res = NextResponse
export async function GET(req) {
  let session_token = cookies().get("session_token")

  if (session_token == undefined || session_token == "")
    return res.json({status: 403, message: "Session undefined."})

  let result = await session(session_token.value)

  if (result.status != 200)
    return res.json(result)

  var expiry_date = result.message[0].expiry_date

  if (new Date().getTime() - expiry_date.getTime() >= 0)
  {
    cookies().delete("session_token")
    return res.json({status: 403, message: "Session expired."})
  }

  return res.json(result)
}