import { clearCart } from '@//database/cart';
import { getOrder, setOrder, setOrderData } from '@//database/orders';
import { NextRequest, NextResponse } from 'next/server'
const stripe = require('stripe')(process.env.STRIPE_SECRET) 

let endpointSecret = process.env.STRIPE_WH_CHECKOUT

let res = NextResponse
export async function POST(req) {
    const sig = req.headers.get('stripe-signature');

    //Body check
    const stream = await req.body
    let body = ""
    try { body = await new Response(stream).text() }
    catch { return res.json({status: 400, message: "Missing body."}) }

    console.log(sig)
    console.log(req.body)
    
    let event;
  
    try {
        event = await stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
        console.log(`Stripe Checkout Webhook Error: ${err}`)
        return res.json({status: 400, message: `Webhook Error: ${err.message}`})
    }

    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
        await fulfillCheckout(event.data.object.id)
    }

    //checkout.session.async_payment_failed

    return res.json({status: 200, message: "Success!"})
}

export async function fulfillCheckout(order_id) {
    const stripe = require('stripe')(process.env.STRIPE_SECRET);
  
    // Check if order already processed / in table, if so, return
    let checkIfExist = await getOrder(order_id)
    if (checkIfExist.status != 200) 
      return checkIfExist
    if (checkIfExist.message.length > 0)
      return {status: 200, message: "Already processed that id."}

    // Retrieve the Checkout Session from the API with line_items expanded
    const checkoutSession = await stripe.checkout.sessions.retrieve(order_id, {
      expand: ['line_items'],
    });

    //check if session id does not exist, if so, return
    if ('error' in checkoutSession)
      return {status: 400, message: checkoutSession.error.message}

    // Check the Checkout Session's payment_status property
    if (checkoutSession.payment_status !== 'unpaid') {

      //process / set it up in the orders table
      const metadata = checkoutSession.metadata

      const user_id = metadata.user_id

      let delivery_data = {}
      if (metadata.delivery_method === 'delivery')
      {
        delivery_data = {
          delivery_phone: metadata.delivery_phone,
          delivery_street: metadata.delivery_street,
          delivery_building: metadata.delivery_building,
          delivery_floor: metadata.delivery_floor,
          delivery_apartment: metadata.delivery_apartment,
          delivery_additional: metadata.delivery_additional
        }
      }
      else
      {
        delivery_data = {
          pickup_name: metadata.pickup_name,
          pickup_phone: metadata.pickup_phone,
          pickup_time: metadata.pickup_time,
          pickup_date: metadata.pickup_date
        }
      }

      const order_data = {
        payment_method: 'online',
        delivery_method: metadata.delivery_method,
        data: delivery_data,
        order_status: 'ORDERED',
        special_request: metadata.special_request
      }

      let orderSet = await setOrder(user_id, order_id, order_data)
      if (orderSet.status != 200) 
        console.error(user_id + " | " + order_id + " | " + orderSet.message)

      //process and set up in order data table
      const line_items = checkoutSession.line_items.data
      let order_products = []
      
      line_items.map(async (o, i) => {
        if (o.description !== "Online Service Fee" && o.description !== 'Delivery Fee')
        {
          order_products.push({
            product_name: o.description, 
            amount: o.quantity, 
            product_price: (o.price.unit_amount / 100),
          })
        }
      })

      let settingOrderData = await setOrderData(order_id, order_products)
      if (settingOrderData.status != 200)
          return res.json(settingOrderData)

      //clear cart
      const deleteCart = await clearCart(user_id)
      if (deleteCart.status != 200) 
          console.error(user_id + " | " + deleteCart.message)

      return {status: 200, message: "Success!"}
    }
  }