import Link from 'next/link'
import './products-showcase-css.scss'

function ProductsShowcase ({data}) {
    return (
        <section className='products-showcase'>
            {data.map((o, i) => 
                <Link href='' className='product-showcase'>
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