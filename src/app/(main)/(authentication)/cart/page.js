'use client'

import { useRouter } from 'next/navigation';
import { CartForm, CartItem } from './components';
import './page.scss'
import { useEffect, useState } from 'react';

export default function Cart () {
    const router = useRouter()
    
    /* Data Fetch and Error Handling */
    const [data, setData] = useState(false) 
    const [error, setError] = useState(false)
    const [minorError, setMinorError] = useState(false)

    const [refreshing, setRefresh] = useState(false)
    const [loadingState, setLoadingState] = useState(false)

    const [activeOrder, setActiveOrder] = useState(false)

    async function getData() {
        setRefresh(true)
        if (loadingState) return

        fetch(process.env.API_URL + '/api/cart', {
            cache: 'no-store'
        })
        .then(response => response.json())
        .then(data => {
            setRefresh(false)
            if (data.status != 200)
                setError(data.message)
            else
                setData(data)
        })
        .catch(error => setError(error.message))
    }

    useEffect(() => {
        getData()
    }, [])

    /* Cart Configuration and Price handling */
    const [delivery, setDelivery] = useState(-1)
    const [payment, setPayment] = useState(-1)

    /* Checkout Pages Handling*/
    const [page, setPage] = useState(-1)

    /* Page returns */
    if (error)
        return <main id='error'>Error: {error.toString()}</main>

    if (!data)
        return <main id='loading'>Loading...</main>

    /* This is all client sided, and must be revalidated in the api call */
    /* Price Calculation */
    const subTotal = data['message'].reduce((prev, current) => prev + parseFloat(current['total_price']), 0)
    let totalPrice = subTotal
    const deliveryCost = 25
    if (delivery == 0)
        totalPrice += deliveryCost
    const stripeTax = Math.round((((totalPrice + 1) / 0.971) - totalPrice) * 100) / 100
    if (payment == 0)
        totalPrice += stripeTax
    totalPrice = Math.round(totalPrice * 100) / 100

    /* Checkout Function */
    const onSubmit = async (e) => {
        e.preventDefault()

        //State checking
        if (loadingState) return
        setLoadingState(true)

        let body = {}

        if (delivery === 0)
            body['delivery_method'] = 'delivery' 
        if (delivery === 1)
            body['delivery_method'] = 'pickup'

        if (payment === 0)
            body['payment_method'] = 'online' 
        if (payment === 1)
            body['payment_method'] = 'bank' 
        
        const formData = new FormData(e.currentTarget)
        if (delivery === 0)
        {
            body['delivery_phone'] = formData.get("delivery_phone")
            body['delivery_street'] = formData.get("delivery_street")
            body['delivery_building'] = formData.get("delivery_building")
            body['delivery_floor'] = formData.get("delivery_floor")
            body['delivery_apartment'] = formData.get("delivery_apartment")
            body['delivery_additional'] = formData.get("delivery_additional")
        }
        if (delivery === 1)
        {
            body['pickup_name'] = formData.get("pickup_name")
            body['pickup_phone'] = formData.get("pickup_phone")
            body['pickup_time'] = formData.get("pickup_time")
            body['pickup_date'] = formData.get("pickup_date")
        }

        body['special_request'] = formData.get("special_request")

        try {
            await fetch(process.env.API_URL + '/api/checkout', {
                cache: 'no-store', method: 'POST', 
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                body: `${JSON.stringify(body)}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.status == 303)
                    router.push(data.message)
                if (data.status == 200)
                    setActiveOrder(true)
                if (data.status == 400)
                    setMinorError(data.message)

                setLoadingState(false)
            }).catch(error => { setMinorError(error) })
        } catch (e) { setMinorError(e) }
    }

    return (
        <main id="cart">
            <section>
                <h1>Cart</h1>
                <form className="cart-form" onSubmit={onSubmit}>
                    <CartForm delivery={delivery} setDelivery={setDelivery} payment={payment}  setPayment={setPayment} page={page}></CartForm>
                    <div>
                        <fieldset>
                            <legend>Special Request</legend>

                            <input type='text' id='cart-special_request' name='special_request' placeholder="If you have any requirements or special requests."></input>
                        </fieldset>
                        <fieldset className="cart-form-price">
                            <legend>Price</legend>

                            <h5>Subtotal: {!refreshing && (subTotal.toLocaleString() + " AED") } {refreshing && ("Loading...")}</h5>

                            {delivery == 0 && (<p>Delivery Cost: {deliveryCost.toLocaleString()} AED</p>)}
                            {payment == 0 && (<p>Service Cost: {stripeTax.toLocaleString()} AED</p>)}

                            <h4>Total Amount: {!refreshing && (totalPrice.toLocaleString() + " AED") } {refreshing && ("Loading...")}</h4>
                        </fieldset>
                    </div>

                    {page < 0 && (<button type='button' onClick={() => {
                        if (delivery > -1 && payment > -1)
                            setPage(delivery)
                        else 
                            alert("Please select delivery and/or payment.")
                    }}>Next</button>)}

                    {loadingState && (<div><p>Loading...</p></div>)}
                    {activeOrder && (<div><p style={{textAlign: 'center'}}>You currently have an active order. It must be completed before you can make another order.</p></div>)}
                    <div>
                        {page > -1 && (<button type='button' onClick={() => setPage(-1)}>Previous</button>)}
                        {page > -1 && (<button type='submit'>Place Order</button>)}
                    </div>

                   
                </form>
            </section>
            <section>
            {
                data['message'].map((o, i) => 
                    <CartItem data={o} refresh={getData} key={o.product_id}></CartItem>
                )
            }
            </section>
        </main>
    )
}