'use client'

import { faPlay, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react"

const stripePromise = loadStripe(
    process.env.STRIPE_PUBLISHABLE
)

export default function CartPanel () {
    const [data, setData] = useState({status: false});
    const [errorState, setErrorState] = useState(false);

    const fetchCart = async () => {
        try {
            await fetch(process.env.API_URL + '/api/cart', {cache: 'no-store'})
            .then(response => response.json())
            .then(d => {
                if (d.status == 200)
                    setData(d)
                else
                    setErrorState(d.message)
            }).catch(error => {setErrorState(error);})
        } catch (e) { setErrorState(e);}
    }

    function changeValue(product_id, option_index, val) {
        let newVal = parseInt(document.getElementById(`product-${product_id}-${option_index}`).value) + val
        if (newVal > 99) newVal = 99
        if (newVal < 1) newVal = 1

        onAmountChange(newVal, product_id, option_index)
    }

    async function onAmountChange (amount, product_id, option_index) {
        const body = {
            amount: amount,
            product_id: product_id,
            option_index: option_index
        }

        try {
            await fetch(process.env.API_URL + '/api/cart', {
                cache: 'no-store', method: 'POST', 
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                body: `${JSON.stringify(body)}`
            })
            .then(response => response.json())
            .then(d => {
                if (d.status == 200)
                    fetchCart()
                else
                    setErrorState(d.message)
            }).catch(error => {setErrorState(error);})
        } catch (e) { setErrorState(e);}
    }

    useEffect(() => { fetchCart() }, [])
    
    async function removeItem (product_id, option_index) {
        const body = {
            product_id: product_id,
            option_index: option_index
        }

        try {
            await fetch(process.env.API_URL + '/api/cart', {
                cache: 'no-store', method: 'DELETE', 
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                body: `${JSON.stringify(body)}`
            })
            .then(response => response.json())
            .then(d => {
                if (d.status == 200)
                    fetchCart()
                else
                    setErrorState(d.message)
            }).catch(error => {setErrorState(error);})
        } catch (e) { setErrorState(e);}
    }


    if (errorState) return <div>Error: {errorState.toString()} <br></br>Please contact us to review / fix this issue.</div>
    if (data.status == 0) return <div>Loading information...</div >

    return (<div className="profile-cart">
        <section>
            <h1>Cart</h1>
            <h3>Item(s) Price: {data['message'].reduce((prev, current) => prev + parseFloat(current['total_price']), 0).toLocaleString()} AED
            </h3>
            <form action="/api/stripe/checkout" method="POST">
                <button>Purchase ({"X"} Items)</button>
            </form>
        </section>
        <section className="cart-content">
            {
                data['message'].map((o, i) => 
                <div key={i}>
                    <div dangerouslySetInnerHTML={{ __html: ` 
                        <img src='/assets/product/${o.category}/${o.product_id}.jpg' class='product-image'  onerror="this.src = '/assets/logo.jpg'" ></img>`}}>
                    </div>
                    <div className="product-main">
                        <div>
                            <p className="product-cart-name tiny">{o.option != "" ? (`${o.option} || `) : ``}{o.name}</p>
                        </div>
                        <div>
                            <p className="tiny">{o.total_price} AED</p>
                        </div>
                    </div>
                    <div>
                        <span>
                            <button className="increment_button" onClick={(e) => changeValue(o.product_id, o.option_index, -1)}><FontAwesomeIcon icon={faPlay} className="rotate-180"></FontAwesomeIcon></button>
                            <input className="tiny" id={`product-${o.product_id}-${o.option_index}`} type="number" value={o.amount} min={1} max={99}></input>
                            <button className="increment_button" onClick={(e) => changeValue(o.product_id, o.option_index, 1)}><FontAwesomeIcon icon={faPlay}></FontAwesomeIcon></button>
                        </span>
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faX} onClick={(e) => removeItem(o.product_id, o.option_index)}></FontAwesomeIcon>
                    </div>
                </div>)
            }
        </section>
    </div>
    )
}