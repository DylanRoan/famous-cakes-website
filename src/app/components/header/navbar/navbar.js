import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';

import './style.scss'

const NavBar = () => {
    return (
        <nav className='nav'>
            <a href='/products/cake'>All Cakes</a>
            <a href='/products/cake/featured'>Featured Cakes</a>
            <div className='nav-dropdown'>
                <div className='nav-dropdown-title'>
                    <a href='/products/beverage'>Beverages</a>
                    <FontAwesomeIcon icon={faCaretUp} />
                </div>
                <div className='nav-dropdown-content'>
                    <a href='/products/beverage/hot-beverages'>Hot Beverages</a>
                    <a href='/products/beverage/milk-tea'>Milk Tea</a>
                    <a href='/products/beverage/mocktail-mojitos'>Mocktail Mojitos</a>
                    <a href='/products/beverage/mocktail-famous-coolers'>Mocktail Coolers</a>
                    <a href='/products/beverage/manual-brew'>Manual Brew</a>
                    <a href='/products/beverage/signature-drinks'>Signature Drinks</a>
                </div>
            </div>
            <div className='nav-dropdown'>
                <div className='nav-dropdown-title'>
                    <a href='/products/dessert'>Desserts</a>
                    <FontAwesomeIcon icon={faCaretUp} />
                </div>
                <div className='nav-dropdown-content'>
                    <a href='/products/dessert/cupcake'>Cupcakes</a>
                </div>
            </div>
            <a href=''>Custom Orders</a>
        </nav>
    )
}

export default NavBar