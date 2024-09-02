import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';

import './style.scss'
import { NavBarDropdown } from './components';

const NavBarModal = () => {
    return (
        <nav className='nav-modal'>
            <Link href='/products/cake'>All Cakes</Link>
            <Link href='/products/cake/featured'>Featured Cakes</Link>
            <NavBarDropdown name='Beverages' href='/products/beverage'>
                    <Link href='/products/beverage/hot-beverages'>Hot Beverages</Link>
                    <Link href='/products/beverage/milk-tea'>Milk Tea</Link>
                    <Link href='/products/beverage/mocktail-mojitos'>Mocktail Mojitos</Link>
                    <Link href='/products/beverage/mocktail-famous-coolers'>Mocktail Coolers</Link>
                    <Link href='/products/beverage/manual-brew'>Manual Brew</Link>
                    <Link href='/products/beverage/signature-drinks'>Signature Drinks</Link>
            </NavBarDropdown>
            <NavBarDropdown name='Desserts' href='/products/dessert'>
                <Link href='/products/dessert/cupcake'>Cupcakes</Link>
            </NavBarDropdown>
            <Link href='/'>Custom Orders</Link>
        </nav>
    )
}

export default NavBarModal




