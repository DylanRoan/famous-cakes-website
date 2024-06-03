import { categories } from '@//database/menu'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
 
let res = NextResponse
export async function GET(req, ctx) {

  let result = await categories(true)

  if (result) 
    return res.json(result.rows)
  else
    return res.json({error: 'Unable to give result.'})
}