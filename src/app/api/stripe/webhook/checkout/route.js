import { getOrder, setOrder, setOrderData } from '@//database/orders';
import { NextRequest, NextResponse } from 'next/server'
const stripe = require('stripe')(process.env.STRIPE_SECRET) 

let endpointSecret = process.env.STRIPE_CLI_WEBHOOK

let res = NextResponse
export async function POST(req) {
    const sig = req.headers.get('stripe-signature');

    //Body check
    const stream = await req.body
    let body = ""
    try { body = await new Response(stream).text() }
    catch { return res.json({status: 400, message: "Missing body."}) }
    
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
      const user_id = checkoutSession.metadata.user_id
      const special_request = checkoutSession.metadata.special_request

      const sampleRequestDate = new Date().toISOString()
      console.log(sampleRequestDate)
      let orderSet = await setOrder(user_id, order_id, 
        {
          request_date: sampleRequestDate, 
          order_status: "Submitted",
          delivery_type: "Same Day", 
          special_request: special_request
        }
      )

      //process and set up in order data table
      const line_items = checkoutSession.line_items.data
      line_items.map(async (o, i) => {
        if (o.description != "Online Service Fee")
        {
          await setOrderData(order_id, {
            product_name: o.description,
            product_price: (o.price.unit_amount / 100),
            amount: o.quantity
          })
        }
      })

      return {status: 200, message: "Success!"}
    }
  }