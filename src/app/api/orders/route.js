import { sessionCheck } from '@//app/session/session'
import { getUserOrders, setOrder } from '@//database/orders'
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

    let result = await getUserOrders(user_id, order_id)
    return res.json(result)
    
}

export async function POST(req) {
    //Session check
    const sessionStatus = await sessionCheck()
    if (sessionStatus.status != 200) 
        return res.json(sessionStatus)
    const admin_id = sessionStatus.message[0].user_id

    if (admin_id != "1") //TODO \\ ADMIN CHECK
        return res.json({status: 400, message: "You do not have permission to access all orders."})
    
    //Body check
    const stream = await req.body
    let body = ""
    try { body = await new Response(stream).json() }
    catch { return res.json({status: 400, message: "Missing body."}) }

    let order_id = false
    let searchParams = req.nextUrl.searchParams
    if (req.nextUrl.searchParams != undefined)
        if (searchParams.get('order_id') != undefined) 
            order_id = searchParams.get('order_id')

    if (!order_id)
        return res.json({status: 400, message: "Missing order id parameter."})

    if (body.user_id == undefined || body.user_id == "") 
        return res.json({status: 400, message: "Missing user id."})
    const user_id = body.user_id

    

    if (!["ORDERED", "RECEIVED", "PREPARING", "DELIVERING", "COMPLETED", "DELAYED", "CANCELLED"].includes(body.order_status))
        return res.json({status: 400, message: "Invalid order status."})
    if (![true, false].includes(body.payment_status))
        return res.json({status: 400, message: "Invalid payment status."})
    if (!["online", "cash", "card"].includes(body.payment_method))
        return res.json({status: 400, message: "Invalid payment method."})
    if (!["delivery", "pickup"].includes(body.delivery_method))
        return res.json({status: 400, message: "Invalid delivery method."})

    const order_data = {
        order_status: body.order_status,
        payment_status: body.payment_status,
        delivery_method: body.delivery_method,
        payment_method: body.payment_method
    }

    if (body.comment != undefined)
        order_data["comment"] = body.comment
        
    let result = await setOrder(body.user_id, order_id, order_data)
    return res.json(result)
}