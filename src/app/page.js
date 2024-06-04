import Link from 'next/link';
import ProductsShowcase from './components/products-showcase/products-showcase';

import './page.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

export default async function HomePage () {


    return (
        <main id='homepage'>
            <section className='banner'>
                <video loop autoPlay muted={true}>
                    <source src="/famous-cakes-dine2.mp4" type="video/mp4" />
                </video>
            </section>
            <article>
                <aside className='article_background'>
                    <video loop autoPlay muted={true}>
                        <source src="/famous-cakes-dine.mp4" type="video/mp4" />
                    </video>
                </aside>
                <aside className='article_content'>
                    <h1>Dine with us!</h1>
                    <div>
                        {
                            await fetch(process.env.API_URL + '/api/menu/product?id=1', {cache: "no-store"})
                            .then(response => response.json())
                            .then(data => (<Link href={'/product/' + data[0].id}><img src={data[0].image_link}></img></Link>))
                            .catch(error => console.error('Error:', error))
                        }
                        {
                            await fetch(process.env.API_URL + '/api/menu/product?id=61', {cache: "no-store"})
                            .then(response => response.json())
                            .then(data => (<Link href={'/product/' + data[0].id}><img src={data[0].image_link}></img></Link>))
                            .catch(error => console.error('Error:', error))
                        }
                        {
                            await fetch(process.env.API_URL + '/api/menu/product?id=27', {cache: "no-store"})
                            .then(response => response.json())
                            .then(data => (<Link href={'/product/' + data[0].id}><img src={data[0].image_link}></img></Link>))
                            .catch(error => console.error('Error:', error))
                        }
                        {
                            await fetch(process.env.API_URL + '/api/menu/product?id=62', {cache: "no-store"})
                            .then(response => response.json())
                            .then(data => (<Link href={'/product/' + data[0].id}><img src={data[0].image_link}></img></Link>))
                            .catch(error => console.error('Error:', error))
                        }
                    </div>
                </aside>
            </article>
            <article>
                <aside className='article_content'>
                    <h1>Book events</h1>
                    <div>
                        <FontAwesomeIcon icon={faPhone} size='fa-sm'></FontAwesomeIcon>
                        <h3>+971 50 760 4817</h3>
                    </div>
                </aside>
                <aside className='article_background'>
                    <video loop autoPlay muted={true}>
                        <source src="/famous-cakes-event.mp4" type="video/mp4" />
                    </video>
                </aside>
            </article>
            <article>
                <aside className='article_background'>
                    <video loop autoPlay muted={true}>
                        <source src="/famous-cakes-making.mp4" type="video/mp4" />
                    </video>
                </aside>
                <aside className='article_content'>
                    <h1>Order Our Products!</h1>
                    <div>
                        <a target='_blank' href='https://www.talabat.com/uae/famous-cakes'>
                            <img src='https://www.talabat.com/assets/images/Tlogo-500.png'></img>
                        </a>
                        <a target='_blank' href='https://deliveroo.ae/menu/Abu%20Dhabi/al-wahdah/famous-cakes/'> 
                            <img src='https://cwa.roocdn.com/_next/static/apple-touch-icon.870581c7.png'></img>
                        </a>
                    </div>
                </aside>
            </article>
            
            {/* <section className='featured'>
                <h1>Featured Items</h1>
                {
                    await fetch(process.env.API_URL + '/api/menu/featured', {
                        cache: "no-store",
                      })
                    .then(response => response.json())
                    .then(data => <ProductsShowcase data={data} />)
                    .catch(error => console.error('Error:', error))
                }
            </section> */}
        </main>
    );
}
