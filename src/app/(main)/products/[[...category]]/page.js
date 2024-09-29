import Link from 'next/link';
import './page.scss'
import { ProductComponent } from './components';
import { cookies } from 'next/headers';
import { sessionCheck } from '@//app/session/session';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default async function Products ({ params }) {

    //Params
    if (params.category == undefined) params.category = []

    let category = (params.category.length > 0) ? params.category[0] : false
    let subcategory = (params.category.length > 1) ? params.category[1] : false
    let sort = (params.category.length > 2) ? params.category[2] : false

    let query = new URLSearchParams()
    if (category) query.set("category", category)
    if (subcategory) query.set("subcategory", subcategory)
    if (sort) query.set("sort", sort)

    let current_session = await sessionCheck()
    let session_cookie = cookies().get('session_token')

    //category selection
    //disallow selection of custom items to display all
    if (!subcategory || (category === 'custom-cake' && subcategory === 'all'))
        return <CategoryList category={category}></CategoryList>
        
    //products list
    return (
        <main id='products-page'>
            {
                await fetch(process.env.API_URL + `/api/products?${query.toString()}`, {
                    cache: "no-store",
                    headers: {'Cookie': `session_token=${session_cookie ? session_cookie.value : ''}`}
                    })
                .then(response => response.json())
                .then(data => <ProductsList current_session={current_session} data={data}></ProductsList>)
                .catch(error => <div>Error: {error.toString()}</div>)
            }
        </main>
    )
    
    
    
}         

//Text Formatting to Display IDs as proper text
function formatText(w) {
    return w.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

//Category / Subcategory Selection
async function CategoryList({category }) {
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
                    return category_names.map((c, i) => <CategoryItem text={c} src={c}></CategoryItem>)

                if (!category_names.includes(category))
                    return <div>Invalid category: {category}</div>

                let subcategories = categories[category]

                if (category !== 'custom-cake')
                    subcategories.unshift("all")

                return subcategories.map((sc, i) => 
                    <CategoryItem src={`${category}/${sc}`} text={sc}></CategoryItem>
                )
            })
            .catch(error => <section>Error: {error.toString()}</section>)
        }
        </section>
    </main>)
}

//Category Item in the list
function CategoryItem({ text, src }) {
    return (
        <Link href={`/products/${src}`}>
            <div dangerouslySetInnerHTML={{ __html: ` 
                <img src='/assets/product/${src}/icon.jpg' class='product-image'  onerror="this.src = '/assets/logo.jpg'" ></img>`}}>
            </div>
            <p>{formatText(text)}</p> 
        </Link>
    )
}

//Product Selection
export async function ProductsList({ current_session, data }) {
    return (
    <section className='content'>
        <AdminNew current_session={current_session}></AdminNew>
        {
            data['message'].map((o, i) => {
                if (current_session.status === 200)
                    if (current_session.message[0].user_id === "1")
                        return <AdminEdit data={o} key={o.product_id}></AdminEdit>
                    else if (o.availability)
                        if (o.custom)
                            return <ProductCustom data={o} key={o.product_id}></ProductCustom>
                        else
                            return <ProductComponent data={o} key={o.product_id}></ProductComponent>
                    else
                        return <ProductSoldOut data={o} key={o.product_id}></ProductSoldOut>
                else
                    return <ProductNonAuth data={o} key={o.product_id}></ProductNonAuth>
            })
        }
    </section>
    )
}


//Not Authenticated - non interactable
function ProductNonAuth({data})
{
    return ( 
    <a href='/login' id={data.product_id} className="product boxshadow"> 
        <div dangerouslySetInnerHTML={{ __html: ` 
            <img src='/assets/product/${data.category}/${data.product_id.replace('-1-kilo', '').replace('-1/2-kilo', '')}.jpg' class='product-image'  onerror="this.src = '/assets/logo.jpg'" ></img>`}}>
        </div>
        <p className='product-name'>{data.name}</p>
        <p className='product-price'>{data.price} AED</p>
    </a>)
}

//Authenticated (Component)
//ProductComponent

//Custom Product - Links to /custom/[product_id]
function ProductCustom({data})
{
    return (
    <Link href={`/custom/${data.product_id}`} id={data.product_id} className="product boxshadow"> 
        <p className='custom'>Custom</p>
        <div dangerouslySetInnerHTML={{ __html: ` 
            <img src='/assets/product/${data.category}/${data.product_id.replace('-1-kilo', '').replace('-1/2-kilo', '')}.jpg' class='product-image'  onerror="this.src = '/assets/logo.jpg'" ></img>`}}>
        </div>
        <p className='product-name'>{data.name}</p>
        <p className='product-price'>{data.price} AED</p>
    </Link>)
}

//Sold Out - non interactable
function ProductSoldOut({data}) 
{
    return ( 
    <div id={data.product_id} className="product boxshadow"> 
        <p className='sold-out'>Sold out</p>
        <div dangerouslySetInnerHTML={{ __html: ` 
            <img src='/assets/product/${data.category}/${data.product_id.replace('-1-kilo', '').replace('-1/2-kilo', '')}.jpg' class='product-image'  onerror="this.src = '/assets/logo.jpg'" ></img>`}}>
        </div>
        <p className='product-name'>{data.name}</p>
        <p className='product-price'>{data.price} AED</p>
    </div>)
}

//Admin Editing - Links to /admin/product/[product_id]
function AdminEdit({data}) 
{
    return ( 
    <a href={`/admin/product/${data.product_id}`} id={data.product_id} className="product boxshadow"> 
        <p className='admin'>Admin</p>
        <div dangerouslySetInnerHTML={{ __html: ` 
            <img src='/assets/product/${data.category}/${data.product_id.replace('-1-kilo', '').replace('-1/2-kilo', '')}.jpg' class='product-image'  onerror="this.src = '/assets/logo.jpg'" ></img>`}}>
        </div>
        <p className='product-name'>{data.name}</p>
        <p className='product-price'>{data.price} AED</p>
    </a>)
}

//Admin New Item - Links to /admin/product/new
function AdminNew({current_session}) 
{
    if (current_session.status !== 200)
        return
    if (current_session.message[0].user_id !== "1")
        return
    return ( 
    <a href={`/admin/product/new`} className="product boxshadow new_item"> 
        <p className='admin'>Admin</p>
        <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
    </a>)
}


