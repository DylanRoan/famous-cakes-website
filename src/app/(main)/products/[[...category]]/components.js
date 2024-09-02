'use client'

import { faCartPlus, faMinus, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"

export function ProductComponent({data}) {
    if (data.cart_count == null)
        data.cart_count = 0
    let [cartCount, setCartCount] = useState(data.cart_count)
    const [firstRender, setFirstRender] = useState(true)
    let auth = ('cart_count' in data) ? true : false

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
            .then(data => {
                if (data.status != 200)
                    setCartCount(0)
            })
            .catch(error => console.error('Error:', error))
        }

        const body = {
            product_id: data.product_id,
            amount: cartCount
        }

        if (cartCount < 1) editCart('DELETE', body)
        else editCart('POST', body)

    }, [cartCount])

    //Function to increment or add item in cart
    const incrementItem = async (e) => {
        let productContainer = document.getElementById(data.product_id)

        setCartCount(cartCount + 1)
    }

    //Function to decrement and remove item from cart
    const decrementItem = async (e) => {
        e.stopPropagation()

        let productContainer = document.getElementById(data.product_id)

        if (cartCount < 1) return //Prevent from going below 0
        setCartCount(cartCount - 1)
    }

    return (
        <div onClick={incrementItem} id={data.product_id} className="product boxshadow"> 
            <p className={`bubble count ${cartCount > 0 ? 'show' : ''}`}>{cartCount}</p>
            <p className={`bubble remove ${cartCount > 0 ? 'show' : ''}`} onClick={decrementItem}><FontAwesomeIcon icon={cartCount > 1 ? faMinus : faTrash}></FontAwesomeIcon></p>
            <div dangerouslySetInnerHTML={{ __html: ` 
                <img src='/assets/product/${data.category}/${data.product_id.replace('-1-kilo', '').replace('-1/2-kilo', '')}.jpg' class='product-image'  onerror="this.src = '/assets/logo.jpg'" ></img>`}}>
            </div>
            <p className='product-name'>{data.name}</p>
            <p className='product-price'>{data.price} AED</p>
        </div>
    )
}