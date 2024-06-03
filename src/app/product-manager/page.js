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
        useEffect(async () => {
            
            await fetch(process.env.API_URL + '/api/menu/get')
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

    const itemSubmit = async (e) => {
        e.preventDefault()
        const formURL = e.target.action
        const formData = new FormData(e.currentTarget)

        const data = {
            id: (selectedItem) ? selectedItem.id : null,
            item_name: formData.get("item_name"),
            category: formData.get("category"),
            description: formData.get("description"),
            price: formData.get("price"),
            image_link: formData.get("image_link"),
            featured: formData.get("featured")
        }

        if (selectedItem)
        {
            if (data.image_link == '') data.image_link = selectedItem.image_link
            if (data.description == '') data.description = selectedItem.description
        }
        
        const response = await fetch(process.env.API_URL + '/api/menu/' + ((selectedItem) ? 'edit' : 'add'), {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: `${JSON.stringify(data)}`
        })

        await fetch(process.env.API_URL + '/api/menu/get')
        .then(response => response.json())
        .then(data => setItems(data))
        .catch(error => console.error('Error:', error))
    }

    async function removeItem() {
        const data = {
            id: selectedItem.id
        }
        
        const response = await fetch(process.env.API_URL + '/api/menu/remove', {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: `${JSON.stringify(data)}`
        })

        await fetch(process.env.API_URL + '/api/menu/get')
        .then(response => response.json())
        .then(data => setItems(data))
        .catch(error => console.error('Error:', error))
    }

    return (
        <main id='product-manager'>
            <h1>Product Manager</h1>
            <nav>
                {!addState && (<FontAwesomeIcon icon={faAdd} size='2x' onClick={() => {resetStates(); setAddState(true); setSelectedItem(false)}}></FontAwesomeIcon>)}
                {selectedItem && !editState && (<FontAwesomeIcon icon={faEdit} size='2x' onClick={() => {resetStates(); setEditState(true)}}></FontAwesomeIcon>)}
                {selectedItem && !removeState && (<FontAwesomeIcon icon={faRemove} size='2x' onClick={() => {resetStates(); setRemoveState(true)}}></FontAwesomeIcon>)}
            </nav>
            <section>
                {
                    (selectedItem && !editState) && (
                        <aside className='pm-item'>
                            <h2>{selectedItem.item_name}</h2>
                            <h3>{selectedItem.category}</h3>
                            <img src={selectedItem.image_link}></img>
                            <p>{selectedItem.description}</p>
                            <p>{selectedItem.price} AED</p>
                            <p>Featured: {(selectedItem.featured) ? 'Yes' : 'No'}</p>

                            {
                                removeState && (
                                    <button onClick={() => removeItem()}>Confirm Item Removal</button>
                                )
                            }
                        </aside>
                    )
                }
                {
                    (addState || editState) && (
                        <aside className='pm-item'>
                            <form onSubmit={itemSubmit}>
                                <div>
                                    <label for='item_name'>Name</label>
                                    <input type='text' name='item_name' required placeholder={(selectedItem) ? selectedItem.item_name : ''}></input>
                                </div>
                                <div>
                                    <label for='category'>Category</label>
                                    <input type='text' name='category' required placeholder={(selectedItem) ? selectedItem.category : ''}></input>
                                </div>
                                <div>
                                    <label for='description'>Description</label>
                                    <input type='text' name='description' placeholder={(selectedItem) ? selectedItem.description : ''}></input>
                                </div>
                                <div>
                                    <label for='price'>Price</label>
                                    <input type='number' name='price' required placeholder={(selectedItem) ? selectedItem.price : ''}></input>
                                </div>
                                <div>
                                    <label for='image_link'>Image URL</label>
                                    <input type='text' name='image_link' placeholder={(selectedItem) ? selectedItem.image_link : ''}></input>
                                </div>
                                <div>
                                    <label for='featured'>Featured</label>
                                    <input type='checkbox' name='featured' defaultChecked={(selectedItem) ? selectedItem.featured : false}></input>
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
