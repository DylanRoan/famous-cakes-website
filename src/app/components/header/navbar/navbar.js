import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';

import './style.scss'

const NavBar = () => {
    return (
        <nav className='nav'>
            <Link href='/products/cake'>All Cakes</Link>
            <Link href='/products/cake/featured'>Featured Cakes</Link>
            <div className='nav-dropdown'>
                <div className='nav-dropdown-title'>
                    <Link href='/products/beverage'>Beverages</Link>
                    <FontAwesomeIcon icon={faCaretUp} />
                </div>
                <div className='nav-dropdown-content'>
                    <Link href='/products/beverage/hot-beverages'>Hot Beverages</Link>
                    <Link href='/products/beverage/milk-tea'>Milk Tea</Link>
                    <Link href='/products/beverage/mocktail-mojitos'>Mocktail Mojitos</Link>
                    <Link href='/products/beverage/mocktail-famous-coolers'>Mocktail Coolers</Link>
                    <Link href='/products/beverage/manual-brew'>Manual Brew</Link>
                    <Link href='/products/beverage/signature-drinks'>Signature Drinks</Link>
                </div>
            </div>
            <div className='nav-dropdown'>
                <div className='nav-dropdown-title'>
                    <Link href='/products/dessert'>Desserts</Link>
                    <FontAwesomeIcon icon={faCaretUp} />
                </div>
                <div className='nav-dropdown-content'>
                    <Link href='/products/dessert/cupcake'>Cupcakes</Link>
                </div>
            </div>
            <Link href=''>Custom Orders</Link>
        </nav>
    )
}

export default NavBar