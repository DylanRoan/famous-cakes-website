'use client'

import { faPlay, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react"

import './orders.scss'
export default function OrderPanel () {
    const [data, setData] = useState({status: false});
    const [errorState, setErrorState] = useState(false);

    const fetchOrders = async () => {
        try {
            await fetch(process.env.API_URL + '/api/orders', {cache: 'no-store'})
            .then(response => response.json())
            .then(d => {
                if (d.status == 200)
                    setData(d)
                else
                    setErrorState(d.message)
            }).catch(error => {setErrorState(error);})
        } catch (e) { setErrorState(e);}
    }

    useEffect(() => { fetchOrders() }, [])

    if (errorState) return <div>Error: {errorState.toString()} <br></br>Please contact us to review / fix this issue.</div>
    if (data.status == 0) return <div>Loading information...</div >

    return (<div className="profile-orders">
        <h1>Orders</h1>
        <section>
            {
                data.message.map((o, i) => {
                if (o.total_price == null)
                    return ""
                return (<div>
                    <p>Ordered on: {(new Date(o.order_date).toLocaleTimeString())}</p>
                    <p>Deliver by: {(new Date(o.request_date).toLocaleTimeString())}</p>
                    <p>{o.total_price} AED</p>
                    <p>{o.product_count} Items</p>
                    {o.special_request != "" && (<p>Special Request: {o.special_request}</p>)}
                    <p>Status: {o.order_status}</p>
                    {console.log(o)}
                </div>)
                })
            }
        </section>
    </div>)
}