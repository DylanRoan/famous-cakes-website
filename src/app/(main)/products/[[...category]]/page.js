import Link from 'next/link';
import './page.scss'

export default async function Products ({ params }) {
    //Params
    if (params.category == undefined) params.category = []

    let category = (params.category.length > 0) ? params.category[0] : false
    let subcategory = (params.category.length > 1) ? params.category[1] : false

    let q = new URLSearchParams()
    if (category) q.set("category", category)
    if (subcategory) q.set("subcategory", subcategory)

    //Url search params

    return (
    <main id='products-page'>
        <section className='banner bg-blush'>
            { category && ( <h2>Searching by: {category}{subcategory && (`, ${subcategory}`)}</h2> )}
            <h3>Search from amongst our wide selection of products!</h3>
        </section>
        <section className='content'>
            {
                    await fetch(process.env.API_URL + `/api/products?${q.toString()}`, {
                        cache: "no-store",
                      })
                    .then(response => response.json())
                    .then(data => 
                        data['message'].map((o, i) => 
                            <Link href={`/product/` + o.product_id} key={o.product_id}> 
                                <div dangerouslySetInnerHTML={{ __html: ` 
                                    <img src='/assets/product/${o.category}/${o.product_id}.jpg' class='product-image'  onerror="this.src = '/assets/logo.jpg'" ></img>`}}>
                                </div>
                                <p className='product-name'>{o.name}</p>
                                <p>{o.price} AED</p>
                            </Link>
                        )
                    )
                    .catch(error => console.error('Error:', error))
            }
        </section>
    </main>
    )
}                       