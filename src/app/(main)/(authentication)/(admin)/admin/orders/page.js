"use client"

import { useEffect, useState } from 'react'
import './page.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

export default function OrdersManager({ searchParams }) {
    const [data, setData] = useState(false)
    const [errorState, setErrorState] = useState(false)
    const [selectedItem, setSelectedItem] = useState(false)
    const [loadingState, setLoadingState] = useState(false)

    let completed = searchParams.completed != undefined ? true : false

    const getOrders = async () => {
        try {
            await fetch(process.env.API_URL + '/api/orders/all?' + (completed ? 'completed=true' : ''), {cache: 'no-store'})
            .then(response => response.json())
            .then(data => {
                if (data.status == 200)
                    setData(data.message)
                else
                    setErrorState(data.message)
            }).catch(error => setErrorState(error))
        } catch (e) { setErrorState(e);}
    }

    useEffect(() => {
        getOrders()
    }, [])

    if (!data)
        return <main>Loading...</main>

    if (selectedItem)
        return <SelectedItem data={selectedItem} setSelectedItem={setSelectedItem} refreshOrders={getOrders}></SelectedItem>

    if (data.length < 1)
        return (
            <main id="admin-orders">
                <section>
                    <h1>Orders Manager</h1>
                    <div><p>No active orders.</p></div>
                </section>
            </main>
        )

    function dateString(i) {
        if (i > 0)
            return `In ${i} day(s)`
        else if (i < 0)
            return `${i * -1} day(s) ago`
        else
            return `Today`
    }

    return (
        <main id="admin-orders">
            <section>
            <h1>Orders Manager</h1>
                {
                    data.map((o, i) => 
                    <div key={i} onClick={() => setSelectedItem(o)} className={`orders-item ${o.order_status}`}>
                        <div>
                            <p>{o.username}</p>
                            <p className='tiny'>{o.order_status}</p>
                            { o.delivery_method === 'delivery' && (<p className='tiny'>{dateString(Math.floor((new Date(o.order_date) - new Date()) / (1000 * 60 * 60 * 24)))}</p>) }
                            { o.delivery_method === 'pickup' && (<p className='tiny'>{dateString(Math.floor((new Date(o.data.pickup_date) - new Date()) / (1000 * 60 * 60 * 24)))}</p>) }
                        </div>
                        <div>
                            <p>Paid: {o.payment_status ? 'YES' : 'NO'}</p>
                            <p className='tiny'>{o.total_price} AED</p>
                            <p className='tiny'>{o.product_count} items</p>
                        </div>
                        <div>
                            <p className='tiny'>{o.payment_method}</p>
                            <p className='tiny'>{o.delivery_method}</p>
                        </div>
                    </div>
                    )
                }
            </section>
        </main>
    )
}

export function SelectedItem({data, setSelectedItem, refreshOrders}) {
    const [orderProducts, setOrderProducts] = useState(false)
    const [errorState, setErrorState] = useState(false)
    const [loadingState, setLoadingState] = useState(false)
    
    const setOrderData = async () => {
        setOrderProducts(false)
        try {
            await fetch(process.env.API_URL + '/api/orders/products?order_id=' + data.order_id, {cache: 'no-store'})
            .then(response => response.json())
            .then(data => {
                if (data.status == 200)
                    setOrderProducts(data.message)
                else
                    setErrorState(data.message)
            }).catch(error => setErrorState(error))
        } catch (e) { setErrorState(e);}
    }

    useEffect(() => {
        setOrderData()
    }, [])

    const insertOrderData = async (e) => {
        e.preventDefault()

        //State checking
        setLoadingState(true)

        const formData = new FormData(e.currentTarget)
        const body = {
            user_id: data.user_id,
            order_status: formData.get("order_status"),
            payment_status: formData.get("payment_status") === "true",
            
            payment_method: data.payment_method,
            delivery_method: data.delivery_method,
        }

        try {
            await fetch(process.env.API_URL + '/api/orders?order_id=' + data.order_id, {
                cache: 'no-store', method: 'POST', 
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                body: `${JSON.stringify(body)}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.status != 200)
                    setErrorState(data.message)
                else
                    refreshOrders()
                setLoadingState(false)
            }).catch(error => setErrorState(error))
        } catch (e) { setErrorState(e);}
    }

    return (
        <main id="admin-order">
            <section className="order-info">
                <div><FontAwesomeIcon icon={faArrowLeft} onClick={() => setSelectedItem(false)}></FontAwesomeIcon></div>

                <h4>Edit Info</h4>
                <form onChange={insertOrderData}>
                    <div>
                        <label>Order Status:</label>
                        <select name='order_status' defaultValue={data.order_status}>
                            <option value="ORDERED">ORDERED</option>
                            <option value="RECEIVED">RECEIVED</option>
                            <option value="PREPARING">PREPARING</option>
                            <option value="DELIVERING">DELIVERING</option>
                            <option value="DELAYED">DELAYED</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                        </select>
                    </div>
                    <div>
                        <label>Payment Status:</label>
                        <select name='payment_status' defaultValue={data.payment_status}>
                            <option value="true">Paid</option>
                            <option value="false">Unpaid</option>
                        </select>
                    </div>
                    <div>
                        {loadingState && (<p>Loading...</p>)}
                    </div>
                </form>

                <h4>Order Info</h4>
                <div><p>Delivery Method:</p><p>{data.delivery_method}</p></div>
                <div><p>Order Status:</p><p>{data.order_status}</p></div>
                <div><p>Order Date:</p><p>{new Date(data.order_date).toString().split("GMT")[0]}</p></div>

                <div><p>Payment Method:</p><p>{data.payment_method}</p></div>
                <div><p>Paid:</p><p>{data.payment_status ? 'YES' : 'NO'}</p></div>

                <div><p>Total Price:</p><p>{data.total_price} AED</p></div>
                <div><p>Product Count:</p><p>{data.product_count}</p></div>

                <div><p>Special Request:</p><p>{data.special_request ? data.special_request : "None"}</p></div>
                
                <h4>Delivery Instructions</h4>
                {
                    Object.keys(data.data).map(item => 
                    <div key={item}>
                        <p>{item.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}:</p>
                        <p>{data.data[item]}</p>
                    </div>
                    )
                }
            </section>
            <section className="order-products">
                <h4>Products</h4>
                {
                    !orderProducts && (
                        <p>Loading...</p>
                    )
                }
                {
                    orderProducts && (orderProducts.map((o, i) => 
                    <div key={i} className="order-product">
                        <p className='order-product-name'>{o.product_name}</p>
                        <p>{o.amount} Piece</p>
                    </div>))
                }
            </section>
        </main>
    )
}