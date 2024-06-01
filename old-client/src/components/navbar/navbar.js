import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faUser } from '@fortawesome/free-solid-svg-icons';


import './navbar-css.scss'

const Navbar = () => {
    return (
        <nav className="navbar">
            <section className='header'>
                <Link to='/'><img alt='' src='/logo.jpg'></img></Link>
                <Link to='/menu'>Menu</Link>
            </section>
            <section className='links'>
                <ul className="navbar-nav">
                    <li><Link to="/contact"><FontAwesomeIcon icon={faLocationDot} size="lg" /> <span>Find Us</span></Link></li>
                    <li><Link to="/profile"><FontAwesomeIcon icon={faUser} size="lg" /> <span className='Log in'>Profile</span></Link></li>
                </ul>
            </section>
      </nav>
    )
}
  
export default Navbar;