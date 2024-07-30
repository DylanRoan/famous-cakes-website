import { NextRequest, NextResponse } from 'next/server'
const stripe = require('stripe')(process.env.STRIPE_SECRET) 

let res = NextResponse
export async function POST(req) {

    try {
        const checkoutSession = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'aed',
                        unit_amount_decimal: '12000',
                        product_data: {
                            name: "The famous cake",
                            description: 'This is an item to purchase'
                        }
                    },
                    quantity: 3
                },
                {
                    price_data: {
                        currency: 'aed',
                        unit_amount_decimal: '8900',
                        product_data: {
                            name: "The famous cake 1/2 kilo",
                            description: 'This is an item to purchase 2'
                        }
                    },
                    quantity: 5
                },
              ],
            mode: 'payment',
            success_url: `${process.env.API_URL}`
        })
        
        return res.redirect(checkoutSession.url, 303)
    }
    catch (error) {
        return res.json({status: 400, message: "There was an error.", error: error.toString()})
    }
}