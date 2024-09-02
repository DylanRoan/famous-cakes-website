import { sessionCheck } from '@//app/session/session'
import { getAllActiveUserOrders, getUserOrders } from '@//database/orders'
import { NextRequest, NextResponse } from 'next/server'

let res = NextResponse
export async function GET(req) {
    //Session check
    const sessionStatus = await sessionCheck()
    if (sessionStatus.status != 200) 
        return res.json(sessionStatus)
    const user_id = sessionStatus.message[0].user_id

    if (user_id != "1") //TODO \\ ADMIN CHECK
        return res.json({status: 400, message: "You do not have permission to access all orders."})
    
    let completed = false
    let searchParams = req.nextUrl.searchParams
    if (req.nextUrl.searchParams != undefined)
        if (searchParams.get('completed') != undefined) 
            completed = searchParams.get('completed')

    let result = await getAllActiveUserOrders(completed)
    return res.json(result)
}