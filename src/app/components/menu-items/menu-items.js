import Link from 'next/link'

function MenuItems ({category}) {
    return (
        <aside>
            <h2 id={`${category.replace(/ /g, '')}_header`}>{category}</h2>
            <div>
                {
                    fetch(process.env.API_URL + '/api/menu/category-items?category=' + category.replace(/ /g, "%20"))
                    .then(response => response.json())
                    .then(data => 
                        data.map((o, i) => 
                            <Link href={`/product/${o.id}`}>
                                <img src={o.image_link}></img>
                                <p>{o.item_name}</p>
                            </Link>
                        )
                    )
                    .catch(error => console.error('Error:', error))
                }
            </div>
        </aside>
    )
}

export default MenuItems;