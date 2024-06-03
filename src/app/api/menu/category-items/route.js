import { category_items } from '@//database/menu'
import { NextResponse } from 'next/server'
 
let res = NextResponse
export async function GET(req, ctx) {
  let result = await category_items(req.nextUrl.searchParams.get("category"))

  if (result) 
    return res.json(result.rows)
  else
    return res.json({error: 'Unable to give result.'})
}