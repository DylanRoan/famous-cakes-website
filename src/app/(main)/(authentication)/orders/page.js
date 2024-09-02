import { cookies } from "next/headers"
import './page.scss'

export default async function Orders ({ params }) {

    //check for session
    let current_session = cookies().get("session_token")

    return (
        <main id="orders">
            <section>
            <h1>Orders</h1>
            {
                await fetch(process.env.API_URL + `/api/orders`, {
                    cache: "no-store",
                    headers: {
                        'Cookie': `session_token=${current_session.value}`
                    }
                })
                .then(response => response.json())
                .then(data => 
                {
                    return data['message'].map((o, i) => 
                        { 
                            return (
                            <a key={o.order_id} href={`/orders/${o.order_id}`} className={o.order_status}>
                                <div>
                                    <p>{o.order_status}</p>
                                </div>
                                <div>
                                    <p>Paid: {o.payment_status ? 'YES' : 'NO'}</p>
                                </div>
                                <div>
                                    <p>Payment: {o.payment_method}</p>
                                    <p>Delivery: {o.delivery_method}</p>
                                </div>
                                <div className="hide-mobile">
                                    <p>{o.order_date}</p>
                                </div>
                            </a>)
                        }
                    )
                }
                )
                .catch(error => alert('Error:', error))
            }
            </section>
        </main>
    )
}

