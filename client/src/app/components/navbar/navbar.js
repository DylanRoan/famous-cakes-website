import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faUser } from '@fortawesome/free-solid-svg-icons';


import './navbar-css.scss'

const Navbar = () => {
    return (
        <nav className="navbar">
            <section className='header'>
                <Link href='/'><img alt='' src='/logo.jpg' /></Link>
                <Link href='/menu'>Menu</Link>
            </section>
            <section className='links'>
                <ul className="navbar-nav">
                    <li><Link href="/contact"><FontAwesomeIcon icon={faLocationDot} size="lg" /> <span>Find Us</span></Link></li>
                    <li><Link href="/profile"><FontAwesomeIcon icon={faUser} size="lg" /> <span className='Log in'>Profile</span></Link></li>
                </ul>
            </section>
      </nav>
    )
}
  
export default Navbar;