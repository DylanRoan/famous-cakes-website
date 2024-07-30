import { signup, userempty } from '@//database/authentication'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const bcrypt = require('bcrypt')

let res = NextResponse
export async function POST(req) {
  const stream = await req.body
  const body = await new Response(stream).json()


  //check body
  if (body.username == undefined || body.username == "") 
    return res.json({status: 400, message: "Missing username."})
  if (body.email == undefined || body.email == "") 
    return res.json({status: 400, message: "Missing email."})
  if (body.password == undefined || body.password == "") 
    return res.json({status: 400, message: "Missing password."})
  if (body.phone_code == undefined || body.phone_code == "") 
    return res.json({status: 400, message: "Missing phone code."})
  if (body.phone == undefined || body.phone == "") 
    return res.json({status: 400, message: "Missing phone number."})

  //check if user doesnt exist
  let nouser = await userempty(body.email)

  if (nouser.status != 200)
    return res.json(nouser)

  //encrypt password
  let salt = bcrypt.genSaltSync(parseInt(process.env.BCRYPT_SALT))
  let hashed_password = bcrypt.hashSync(body.password, salt)

  //signup 
  let result = await signup(
    body.username, 
    body.email, 
    hashed_password, 
    body.phone_code,
    body.phone)

  return res.json(result)
}