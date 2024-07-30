import { sessionCheck } from '@//app/session/session'
import { add, edit, product, remove } from '@//database/products'
import { NextResponse } from 'next/server'
 
let res = NextResponse
export async function GET(req) {
    let searchParams = req.nextUrl.searchParams
    if (searchParams.get('product_id') == undefined)
        return res.json({status: 400, message: "Missing product id parameter."})

    let result = await product(searchParams.get('product_id'))

    if (!result) 
        return res.json({status: 400, message: "Database error."})
    else
        return res.json({status: 200, message: result.rows})
}


export async function POST(req) {
    //Session check
    let sessionStatus = await sessionCheck()
    if (sessionStatus.status != 200) 
        return res.json(sessionStatus)
    if (sessionStatus.message[0].user_id != "1") //TODO || ADMIN CHECK
        return res.json({status: 403, message: "Administrative privileges required."})
    
    //Body check
    const stream = await req.body
    let body = ""
    try { body = await new Response(stream).json() }
    catch { return res.json({status: 400, message: "Missing body."}) }
    
    if (body.product_id == undefined || body.product_id == "") 
        return res.json({status: 400, message: "Missing product id."})
    if (body.name == undefined || body.name == "") 
        return res.json({status: 400, message: "Missing product name."})
    if (body.price == undefined || body.price == "") 
        return res.json({status: 400, message: "Missing price."})
    if (body.category == undefined || body.category == "") 
        return res.json({status: 400, message: "Missing category."})
    
    if (body.price > 99999999.99) 
        body.price = 99999999.99
    if (body.price < 0)
        body.price = 0

    let product_id = body.product_id
    let product_data = {
        name: body.name,
        price: body.price,
        category: body.category
    }
    
    if (body.subcategory != undefined && body.subcategory != "") 
        product_data['subcategory'] = body.subcategory
    if (body.description != undefined && body.description != "") 
        product_data['description'] = body.description
    if (body.options != undefined && body.options != "") 
        product_data['options'] = body.options
    if (body.sort != undefined && body.sort != "") 
        product_data['sort'] = body.sort

    let result = await add(product_id, product_data)

    return res.json(result)
}


export async function PUT(req) {
    //Session check
    let sessionStatus = await sessionCheck()
    if (sessionStatus.status != 200) 
        return res.json(sessionStatus)
    if (sessionStatus.message[0].user_id != "1") //TODO || ADMIN CHECK
        return res.json({status: 403, message: "Administrative privileges required."})
    
    //Body check
    const stream = await req.body
    let body = ""
    try { body = await new Response(stream).json() }
    catch { return res.json({status: 400, message: "Missing body."}) }

    if (body.product_id == undefined || body.product_id == "") 
        return res.json({status: 400, message: "Missing product id."})

    let product_id = body.product_id
    let product_data = {}
    
    if (body.new_product_id != undefined && body.new_product_id != "") 
        product_data['new_product_id'] = body.new_product_id

    if (body.name != undefined && body.name != "") 
        product_data['name'] = body.name
    if (body.price != undefined && body.price != "") {
        if (body.price > 99999999.99) 
            body.price = 99999999.99
        if (body.price < 0)
            body.price = 0
        
        product_data['price'] = body.price
    }
    if (body.category != undefined && body.category != "") 
        product_data['category'] = body.category
    if (body.subcategory != undefined && body.subcategory != "") 
        product_data['subcategory'] = body.subcategory
    if (body.description != undefined && body.description != "") 
        product_data['description'] = body.description
    if (body.options != undefined && body.options != "") 
        product_data['options'] = body.options
    if (body.sort != undefined && body.sort != "") 
        product_data['sort'] = body.sort

    let result = await edit(product_id, product_data)

    return res.json(result)
}

export async function DELETE(req) {
    //Session check
    let sessionStatus = await sessionCheck()
    if (sessionStatus.status != 200) 
        return res.json(sessionStatus)
    if (sessionStatus.message[0].user_id != "1") //TODO || ADMIN CHECK
        return res.json({status: 403, message: "Administrative privileges required."})
    
    //Body check
    const stream = await req.body
    let body = ""
    try { body = await new Response(stream).json() }
    catch { return res.json({status: 400, message: "Missing body."}) }

    if (body.product_id == undefined || body.product_id == "") 
        return res.json({status: 400, message: "Missing product id."})

    let product_id = body.product_id
    let result = await remove(product_id)

    return res.json(result)
}