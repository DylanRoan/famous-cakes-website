import React from 'react'
import './style.scss'
import Link from 'next/link';
import { faBagShopping, faCartShopping, faHome, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Footer = () => {
    return (
        <footer className="bg-white">
            <section className='footer-desktop'>
                <section className='footer-content-container'>
                    <section>
                        <h4>Find Us</h4>
                        <a target='_blank' href={'https://maps.app.goo.gl/pYbwg9dWMa4w7Qvn8'}>Al Wahda, Al Nahyan, Abu Dhabi</a>
                        <a href='tel:971507604817'>+971 50 760 4817</a>
                    </section>
                    
                    <section>
                        <h4>Order From</h4>
                        <a target='_blank' href={`https://deliveroo.ae/menu/Abu%20Dhabi/al-wahdah/famous-cakes/`}> Deliveroo</a>
                        <a target='_blank' href={`https://www.talabat.com/uae/famous-cakes`}> Talabat</a>
                    </section>

                    <section>
                        <h4>Follow Us</h4>
                        <a target='_blank' href={`https://www.instagram.com/famouscakes.ae`}> Instagram</a>
                        <a target='_blank' href={`https://www.facebook.com/famouscakes.ae/`}> Facebook</a>
                    </section>

                    
                    <section>
                        <h4>Famous Cakes</h4>
                        <Link href=''>About Us</Link>
                        <Link href=''>Terms and Conditions</Link>
                    </section>
                </section>
                <section className='footer-line'></section>
                <section className='footer-mini'>
                    <p className='tiny'>Famous Cakes</p>
                    <p className='tiny'>Developed by XXX</p>
                </section>
            </section>
            
            <section className='footer-mobile'>
                <a href='/'><FontAwesomeIcon icon={faHome}/><span>Home</span></a>
                <a href='/cart'><FontAwesomeIcon icon={faCartShopping}/><span>Cart</span></a>
                <a href='/orders'><FontAwesomeIcon icon={faBagShopping}/><span>Orders</span></a>
                <a href='/profile'><FontAwesomeIcon icon={faUser}/><span>Profile</span></a>
            </section>
        </footer>
    );
}
  
export default Footer;