import React from 'react'
import './footer-css.scss'

const Footer = () => {
    return (
        <footer className="footer">
            <section>
                <h3>Find Us</h3>
                <p>Al Wahda, Al Nahyan, Abu Dhabi</p>
                <p>0507604817</p>
                <p>[Email Soon]</p>
            </section>
            
            <section>
                <h3>Order From</h3>
                <a target='_blank' href={`https://deliveroo.ae/menu/Abu%20Dhabi/al-wahdah/famous-cakes/`}><p>Deliveroo</p></a>
                <a target='_blank' href={`https://www.talabat.com/uae/famous-cakes`}><p>Talabat</p></a>
            </section>

            <section>
                <h3>Follow Us</h3>
                <a target='_blank' href={`https://www.instagram.com/famouscakes.ae`}><p>Instagram</p></a>
                <a target='_blank' href={`https://www.facebook.com/famouscakes.ae/`}><p>Facebook</p></a>
            </section>
        </footer>
    );
}
  
export default Footer;