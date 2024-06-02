import ProductsShowcase from './components/products-showcase/products-showcase';

import './page.scss'

export default async function HomePage () {


    return (
        <main id='homepage'>
            <section className='banner'>
            <video loop autoPlay muted={true}>
                <source src="/coffee.mp4" type="video/mp4" />
            </video>
            </section>
            <article>
                <h1>Cakes</h1>
                {
                    fetch(process.env.API_URL + '/api/menu/featured', {
                        cache: "no-store",
                      })
                    .then(response => response.json())
                    .then(data => <ProductsShowcase data={data} />)
                    .catch(error => console.error('Error:', error))
                }
                
                <aside>
                    
                </aside>
            </article>
        </main>
    );
}
