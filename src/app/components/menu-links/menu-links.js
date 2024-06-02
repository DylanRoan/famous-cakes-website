import Link from 'next/link'

function MenuLinks ({category}) {
    return (
        <aside>
            <Link href={`${category.replace(/ /g, '')}_header`}><h4>{category}</h4></Link>
            <div>
                {
                    fetch(process.env.API_URL + '/api/menu/category-items?category=' + category.replace(/ /g, "%20"))
                    .then(response => response.json())
                    .then(data => 
                        data.map((o, i) => 
                            <Link href={`/product/${o.id}`}><p>{o.item_name}</p></Link>
                        )
                    )
                    .catch(error => console.error('Error:', error))
                }
            </div>
        </aside>
    )
}

export default MenuLinks;