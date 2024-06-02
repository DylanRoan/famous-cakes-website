'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './page.scss'
import { useEffect, useState } from 'react';
import { faAdd, faEdit, faRemove } from '@fortawesome/free-solid-svg-icons';

export default function Menu () {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [editState, setEditState] = useState(false);
    const [addState, setAddState] = useState(false);
    const [removeState, setRemoveState] = useState(false);

    function fetchItems() {
        useEffect(() => {
            
            fetch(process.env.API_URL + '/api/menu/get')
             .then(response => response.json())
             .then(data => setItems(data))
             .catch(error => console.error('Error:', error));
          }, []);
    }

    fetchItems()

    function resetStates() {
        setAddState(false)
        setEditState(false)
        setRemoveState(false)
    }

    const addItemSubmit = async (e) => {
        e.preventDefault()
        const formURL = e.target.action
        const formData = new FormData(e.currentTarget)

        const data = {
            item_name: formData.get("item_name"),
            category: formData.get("category"),
            description: formData.get("description"),
            price: formData.get("price"),
            image_link: formData.get("image_link"),
            featured: formData.get("featured")
        }

        console.log(JSON.stringify(data))

        const response = await fetch(process.env.API_URL + '/api/menu/add', {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: `${JSON.stringify(data)}`
        })

        fetch(process.env.API_URL + '/api/menu/get')
        .then(response => response.json())
        .then(data => setItems(data))
        .catch(error => console.error('Error:', error))
    }

    return (
        <main id='product-manager'>
            <h1>Product Manager</h1>
            <nav>
                <FontAwesomeIcon icon={faAdd} size='2x' onClick={() => {resetStates(); setAddState(true); setSelectedItem(false)}}></FontAwesomeIcon>
                {selectedItem && (<FontAwesomeIcon icon={faEdit} size='2x'></FontAwesomeIcon>)}
                {selectedItem && (<FontAwesomeIcon icon={faRemove} size='2x'></FontAwesomeIcon>)}
            </nav>
            <section>
                {
                    selectedItem && (
                        <aside className='pm-item'>
                            <h2>{selectedItem.item_name}</h2>
                            <h3>{selectedItem.category}</h3>
                            <img src={selectedItem.image_link}></img>
                            <p>{selectedItem.description}</p>
                            <p>{selectedItem.price} AED</p>
                            <p>Featured: {(selectedItem.featured) ? 'Yes' : 'No'}</p>
                        </aside>
                    )
                }
                {
                    addState && (
                        <aside className='pm-item'>
                            <form onSubmit={addItemSubmit}>
                                <div>
                                    <label for='item_name'>Name</label>
                                    <input type='text' name='item_name' required></input>
                                </div>
                                <div>
                                    <label for='category'>Category</label>
                                    <input type='text' name='category' required></input>
                                </div>
                                <div>
                                    <label for='description'>Description</label>
                                    <input type='text' name='description'></input>
                                </div>
                                <div>
                                    <label for='price'>Price</label>
                                    <input type='number' name='price' required></input>
                                </div>
                                <div>
                                    <label for='image_link'>Image URL</label>
                                    <input type='text' name='image_link'></input>
                                </div>
                                <div>
                                    <label for='featured'>Featured</label>
                                    <input type='checkbox' name='featured'></input>
                                </div>
                                <div>
                                    <button type="submit">Submit</button>

                                </div>
                            </form>
                        </aside>
                    )
                }
                <aside className='pm-list'>
                    {
                        items.map(item => {
                            return (
                                <button onClick={() => {resetStates(); setSelectedItem(item)}}>
                                    <p>ID: {item.id}</p>
                                    <img src={item.image_link}></img>
                                    <p>{item.item_name} <br></br> {item.category} <br></br> {item.price} AED</p> 
                                    <p>Featured: {(item.featured) ? 'Yes' : 'No'}</p>     
                                </button>
                            )
                        })
                    }
                </aside>
            </section>
        </main>
    );
}
