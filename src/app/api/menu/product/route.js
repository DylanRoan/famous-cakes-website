import { product } from '@//database/menu'
import { NextResponse } from 'next/server'
 
let res = NextResponse
export async function GET(req, ctx) {

    const searchParams = req.nextUrl.searchParams
    const id = searchParams.get('id')

    let result = await product(id)

    if (result)
        return res.json(result.rows)
    else
        return res.json({error: 'Unable to give result.'})
}