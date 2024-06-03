import { remove } from '@//database/menu'
import { NextResponse } from 'next/server'
 
let res = NextResponse
export async function POST(req) {
  const stream = await req.body
  const body = await new Response(stream).json()

  let required = ["id"]
  if (Object.keys(body).every((e, i) => e != required[i])) return res.json({"error": "Invalid form."})

  await remove(body)

  return res.json({test: "Success"})
}