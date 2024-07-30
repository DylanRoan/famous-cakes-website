import { login, session, setsession } from '@//database/authentication'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
const bcrypt = require("bcrypt")
const crypto = require('crypto')
 
let res = NextResponse
export async function POST(req) {
  const stream = await req.body
  const body = await new Response(stream).json()


  //check body
  if (body.email == undefined || body.email == "") 
    return res.json({status: 400, message: "Missing email."})
  if (body.password == undefined || body.password == "") 
    return res.json({status: 400, message: "Missing password."})

  //get from database
  let result = await login(body.email, body.password)
  if (result.status != 200)
    return res.json(result)

  //create session / check if it exists first
  let token = crypto.randomBytes(16).toString('base64')
  let exists = await session(token)
  while (exists.status == 200 && exists.message.length > 0)
  {
    token = crypto.randomBytes(16).toString('base64')
    exists = await session(token)
  }

  if (exists.status == 400) 
    return res.json(exists)

  //store session token in db
  let insert_token = await setsession(result.message[0].user_id, token, "") //ip not currently available
  if (insert_token.status != 200)
    return res.json(insert_token)

  //store cookie session that lasts for 1 day
  cookies().set("session_token", token, {secure: true, 'expires': Date.now() + 86400000, httpOnly: true, sameSite: true})

  //return session
  return res.json({status: 200, message: "Login successful."})
}