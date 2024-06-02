import Link from 'next/link'
import './products-showcase-css.scss'

function ProductsShowcase ({data}) {
    return (
        <section className='products-showcase'>
            {data.map((o, i) => 
                <Link href={`/product/${o.id}`} className='product-showcase'>
                    <img alt='' src={o.image_link}></img>
                    <div className='product-showcase-content'>
                        <h3>{o.item_name}</h3>
                        <p>{o.price} AED</p>
                    </div>
                </Link>
            )}
        </section>
    )
}

export default ProductsShowcase;