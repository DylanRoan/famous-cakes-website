import { edit } from '@//database/menu'
import { NextResponse } from 'next/server'
 
let res = NextResponse
export async function POST(req) {
  const stream = await req.body
  const body = await new Response(stream).json()

  let required = ["id", "item_name", "category", "description", "price", "image_link", "featured"]
  if (Object.keys(body).every((e, i) => e != required[i])) res.json({error: 'Invalid form.'})

  await edit(body)

  return res.json({test: "Success"})
}