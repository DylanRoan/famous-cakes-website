import { categories } from '@//database/products'
import { NextRequest, NextResponse } from 'next/server'
 
let res = NextResponse
export async function GET(req) {
    let result = await categories()
    return res.json(result)
}