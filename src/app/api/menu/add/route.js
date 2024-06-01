import { NextResponse } from 'next/server'
 
let res = NextResponse
export async function GET(req, ctx) {
  return res.json({ message: '42.' })
}