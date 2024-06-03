'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlassMinus } from "@fortawesome/free-solid-svg-icons";
import './page.scss'
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProductPage ({params: {id}}) {
    const [product, setProduct] = useState([]);
    const [featuredItems, setFeatured] = useState([]);

    useEffect(() => {
        fetch(process.env.API_URL + '/api/menu/product?id=' + id, {
            cache: "no-store",
          })
        .then(response => response.json())
        .then(data => setProduct(data))
        .catch(error => console.error('Error:', error));

        fetch(process.env.API_URL + '/api/menu/featured', {
            cache: "no-store",
          })
        .then(response => response.json())
        .then(data => setFeatured(data))
        .catch(error => console.error('Error:', error));
    }, [])
    

    return (
        <main id='product'>
            { (product.length > 0) && (
                    <section id='product-description'>
                        <h2>{product[0].category}</h2>
                        <h1>{product[0].item_name}</h1>
                        <div><img src={product[0].image_link}></img></div>
                        <h3>{product[0].price} AED</h3>
                        <p>{product[0].description}</p>
                    </section>
                )
            }
            {
                !(product.length > 0) && (
                    <section id='not-found'>
                        <FontAwesomeIcon icon={faMagnifyingGlassMinus} size="5x"></FontAwesomeIcon>
                        <h1>Product not found.</h1>
                        <p>Could not find requested page.</p>
                    </section>
                )
            }
            {
                (featuredItems.length > 0) && (
                    <section id='product-featured-items'>
                        <h2 className='featured_title'>Featured Items</h2>
                        {
                            featuredItems.map((o, i) => {
                                return (
                                    <Link href={`/product/${o.id}`}>
                                        <img src={o.image_link}></img>
                                        <p>{o.item_name}</p>
                                    </Link>
                                )
                            })
                        }
                    </section>
                )
            }
        </main>
    )
}