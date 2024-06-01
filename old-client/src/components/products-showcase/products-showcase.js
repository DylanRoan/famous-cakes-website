import React from 'react'

import './products-showcase-css.scss'
import { Link } from 'react-router-dom';

function ProductsShowcase ({data}) {
    return (
        <section className='products-showcase'>
            {data.map((o, i) => 
                <Link to='' className='product-showcase'>
                    <img alt='' src={o.image}></img>
                    <div className='product-showcase-content'>
                        <h3>{o.name}</h3>
                        <p>{o.price}</p>
                    </div>
                </Link>
            )}
        </section>
    )
}

export default ProductsShowcase;