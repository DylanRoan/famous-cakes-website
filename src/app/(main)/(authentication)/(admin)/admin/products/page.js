'use client'

import Link from 'next/link';
import './page.scss'
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faEdit, faRemove } from '@fortawesome/free-solid-svg-icons';

export default function ProductManager () {
    const [items, setItems] = useState(false);
    const [selectedItem, setSelectedItem] = useState(false);
    const [submitType, setSubmitType] = useState(false);

    const [errorState, setErrorState] = useState(false);
    const [loadingState, setLoadingState] = useState(false);

    const fetchItems = async () => {
        try {
            await fetch(process.env.API_URL + '/api/products', {cache: 'no-store'})
            .then(response => response.json())
            .then(data => {
                if (data.status == 200)
                {
                    setItems(data.message)
                }
                else
                    setErrorState(data.message)
            }).catch(error => {setErrorState(error); console.log(error)})
        } catch (e) { setErrorState(e); console.log(e)}
    }

    useEffect(() => { fetchItems() }, [])

    //On form submission
    const onSubmit = async (e) => {
        e.preventDefault()

        setErrorState(false)

        //State checking
        if (loadingState) return
        setLoadingState(true)

        //Setting submit / fetch method
        if (!submitType) return
        let type = submitType
        setSubmitType(false)

        let method = ""
        if (type == 'add') method = "POST"
        if (type == 'edit') method = "PUT"
        if (type == 'remove') method = "DELETE"

        //collate data
        const formData = new FormData(e.currentTarget)

        const body = {
            product_id: formData.get("product_id"),
            name: formData.get("name"),
            category: formData.get("category"),
            subcategory: formData.get("subcategory"),
            description: formData.get("description"),
            price: formData.get("price"),
            availability: formData.get("availability") !== null,
            custom: formData.get("custom") !== null
        }

        if (selectedItem)
        {
            if (body.product_id != selectedItem.product_id && body.product_id != "")
            {
                body.product_id = selectedItem.product_id
                body['new_product_id'] = formData.get("product_id")
            }

            if (body.product_id == "") body.product_id = selectedItem.product_id
            if (body.name == "") body.name = selectedItem.name
            if (body.category == "") body.category = selectedItem.category
            if (body.subcategory == "") body.subcategory = selectedItem.subcategory
            if (body.price == "") body.price = selectedItem.price
            if (body.description == "") body.description = selectedItem.description
        }
        
        //Perform operation
        try {
            await fetch(process.env.API_URL + '/api/products/product', {
                cache: 'no-store', method: method, 
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                body: `${JSON.stringify(body)}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.status != 200)
                    setErrorState(data.message)

                fetchItems()
                setSelectedItem(false)
                setLoadingState(false)
                resetForm()
            }).catch(error => {setErrorState(error)})
        } catch (e) { setErrorState(e)}
    }

    function resetForm() {
        document.getElementById('product-form').reset()
    }
    
    return (
        <main id='admin-products'>
            <h1>Product Manager</h1>
            <section>
                <aside>
                    <form onSubmit={onSubmit} id='product-form'>
                        <div className='identifier_container'>
                            <label htmlFor='product_id'>ID:</label>
                            <input placeholder={selectedItem ? selectedItem.product_id : ""} type='text' id='product_id' name='product_id'></input>                           
                        </div>

                        <div>
                            <label htmlFor='name'>Name:</label>
                            <input placeholder={selectedItem ? selectedItem.name : ""} type='text' id='name' name='name'></input>
                        </div>

                        <div className='category_container'>
                            <label htmlFor='category'>Category:</label>
                            <input placeholder={selectedItem ? selectedItem.category : ""} type='text' id='category' name='category'></input>
                        </div>

                        <div>
                            <label htmlFor='subcategory'>Subcategory:</label>
                            <input placeholder={selectedItem ? selectedItem.subcategory : ""} type='text' id='subcategory' name='subcategory'></input>
                        </div>
                        
                        <div>
                            <label htmlFor='price'>Price:</label>
                            <input placeholder={selectedItem ? selectedItem.price : ""} type='number' id='price' name='price'></input>
                        </div>

                        <div>
                            <label htmlFor='description'>Description:</label>
                            <input placeholder={selectedItem ? selectedItem.description : ""} type='text' id='description' name='description'></input>
                        </div>

                        <div>
                            <label htmlFor='availability'>Availability</label>
                            <input type='checkbox' defaultChecked={selectedItem.availability} name='availability' id='availability'></input>
                        </div>

                        <div>
                            <label htmlFor='custom'>Custom Cake</label>
                            <input type='checkbox' defaultChecked={selectedItem.custom} name='custom' id='custom'></input>
                        </div>

                        {
                            selectedItem && (
                                <div className='button_container'>
                                    <button onClick={() => setSubmitType("edit")} type='submit'>Submit Edit</button>
                                    <button onClick={() => setSubmitType("remove")} type='submit'>Remove Item</button>
                                </div>
                            )
                        }
                        <div className='button_container'>
                            {selectedItem && (<button type='button' onClick={() => {setSelectedItem(false); resetForm()}}>Add New Item</button>)}
                            {!selectedItem && (<button onClick={() => setSubmitType("add")} type='submit'>Submit Item</button>)}
                        </div>
                        { loadingState && (<div className='loading_container'>Sending changes...</div >)}
                        { errorState && (<div className='error_container'>There was an error: {errorState.valueOf().toString()}</div >)}
                    </form>
                    
                </aside>
                <aside>
                    <div>Items List</div>
                    <div className='products-list-container'>
                        <div className='products-list'>
                            { items && (
                                items.map((o, i) => 
                                    <button onClick={() => {resetForm(); setSelectedItem(o)}}>
                                        <span dangerouslySetInnerHTML={{ __html: ` 
                                            <img src='/assets/product/${o.category}/${o.product_id}.jpg' class='product-image'  onerror="this.src = '/assets/logo.jpg'" ></img>`}}>
                                        </span>
                                        <span>{o.name}</span>
                                        <span>{o.category} / {o.subcategory != "" ? o.subcategory : "None"}</span>
                                        <span>{o.price} AED</span>
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </aside>
            </section>
        </main>
    )
}