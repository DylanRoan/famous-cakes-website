import { search } from '@//database/products'
import { NextRequest, NextResponse } from 'next/server'
 
let res = NextResponse
export async function GET(req) {
    let value = false, limit = 5
    let searchParams = req.nextUrl.searchParams

    if (req.nextUrl.searchParams != undefined)
        if (searchParams.get('value') != undefined) 
            value = searchParams.get('value')

    if (req.nextUrl.searchParams != undefined)
        if (searchParams.get('limit') != undefined) 
            limit = searchParams.get('limit')

    limit = parseInt(limit) 
    if (isNaN(limit))
        return res.json({status: 403, message: "Limit must be a number."})

    if (!value)
        return res.json({status: 403, message: "Missing value."})

    let result = await search(value, limit)
    return res.json(result)
}