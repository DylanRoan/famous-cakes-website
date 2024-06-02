import { initialize } from '@//database/menu'
import { NextResponse } from 'next/server'
 
let res = NextResponse
export async function GET(req, ctx) {

  await initialize()

  return res.json({ message: 'Completed.' })
}