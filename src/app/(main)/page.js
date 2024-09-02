import Link from 'next/link';
import './page.scss'

export default function HomePage () {
    return (
        <main id='homepage'>
            {/* Promotional content section */}
            <section className='homepage-promotional bg-blush'>
                <div className='homepage-promotional-desktop'>
                    <Link href='' className='homepage-promo-big'><img src='assets/promotional/promo_sample.png'></img></Link>
                    <div className='homepage-promo-small'>
                        <Link href=''><img src='assets/promotional/promo_sample.png'></img></Link>
                        <Link href=''><img src='assets/promotional/promo_sample.png'></img></Link>
                    </div>
                </div>
                {/* Mobile promo content section */}
                <div className='homepage-promotional-mobile'>
                    <Link href=''><img src='assets/promotional/promo_sample.png'></img></Link>
                    <Link href=''><img src='assets/promotional/promo_sample.png'></img></Link>
                    <Link href=''><img src='assets/promotional/promo_sample.png'></img></Link>
                </div>
            </section>
            
            {/* Categories section */}
            <section className='homepage-categories'>
                <h1 className='line-decoration'><span>Categories</span></h1>
                <aside>
                    <Link href={'/products/cake'} className='boxshadow'>
                        <img src='assets/product/cake/the-famous-chocolate-fudge-cake.jpg'></img>
                        <p>Cake</p>
                    </Link>
                    <Link href={'/products'} className='boxshadow'>
                        <img src='assets/product/cake/mini-cake.jpg'></img>
                        <p>Custom Cakes</p>
                    </Link>
                    <Link href={'/products/beverage/hot-beverages'} className='boxshadow'>
                        <img src='assets/product/beverage/spanish-latte.jpg'></img>
                        <p>Hot Beverages</p>
                    </Link>
                    <Link href={'/products/beverage/milk-tea'} className='boxshadow'>
                        <img src='assets/product/beverage/wintermelon-milk-tea.jpg'></img>
                        <p>Cold Drinks</p>
                    </Link>
                    <Link href={'/products/dessert'} className='boxshadow'>
                        <img src='assets/product/dessert/vanilla-cupcake.jpg'></img>
                        <p>Dessert</p>
                    </Link>
                </aside>
            </section>

            {/* About Us section */}
            <section className='homepage-about bg-blush'>
                <aside>
                    <h1>Famous Cakes</h1>
                    <h2>The Best Cake in Town</h2>
                    <p></p>
                </aside>
                <aside>
                    <div className='homepage-slideshow-1'></div>
                </aside>
            </section>
        </main>
    )
}