import { sessionCheck } from '@//app/session/session'
import { clearCart, getCart } from '@//database/cart'
import { getActiveOrders, setOrder, setOrderData } from '@//database/orders'
import { NextRequest, NextResponse } from 'next/server'
const stripe = require('stripe')(process.env.STRIPE_SECRET) 

let res = NextResponse
export async function POST(req) {
    //Session check
    const sessionStatus = await sessionCheck()
    if (sessionStatus.status != 200) 
        return res.json(sessionStatus)
    const user_id = sessionStatus.message[0].user_id

    let activeOrder = await getActiveOrders(user_id)
    if (activeOrder.status != 200)
        return res.json(activeOrder)
    if (activeOrder.message.length > 0)
        return res.json({status: 200, message: 'You have an active order. The order must be fulfilled before making another order.'})

    //Body check
    const stream = await req.body
    let body = ""
    try { body = await new Response(stream).json() }
    catch { return res.json({status: 400, message: "Missing body."}) }

    //Body validation
    //delivery
    if (body.delivery_method == undefined || body.delivery_method == "") 
        return res.json({status: 400, message: "Missing delivery method."})
    if (!["delivery", "pickup"].includes(body.delivery_method))
        return res.json({status: 400, message: "Invalid delivery method."})

    //payment
    if (body.payment_method == undefined || body.payment_method == "") 
        return res.json({status: 400, message: "Missing payment method."})
    if (!["online", "bank"].includes(body.payment_method))
        return res.json({status: 400, message: "Invalid payment method."})

    //delivery data
    let delivery_data = {}

    //body check for delivery
    if (body.delivery_method == 'delivery') {
        if (!Object.keys(body).includes('delivery_phone')) 
            return res.json({status: 400, message: "Missing phone for delivery."})
        if (!Object.keys(body).includes('delivery_street')) 
            return res.json({status: 400, message: "Missing street for delivery."})
        if (!Object.keys(body).includes('delivery_building')) 
            return res.json({status: 400, message: "Missing building for delivery."})
        if (!Object.keys(body).includes('delivery_floor')) 
            return res.json({status: 400, message: "Missing floor for delivery."})
        if (!Object.keys(body).includes('delivery_apartment')) 
            return res.json({status: 400, message: "Missing apartment for delivery."})
        if (!Object.keys(body).includes('delivery_additional')) 
            return res.json({status: 400, message: "Missing additional info for delivery (can be empty)."})

        delivery_data = {
            delivery_phone: body.delivery_phone,
            delivery_street: body.delivery_street,
            delivery_building: body.delivery_building,
            delivery_floor: body.delivery_floor,
            delivery_apartment: body.delivery_apartment,
            delivery_additional: body.delivery_additional
        }
    }
    //body check for pickup
    if (body.delivery_method == 'pickup') {
        if (!Object.keys(body).includes('pickup_name')) 
            return res.json({status: 400, message: "Missing name for pickup."})
        if (!Object.keys(body).includes('pickup_phone')) 
            return res.json({status: 400, message: "Missing phone for pickup."})
        if (!Object.keys(body).includes('pickup_time')) 
            return res.json({status: 400, message: "Missing time for pickup."})
        if (!Object.keys(body).includes('pickup_date')) 
            return res.json({status: 400, message: "Missing date for pickup."})

        delivery_data = {
            pickup_name: body.pickup_name,
            pickup_phone: body.pickup_phone,
            pickup_time: body.pickup_time,
            pickup_date: body.pickup_date
        }
    }

    //Process data
    const order_data = {
        payment_method: body.payment_method,
        delivery_method: body.delivery_method,
        data: JSON.stringify(delivery_data),
        order_status: 'ORDERED'
    }

    console.log(body)

    if (Object.keys(body).includes('special_request')) 
        order_data['special_request'] = body.special_request

    //Get cart
    const cartStatus = await getCart(user_id)   
    if (cartStatus.status != 200) 
        return res.json(cartStatus)
    const cartContent = cartStatus.message

    //Online Payment Method
    if (body.payment_method == 'online')
        return await OnlinePaymentStripe(sessionStatus, cartContent, body, delivery_data)

    //creating order id for non-Stripe payments
    const date = new Date()
    const order_id = `${body.payment_method[0].toUpperCase()}${body.delivery_method[0].toUpperCase()}_${user_id}_${date.toISOString()}`
    
    //add to orders table
    const settingOrder = await setOrder(user_id, order_id, order_data)
    if (settingOrder.status != 200)
        return res.json(settingOrder)

    //add cart to orders table
    let order_products = []
    cartContent.map((o, i) => {
        order_products.push({
            product_name: o.name, 
            amount: o.amount, 
            product_price: o.price
        })
    })
    let settingOrderData = await setOrderData(order_id, order_products)
    if (settingOrderData.status != 200)
        return res.json(settingOrderData)

    const deleteCart = await clearCart(user_id)
    if (deleteCart.status != 200) 
        return res.json(deleteCart)

    //redirect
    return res.json({status: 303, message: `/orders?order_id=${order_id}`})
}



async function OnlinePaymentStripe(sessionStatus, cartContent, body, delivery_data) {
    //convert to line_items
    let line_items = []
    cartContent.map((o, i) => 
        line_items.push({
            price_data: {
                currency: 'aed',
                unit_amount_decimal: o.price.replace('.', ''),
                product_data: {
                    name: `${o.name} ${o.option}`,
                    description: o.description
                }
            },
            quantity: o.amount
        })
    )

    //check if line_items is empty
    if (line_items.length < 1)
        return res.json({status: 400, message: "Cart is empty."})

    //Total price, extra charge, and delivery
    let totalPrice = cartContent.reduce((prev, current) => prev + parseFloat(current['total_price']), 0)


    //delivery
    if (body.delivery_method == 'delivery') {
        totalPrice += 25
        line_items.push({
            price_data: {
                currency: 'aed',
                unit_amount_decimal: '2500',
                product_data: {
                    name: `Delivery Fee`,
                    description: `Delivery Fee for Abu Dhabi`
                }
            },
            quantity: 1
        })
    }

    //extra cost
    let extraCost = (totalPrice + 1) / 0.971
    line_items.push({
        price_data: {
            currency: 'aed',
            unit_amount_decimal: (extraCost - totalPrice).toFixed(2).replace('.', ''),
            product_data: {
                name: `Online Service Fee`,
                description: `Stripe Service Fee 2.9% + 1`
            }
        },
        quantity: 1
    })

    //create checkout session
    try {
        const checkoutSession = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            allow_promotion_codes: true,
            metadata: {
                user_id: sessionStatus.message[0].user_id,
                special_request: body.special_request,
                delivery_method: body.delivery_method,
                ...delivery_data
            },
            shipping_address_collection: {
                allowed_countries: ['AE']
            },
            success_url: `${process.env.API_URL}/cart?checkout_session={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.API_URL}/cart?cancel=true`
        })
        
        return res.json({status: 303, message: checkoutSession.url})
    }
    catch (error) {
        return res.json({status: 400, message: "There was an error.", error: error.toString()})
    }
}