import { sessionCheck } from '@//app/session/session'
import { addReview, getReviews, removeReview } from '@//database/reviews'
import { NextRequest, NextResponse } from 'next/server'
 
let res = NextResponse
export async function GET(req) { //get reviews
    let searchParams = req.nextUrl.searchParams
    if (searchParams.get('product_id') == undefined)
        return res.json({status: 400, message: "Missing product id parameter."})

    const product_id = searchParams.get('product_id')

    let result = await getReviews(product_id)
    return res.json(result)
}

export async function POST(req) { //add review
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
    if (body.rating == undefined || body.rating == "") 
        return res.json({status: 400, message: "Missing rating."})
    if (body.message == undefined || body.message == "") 
        return res.json({status: 400, message: "Missing message."})

    if (body.rating > 5) body.rating = 5
    if (body.rating < 1) body.rating = 1

    let result = await addReview(user_id, body.product_id, body.rating, body.message)
    return res.json(result)
}

export async function DELETE(req) { //remove review
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

        let result = await removeReview(user_id, body.product_id)
        return res.json(result)
}