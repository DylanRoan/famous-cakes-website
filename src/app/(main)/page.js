import Link from 'next/link';
import './page.scss'

export default function HomePage () {
    return (
        <main id='homepage'>
            <section className='homepage-promotional bg-blush'>
                <Link href='' className='homepage-promo-big'><img src='assets/promotional/promo_sample.png'></img></Link>
                <div className='homepage-promo-small'>
                    <Link href=''><img src='assets/promotional/promo_sample.png'></img></Link>
                    <Link href=''><img src='assets/promotional/promo_sample.png'></img></Link>
                </div>
            </section>
            <section className='homepage-featured'>
                <h1 className='line-decoration'><span>Bestseller Cakes</span></h1>
                <aside>
                    <div className='homepage-featured-item'>
                        <img className='homepage-featured-item-img' src='assets/product/cake/product_famouschocolatecake.jpg' alt=''></img>
                        <p>Famous Chocolate Cake</p>
                        <p>150 AED</p>
                    </div>
                    <div className='homepage-featured-item'>
                        <img className='homepage-featured-item-img' src='assets/product/cake/product_famousachocolatecake.jpg' alt=''></img>
                        <p>Famous Chocolate Cake</p>
                        <p>150 AED</p>
                    </div>
                </aside>
            </section>
            <section className='homepage-about bg-blush'>
                <aside>
                    <h1>Famous Cakes</h1>
                    <h2>The Best Cake in Town</h2>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                </aside>
                <aside>
                    <div className='homepage-slideshow-1'></div>
                </aside>
            </section>
            <section className='homepage-rating'>

            </section>
        </main>
    )
}