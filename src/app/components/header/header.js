'use client'

import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faMagnifyingGlass, faCartShopping, faBagShopping, faUser, faLocationDot, faBars } from '@fortawesome/free-solid-svg-icons';

import './style.scss'
import NavBar from './navbar/navbar';
import NavBarModal from './navbar-modal/navbar-modal';
import { useEffect, useRef, useState } from 'react';


const Header = () => {
    const nav_modal = useRef(null)
    const [modalState, setModalState] = useState(false);

    useEffect(() => {
        function handleClickOutside(e) {
            if (nav_modal.current && !nav_modal.current.contains(e.target)) setModalState(false)
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [nav_modal])

    function toggleMenuModal() {
        if (modalState) setModalState(false)
        else setModalState(true)
    }
    
    const [search, setSearch] = useState(false);
    const onSearchChange = async (e) => {
        let val = e.target.value
        if (val == "") {
            setSearch(false)
            return
        }
        try {
            let params = new URLSearchParams()
            params.set("value", val)

            await fetch(process.env.API_URL + '/api/products/search?' + params.toString(), {cache: 'no-store',})
            .then(response => response.json())
            .then(data => {
                if (data.status == 200)
                    setSearch(data['message'])
            })
            .catch(error => { console.log(error) })
        }
        catch (e) {
            console.log(e)
        }
    }
    
    return (
        <header>
            <section>
                <div className='header-spacing' id='header-logo-container'>
                <Link href='/'><img alt='' src='/assets/logo.png' className='header-logo'></img></Link>
                    <h1 id='header-title' className='hide-breakpoint'>Famous Cakes</h1>
                </div>
                <div id='header-search-container'>
                    <input placeholder='Search amongst our products...' onChange={onSearchChange}></input>
                    <button><FontAwesomeIcon icon={faMagnifyingGlass}/></button>
                    {  search && (
                        <div className='header-search-suggestion'>
                            {
                                search.map((o, i) => 
                                    <Link href={`/product/${o.product_id}`} onClick={() => setSearch(false)}><p>{o.name}</p><p>{o.price} AED</p></Link>
                                )
                            }
                        </div>
                    )}
                </div>
                <div className='header-spacing' id='header-buttons-container'>
                    <Link href='/' className='header-menu-button-breakpoint'><img alt='' src='/assets/logo.png' className='header-logo'/></Link>

                    <Link href='/profile'><FontAwesomeIcon icon={faUser}/><span>Profile</span></Link>
                    <Link href='/profile/orders'><FontAwesomeIcon icon={faBagShopping}/><span>Orders</span></Link>
                    <Link href='/profile/cart'><FontAwesomeIcon icon={faCartShopping}/><span>Cart</span></Link>

                    <a className='header-menu-button-breakpoint' onClick={() => toggleMenuModal()}><FontAwesomeIcon icon={faBars}/><span>Menu</span></a>
                </div>
            </section>
            <NavBar></NavBar>
            {
                modalState && (
                    <div className='nav-modal-container bg-lavender-blush' ref={nav_modal}>
                        <NavBarModal></NavBarModal>
                    </div>
                )
            }
        </header>
    )
}

export default Header