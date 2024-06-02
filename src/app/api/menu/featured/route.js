import { get } from '@//database/menu'
import { NextResponse } from 'next/server'
 
let res = NextResponse
export async function GET(req, ctx) {

  let result = await get(true)

  if (result) 
    return res.json(result.rows)
  else
    return res.error()
}