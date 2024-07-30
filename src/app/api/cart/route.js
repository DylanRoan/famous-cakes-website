import { NextRequest, NextResponse } from 'next/server'
import { sessionCheck } from '../../session/session'
import { addToCart, getCart, removeFromCart } from '@//database/cart'
 
let res = NextResponse
export async function GET(req) { //get user cart
    //Session check
    const sessionStatus = await sessionCheck()
    if (sessionStatus.status != 200) 
        return res.json(sessionStatus)

    const user_id = sessionStatus.message[0].user_id

    let result = await getCart(user_id)    
    return res.json(result)
}

export async function POST(req) { //add to user cart
    //Session check
    const sessionStatus = await sessionCheck()
    if (sessionStatus.status != 200) 
        return res.json(sessionStatus)
    const user_id = sessionStatus.message[0].user_id

    //Body check
    const stream = await req.body
    let body = ""
    try { body = await new Response(stream).json() }
    catch { return res.json({status: 400, message: "Missing body."}) }

    if (body.product_id == undefined || body.product_id == "") 
        return res.json({status: 400, message: "Missing product id."})
    if (body.option_index === undefined || body.option_index === "") 
        return res.json({status: 400, message: "Missing option index."})
    if (body.amount == undefined || body.amount == "") 
        return res.json({status: 400, message: "Missing product amount."})

    if (body.amount < 1) body.amount = 1
    if (body.amount > 99) body.amount = 99

    let result = await addToCart(user_id, body.product_id, body.option_index, body.amount)    
    return res.json(result)
}

export async function DELETE(req) { //remove from user cart
    //Session check
    const sessionStatus = await sessionCheck()
    if (sessionStatus.status != 200) 
        return res.json(sessionStatus)
    const user_id = sessionStatus.message[0].user_id

    //Body check
    const stream = await req.body
    let body = ""
    try { body = await new Response(stream).json() }
    catch { return res.json({status: 400, message: "Missing body."}) }

    if (body.product_id == undefined || body.product_id == "") 
        return res.json({status: 400, message: "Missing product id."})
    if (body.option_index === undefined || body.option_index === "") 
        return res.json({status: 400, message: "Missing option index."})

    let result = await removeFromCart(user_id, body.product_id, body.option_index)    
    return res.json(result)
}