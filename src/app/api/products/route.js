import { products } from '@//database/products'
import { NextRequest, NextResponse } from 'next/server'
import { sessionCheck } from '../../session/session'
import { cookies } from 'next/headers'
 
let res = NextResponse
export async function GET(req) {
    let category = false, subcategory = false, sort = false, custom = false
    let searchParams = req.nextUrl.searchParams

    let price_name_sort = []

    if (req.nextUrl.searchParams != undefined)
    {
        if (searchParams.get('category') != undefined) 
            category = searchParams.get('category')
        if (searchParams.get('subcategory') != undefined) 
            subcategory = searchParams.get('subcategory')
        if (searchParams.get('sort') != undefined) 
            sort = searchParams.get('sort')
        if (searchParams.get('custom') != undefined) 
            custom = true

        if (subcategory === "all")
            subcategory = false

        if (searchParams.get('name_sort') != undefined)
            if (searchParams.get('name_sort') == '1')
                price_name_sort.push('name ASC')
            else if (searchParams.get('name_sort') == '-1')
                price_name_sort.push('name DESC')
        
        
        if (searchParams.get('price_sort') != undefined)
            if (searchParams.get('price_sort') == '1')
                price_name_sort.push('price ASC')
            else if (searchParams.get('price_sort') == '-1')
                price_name_sort.push('price DESC')
    }

    let sessionStatus = await sessionCheck()
    let user_id = false
    if (sessionStatus.status == 200) 
        user_id = sessionStatus.message[0].user_id

    let result = await products(category, subcategory, sort, price_name_sort, user_id)
    return res.json(result)
}