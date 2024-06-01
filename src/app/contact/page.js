
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faClock, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';

import './page.scss'

export default function ContactUs () {

    return (
        <main id='contact'>
            <h2>Find Us</h2>
            <section className='location'>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14525.600861785753!2d54.3747298!3d24.4715863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5e6798acaf5c8b%3A0xd7718de4d0fc8974!2sFamous%20Cakes!5e0!3m2!1sen!2sae!4v1717169454341!5m2!1sen!2sae"
                    frameborder="0"
                    style={{ border: 0 }}
                    allowfullscreen=""
                    aria-hidden="false"
                    tabindex="0"
                />
                <ul>
                    <li><FontAwesomeIcon icon={faLocationDot}/> <span>Al Wahda Residential Tower - 8 Al Wahdah St - Al Nahyan - Zone 1 - Abu Dhabi</span></li>
                    <li><FontAwesomeIcon icon={faClock}/> <span>Open 7AM - 11:30 PM</span></li>
                    <li><FontAwesomeIcon icon={faPhone}/> <span>0507604817</span></li>
                </ul>
            </section>     
        </main>
    );
}
