import Link from 'next/link';
import './page.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping, faCookie, faStore, faTableList } from '@fortawesome/free-solid-svg-icons';
export default function AdminPanel () {
    return (
        <main id='admin'>
            <h1>Admin Panel</h1>
            <section>
                <a href=''>
                    <FontAwesomeIcon icon={faStore}></FontAwesomeIcon>
                    <p>Front Page Store</p>
                </a>
                <a href='/admin/products'>
                    <FontAwesomeIcon icon={faCookie}></FontAwesomeIcon>
                    <p>Products</p>
                </a>
                <a href='/admin/orders'>
                    <FontAwesomeIcon icon={faBagShopping}></FontAwesomeIcon>
                    <p>Active Orders</p>
                </a>
                <a href='/admin/orders?completed=true'>
                    <FontAwesomeIcon icon={faTableList}></FontAwesomeIcon>
                    <p>Past Orders</p>
                </a>
            </section>
        </main>
    )
}