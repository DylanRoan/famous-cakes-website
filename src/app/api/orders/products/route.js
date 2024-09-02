import { sessionCheck } from '@//app/session/session'
import { getOrderData, getUserOrders } from '@//database/orders'
import { NextRequest, NextResponse } from 'next/server'

let res = NextResponse
export async function GET(req) {
    //Session check
    const sessionStatus = await sessionCheck()
    if (sessionStatus.status != 200) 
        return res.json(sessionStatus)
    const user_id = sessionStatus.message[0].user_id
    
    let order_id = false
    let searchParams = req.nextUrl.searchParams
    if (req.nextUrl.searchParams != undefined)
        if (searchParams.get('order_id') != undefined) 
            order_id = searchParams.get('order_id')

    let result = await getOrderData(order_id)
    return res.json(result)
    
}