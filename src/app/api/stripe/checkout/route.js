import { NextRequest, NextResponse } from 'next/server'
const stripe = require('stripe')(process.env.STRIPE_SECRET) 

let res = NextResponse
export async function POST(req) {
    /* 
    {
                    price_data: {
                        currency: 'aed',
                        unit_amount_decimal: '120.00',
                        product_data: {
                            name: "The famous cake",
                            description: 'This is an item to purchase'
                        }
                    },
                    quantity: 3
                },
    */

    try {
        const checkoutSession = await stripe.checkout.sessions.create({
            line_items: [
                {
                  // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                  price: 'price_1Phn3YRxkU27dPbzHCyP8m1P',
                  quantity: 1,
                },
              ],
            mode: 'payment',
            success_url: `${process.env.API_URL}`
        })

        res.redirect(checkoutSession.url)
    }
    catch (error) {
        return res.json({status: 400, message: "There was an error.", error: error.toString()})
    }
}