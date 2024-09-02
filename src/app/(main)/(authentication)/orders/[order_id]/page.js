import { cookies } from "next/headers"
import './page.scss'

export default async function OrderItem({ params }) {

    const order_id = params.order_id
    console.log(order_id)

    let current_session = cookies().get("session_token")

    return (
        <main id="order-item">
            {
                await fetch(process.env.API_URL + `/api/orders?order_id=${order_id}`, {
                    cache: "no-store",
                    headers: {
                        'Cookie': `session_token=${current_session.value}`
                    }
                })
                .then(response => response.json())
                .then(data => data.message[0])
                .then(order => <OrderInfo order={order}></OrderInfo>)
                .catch(error => <section className="order-products">There was an error getting your information, please let us know.</section>)
            }
            {
                await fetch(process.env.API_URL + `/api/orders/products?order_id=${order_id}`, {
                    cache: "no-store",
                    headers: {
                        'Cookie': `session_token=${current_session.value}`
                    }
                })
                .then(response => response.json())
                .then(data => <OrderProducts products={data}></OrderProducts>)
                .catch(error => <section className="order-products">There was an error getting your information, please let us know.</section>)
            }
        </main>
    )
}

function OrderInfo ({order}) {
    if (order === undefined)
        return <section>This order does not exist.</section>
    
    return (
        <section className="order-info">
            <h1>Order Info</h1>

                <div><p>Order ID:</p><p>{order.order_id}</p></div>

                <div><p>Delivery Method:</p><p>{order.delivery_method}</p></div>
                <div><p>Order Status:</p><p>{order.order_status}</p></div>

                <div><p>Payment Method:</p><p>{order.payment_method}</p></div>
                <div><p>Paid:</p><p>{order.payment_status ? 'YES' : 'NO'}</p></div>

                <div><p>Total Price:</p><p>{order.total_price}</p></div>
                <div><p>Product Count:</p><p>{order.product_count}</p></div>

                <div><p>Special Request:</p><p>{order.special_request ? order.special_request : "None"}</p></div>
                {
                    Object.keys(order.data).map(item => 
                    <div>
                        <p>{item.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}:</p>
                        <p>{order.data[item]}</p>
                    </div>
                    )
                }
        </section>
    )
}


function OrderProducts ({ products }) {
    if (products.message.length < 1)
        return <section></section>

    return (
        <section className="order-products">
            <h3>Products</h3>
            {
                products.message.map((o, i) => 
                    <div key={i} className="order-product">
                        <p>{o.product_name}</p>
                        <div>
                            <p className="tiny">{o.product_price} AED / p</p>
                            <p className="tiny">{o.amount} Piece</p>
                        </div>
                        <p>{o.total_price} AED total</p>
                    </div>
                )
            }
        </section>
    )
}