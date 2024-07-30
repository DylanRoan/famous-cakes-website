import './page.scss'
import { sessionCheck } from '@//app/session/session';
import { InformationPanel } from './components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCakeCandles, faCartShopping, faChalkboard, faFilePen, faLocationDot, faPenToSquare, faStore, faTableList, faTruck, faUser, faUserPen } from '@fortawesome/free-solid-svg-icons';
export default function ProfilePage ({ params }) {

    const sub = params.subpage

    return (
        <main id='profile'>
            <aside className='profile-info'>
                <InformationPanel subpage={sub}></InformationPanel>
            </aside>
            <aside className='profile-navbar'>
                <nav>
                    <div>
                        <h2>My Information</h2>
                        <a href='/profile/account' className={sub == "account" ? "active" : ""}><FontAwesomeIcon icon={faUser}></FontAwesomeIcon><p className='tiny'>Account</p></a>
                        <a href='/profile/cart' className={sub == "cart" ? "active" : ""}><FontAwesomeIcon icon={faCartShopping}></FontAwesomeIcon><p className='tiny'>Cart</p></a>
                        <a href='/profile/orders' className={sub == "orders" ? "active" : ""}><FontAwesomeIcon icon={faTruck}></FontAwesomeIcon><p className='tiny'>Orders</p></a>
                        <a href='/profile/custom' className={sub == "custom" ? "active" : ""}><FontAwesomeIcon icon={faCakeCandles}></FontAwesomeIcon><p className='tiny'>Custom Orders</p></a>
                        <a href='/profile/address' className={sub == "address" ? "active" : ""}><FontAwesomeIcon icon={faLocationDot}></FontAwesomeIcon><p className='tiny'>Addresses</p></a>
                    </div>
                    
                    {/* Admin components */}
                    <AdminPanel></AdminPanel>
                </nav>
            </aside>
        </main>
    )
}


export async function AdminPanel () {
    let sessionStatus = await sessionCheck()
    
    if (sessionStatus.message[0].user_id == "1") //TODO || ADMIN CHECK
    {    
        return (
            <div>
                <h2>Admin Panel</h2>
                <a href='/admin/page'><FontAwesomeIcon icon={faPenToSquare}></FontAwesomeIcon> <p className='tiny'>Edit Info</p></a>
                <a href='/admin/users'><FontAwesomeIcon icon={faUserPen}></FontAwesomeIcon> <p className='tiny'>Users</p></a>
                <a href='/admin/products'><FontAwesomeIcon icon={faStore}></FontAwesomeIcon> <p className='tiny'>Products</p></a>
                <a href='/admin/reviews'><FontAwesomeIcon icon={faChalkboard}></FontAwesomeIcon> <p className='tiny'>Reviews</p></a>
                <a href='/admin/orders'><FontAwesomeIcon icon={faFilePen}></FontAwesomeIcon> <p className='tiny'>Orders</p></a>
                <a href='/admin/custom'><FontAwesomeIcon icon={faTableList}></FontAwesomeIcon> <p className='tiny'>Custom Orders</p></a>
            </div>
        )
    }
    else 
        return <div></div>
}