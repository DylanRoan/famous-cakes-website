'use client'

import { faBank, faCreditCard, faMoneyBill, faMotorcycle, faPlay, faStore, faTrash, faTruck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export function CartItem({data, refresh}) {
    const [amount, setAmount] = useState(data.amount)
    const [firstRender, setFirstRender] = useState(true)

    useEffect(() => {
        if (firstRender)
        {
            setFirstRender(false)
            return
        }

        async function editCart(method, body) {
            await fetch(process.env.API_URL + '/api/cart', {cache: 'no-store', method: method,
                body: `${JSON.stringify(body)}`
            })
            .then(response => response.json())
            .then(data => refresh())
            .catch(error => alert("Error: " + error.message))
        }

        const body = {
            product_id: data.product_id,
            amount: amount
        }
        
        if (amount < 1) editCart('DELETE', body)
        else editCart('POST', body)

    }, [amount])

    if (amount < 1)
        return

    return (
        <article className="cart-product">
            <aside className="cart-product-image">
                <div dangerouslySetInnerHTML={{ __html: ` 
                <img src='/assets/product/${data.category}/${data.product_id.replace('-1-kilo', '').replace('-1/2-kilo', '')}.jpg' class='product-image'  onerror="this.src = '/assets/logo.jpg'" ></img>`}}></div>

                <span>
                    <button className="increment_button" onClick={(e) => setAmount(amount - 1)}><FontAwesomeIcon icon={amount < 2 ? faTrash : faPlay} className="rotate-180"></FontAwesomeIcon></button>
                    <input className="tiny" id={`product-${data.product_id}`} type="number" value={amount} onChange={(e) => setAmount(e.target.value)} min={1} max={99}></input>
                    <button className="increment_button" onClick={(e) => setAmount(amount + 1)}><FontAwesomeIcon icon={faPlay}></FontAwesomeIcon></button>
                </span>
            </aside>

            <aside className="cart-product-name">
                <p>{data.name}</p>
                <p className="tiny">{data.price * amount} AED</p>
            </aside>
                
            <aside className="cart-product-amount">
                
            
            </aside>
        </article>
    )
}

/* This is all client sided, and must be revalidated in the api call */
export function CartForm({delivery, setDelivery, payment, setPayment, page}) {

    if (page < 0)
        return (
            <div>
                <fieldset>
                    <legend>Delivery</legend>
                    <input defaultChecked={delivery == 0} required type="radio" id="cart-delivery" name="delivery_method" value="delivery"></input>
                    <label onClick={() => setDelivery(0)} htmlFor="cart-delivery"><FontAwesomeIcon icon={faMotorcycle}></FontAwesomeIcon><p>Delivery</p></label>

                    <input defaultChecked={delivery == 1} required type="radio" id="cart-pickup" name="delivery_method" value="pickup"></input>
                    <label onClick={() => setDelivery(1)} htmlFor="cart-pickup"><FontAwesomeIcon icon={faStore}></FontAwesomeIcon><p>Pickup</p></label>
                </fieldset>

                <fieldset>
                    <legend>Payment Method</legend>

                    <input defaultChecked={payment == 0} required type="radio" id="cart-card" name="payment_method" value="online"></input>
                    <label className="tiny" onClick={() => setPayment(0)} htmlFor="cart-card"><FontAwesomeIcon icon={faCreditCard}></FontAwesomeIcon><p>Online</p></label>

                    <input defaultChecked={payment == 1} type="radio" id="cart-bank_transfer" name="payment_method" value="bank"></input>
                    <label className="tiny" onClick={() => setPayment(1)} htmlFor="cart-bank_transfer"><FontAwesomeIcon icon={faBank}></FontAwesomeIcon><p>Transfer</p></label>
                </fieldset>

                <fieldset>
                    <legend>Information</legend>

                    {payment === 0 && (<p>Online payments are made using Stripe, with included service fee.</p>)}
                    {payment === 1 && (<p>Bank transfers may take time, you must include your order ID in the transfer. This order ID is given after placing the order.</p>)}

                    <p>Your order will be placed as "ORDERED" until it is actually processed and "RECEIVED" by the store.</p>
                </fieldset>
            </div>
        )
    else if (page < 1)
        return (
        <div>
            <fieldset className="field-full">
                <legend>Address</legend>

                <div>
                    <div>
                        <label htmlFor="delivery_phone">Phone</label>
                        <input required type="delivery_phone" id="delivery_phone" name="delivery_phone"></input>
                    </div>
                </div>
                
                <div>
                    <div>
                        <label htmlFor="delivery_street">Street</label>
                        <input required type="text" id="delivery_street" name="delivery_street"></input>
                    </div>
                    <div>
                        <label htmlFor="delivery_building">Building</label>
                        <input required type="text" id="delivery_building" name="delivery_building"></input>
                    </div>
                </div>

                <div>
                    <div>
                        <label htmlFor="delivery_floor">Floor</label>
                        <input required type="text" id="delivery_floor" name="delivery_floor"></input>
                    </div>
                    <div>
                        <label htmlFor="delivery_apartment">Apartment</label>
                        <input required type="text" id="delivery_apartment" name="delivery_apartment"></input>
                    </div>
                </div>

                <div>
                    <div>
                        <label htmlFor="delivery_additional">Additional Instructions</label>
                        <input type="text" id="delivery_additional" name="delivery_additional"></input>
                    </div>
                </div>
            </fieldset>
        </div>
        )
    else 
        return (
        <div>
            <fieldset className="field-full">
                <legend>Pickup Time</legend>
                <div>
                    <div>
                        <label htmlFor="pickup_name">Name</label>
                        <input required type="text" id="pickup_name" name="pickup_name"></input>
                    </div>
                    <div>
                        <label htmlFor="pickup_phone">Phone</label>
                        <input required type="phone" id="pickup_phone" name="pickup_phone"></input>
                    </div>
                </div>
                <div>
                    <div>
                        <label htmlFor="pickup_time">Time</label>
                        <input required type="time" id="pickup_time" name="pickup_time"></input>
                    </div>
                    <div>
                        <label htmlFor="pickup_date">Date</label>
                        <input required type="date" id="pickup_date" name="pickup_date"></input>
                    </div>
                </div>
            </fieldset>
        </div>
        )
}