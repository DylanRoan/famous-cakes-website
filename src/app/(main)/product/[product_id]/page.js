import Link from 'next/link';
import './page.scss'
import { ProductInfo } from './components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

export default async function Product ({ params }) {

    let product_id = params.product_id

    return (
        <main id='product-page'>        
            { 
            await fetch(process.env.API_URL + `/api/products/product?product_id=${product_id}`, {cache: "no-store",})
            .then(response => response.json())
            .then(data => data['message'][0])
            .then(o => 
                <ProductInfo data={o}></ProductInfo>
            )
            .catch(error => <div>Error: {error.toString()} <br></br>Please contact us so we may solve this issue.</div>)
            }    
            <section className='product-reviews'>
                <h2>Reviews</h2>
                <div className='reviews-container'>
                    { 
                    await fetch(process.env.API_URL + `/api/products/product/reviews?product_id=${product_id}`, {cache: "no-store",})
                    .then(response => response.json())
                    .then(data => 
                        data['message'].map((o, i) =>
                        <div className='review'>
                            <h3>{o.name}</h3>
                            <span>{o.rating} <FontAwesomeIcon icon={faStar}></FontAwesomeIcon></span>
                            <div className='review-msg-container'>
                                <p>{o.message}</p>
                            </div>
                        </div>
                        )
                    )
                    .catch(error => <div>Error: {error.toString()} <br></br>Please contact us so we may solve this issue.</div>)
                    } 
                </div>
            </section>
            <section className='product-promotional'></section>
        </main>
    )
}