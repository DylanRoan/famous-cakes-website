import { products } from '@//database/products'
import { NextRequest, NextResponse } from 'next/server'
 
let res = NextResponse
export async function GET(req) {
    let category = false, subcategory = false, extra = false
    let searchParams = req.nextUrl.searchParams

    if (req.nextUrl.searchParams != undefined)
    {
        if (searchParams.get('category') != undefined) category = searchParams.get('category')
        if (searchParams.get('subcategory') != undefined) subcategory = searchParams.get('subcategory')
        if (searchParams.get('extra') != undefined) extra = searchParams.get('extra')
    }

    let result = await products(category, subcategory, extra)

    if (!result) 
        return res.json({status: 400, message: "Database error."})
    else
        return res.json({status: 200, message: result.rows})
}