import Link from 'next/link';
import './page.scss'
import { ProductComponent } from './components';
import { cookies } from 'next/headers';

export default async function Products ({ params }) {

    //Params
    if (params.category == undefined) params.category = []

    let category = (params.category.length > 0) ? params.category[0] : false
    let subcategory = (params.category.length > 1) ? params.category[1] : false
    let sort = (params.category.length > 2) ? params.category[2] : false

    let q = new URLSearchParams()
    if (category) q.set("category", category)
    if (subcategory) q.set("subcategory", subcategory)
    if (sort) q.set("sort", sort)

    let current_session = cookies().get("session_token")
        if (current_session == undefined)
            current_session = ""

    function formatText(w) {
        return w.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    }


    if (!subcategory || (category === 'custom-cake' && subcategory === 'all'))
        return (
            <main id='products-category-page'>
                <h3>Products</h3>
                <section>
            {
                await fetch(process.env.API_URL + '/api/products/categories', {cache: 'no-store'})
                .then(response => response.json())
                .then(data => {
                    let categories = data['message'][0]['categories']
                    let category_names = Object.keys(categories)

                    if (!category)
                        return category_names.map((o, i) => 
                            <Link href={`/products/${o}`}>
                                <div dangerouslySetInnerHTML={{ __html: ` 
                                    <img src='/assets/product/${o}/icon.jpg' class='product-image'  onerror="this.src = '/assets/logo.jpg'" ></img>`}}>
                                </div>
                                <p>{formatText(o)}</p>
                            </Link>
                        )

                    if (!category_names.includes(category))
                        return <div>Invalid category: {category}</div>

                    let subcategories = categories[category]

                    if (category != 'custom-cake')
                        subcategories.unshift("all")

                    return subcategories.map((o, i) => 
                        <Link href={`/products/${category}/${o}`}>
                            <div dangerouslySetInnerHTML={{ __html: ` 
                                <img src='/assets/product/${category}/${o}/icon.jpg' class='product-image'  onerror="this.src = '/assets/logo.jpg'" ></img>`}}>
                            </div>
                            <p>{formatText(o)}</p> 
                        </Link>
                    )
                })
                .catch(error => <section>Error: {error.toString()}</section>)
            }
                </section>
            </main>)
        
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
                        headers: {
                            'Cookie': `session_token=${current_session.value}`
                        }
                      })
                    .then(response => response.json())
                    .then(data => 
                        data['message'].map((o, i) => {
                            if (o.availability)
                                if (o.custom)
                                    return (
                                    <Link href={`/custom?product_id=${o.product_id}`} id={o.product_id} className="product boxshadow"> 
                                        <p className='sold-out'>Custom</p>
                                        <div dangerouslySetInnerHTML={{ __html: ` 
                                            <img src='/assets/product/${o.category}/${o.product_id.replace('-1-kilo', '').replace('-1/2-kilo', '')}.jpg' class='product-image'  onerror="this.src = '/assets/logo.jpg'" ></img>`}}>
                                        </div>
                                        <p className='product-name'>{o.name}</p>
                                        <p className='product-price'>{o.price} AED</p>
                                    </Link>)
                                else
                                    return <ProductComponent data={o} key={o.product_id}></ProductComponent>
                            else
                                return (
                                <div id={o.product_id} className="product boxshadow"> 
                                    <p className='sold-out'>Sold out</p>
                                    <div dangerouslySetInnerHTML={{ __html: ` 
                                        <img src='/assets/product/${o.category}/${o.product_id.replace('-1-kilo', '').replace('-1/2-kilo', '')}.jpg' class='product-image'  onerror="this.src = '/assets/logo.jpg'" ></img>`}}>
                                    </div>
                                    <p className='product-name'>{o.name}</p>
                                    <p className='product-price'>{o.price} AED</p>
                                </div>)
                        })
                    )
                    .catch(error => <div>Error: {error.toString()}</div>)
            }
        </section>
    </main>
    )
}                       