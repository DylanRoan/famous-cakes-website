
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faClock, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';

import './page.scss'
import MenuItems from '../components/menu-items/menu-items';
import MenuLinks from '../components/menu-links/menu-links';
import Link from 'next/link';

export default async function Menu () {
    
    return (
        <main id='menu'>
            <section className='menu-list'>
                {
                    await fetch(process.env.API_URL + '/api/menu/categories', {
                        cache: "no-store",
                      })
                    .then(response => response.json())
                    .then(data => 
                        data.map((o, i) => 
                            <MenuLinks category={o.category} />
                        )
                    )
                    .catch(error => console.error('Error:', error))
                }
            </section>
            <section className='menu-items'>
                {
                    await fetch(process.env.API_URL + '/api/menu/categories', {
                        cache: "no-store",
                      })
                    .then(response => response.json())
                    .then(data => 
                        data.map((o, i) => 
                            <MenuItems category={o.category}/>
                        )
                    )
                    .catch(error => console.error('Error:', error))
                }
            </section>
        </main>
    );
}
