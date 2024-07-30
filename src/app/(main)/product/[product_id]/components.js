'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faStar } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export function ProductInfo ({ data }) {

    if (data == undefined) return <section>That product doesn't exist. If you think this isn't the case, please contact us.</section>

    const [optionIndex, setOptionIndex] = useState(0);

    const [errorState, setErrorState] = useState(false);
    const [loadingState, setLoadingState] = useState(false);
    const [successState, setSuccessState] = useState(false);

    const addToCart = async () => {
        if (loadingState) return
        setErrorState(false)
        setLoadingState(true)
        setSuccessState(false)

        const body = {
            product_id: data.product_id,
            option_index: optionIndex,
            amount: 1
        }
        
        await fetch(process.env.API_URL + '/api/cart', {
            cache: 'no-store', 
            method: 'POST', 
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
            else
                setSuccessState(true)

            setLoadingState(false)
        }).catch(error => {setErrorState(error); setLoadingState(false)})

    }

    const [reviewSubmitState, setReviewSubmitState] = useState(false); 

    const submitReview = async (e) => {
        e.preventDefault()

        setReviewSubmitState("Submitting review...")

        //collate data
        const formData = new FormData(e.currentTarget)

        const body = {
            product_id: data.product_id,
            rating: formData.get("rating"),
            message: formData.get("message")
        }

        if (body.rating == null) return
        if (body.message == null) body.message = ""

        try {
            await fetch(process.env.API_URL + '/api/products/product/reviews', {
                cache: 'no-store', method: 'POST', 
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                body: `${JSON.stringify(body)}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.status != 200)
                    setReviewSubmitState(`Error: ${data.message.toString()}.`)
                else
                    setReviewSubmitState(`Thank you for sending a review!`)
            }).catch(error => {setReviewSubmitState(`Error: ${error.toString()}.`)})
        } catch (e) { setReviewSubmitState(`Error: ${e.toString()}.`)}
    }

    return (
        <section className='product-item'>
            <div className='product-content'>
                <aside className='product-image' dangerouslySetInnerHTML={{ __html: ` 
                    <img src='/assets/product/${data.category}/${data.product_id}.jpg' class='product-image'  onerror="this.src = '/assets/logdata.png'" ></img>`}}>
                </aside>
                <aside className='product-info'>
                        <div className='main-info'>
                            <h1>{data.name}</h1>
                            <h2 className='product-price'><p>AED</p>{data.options.length > optionIndex ? data.options[optionIndex].price : data.price}</h2>
                            <div><p>0 Ratings</p> { data.average_rating && ( <span><p>{data.average_rating}</p> <FontAwesomeIcon icon={faStar}></FontAwesomeIcon></span> )}</div>
                        </div>
                        {data.options.length > 0 && (
                            <div className='product-options'>
                                {data.options.map((o, i) => 
                                <button key={i} className={optionIndex == i ? 'selected-option' : ''} onClick={() => setOptionIndex(i)}><p>{o.name}</p><p className='tiny'>{o.price} AED</p></button>
                                )}
                            </div>
                        )}
                        <div className='add-to-cart'>
                            <button onClick={addToCart}><FontAwesomeIcon icon={faCartShopping}></FontAwesomeIcon> <h3>Add to Cart</h3></button>
                            {loadingState && <p>Adding to cart...</p>}
                            {errorState && <p>Error: {errorState.toString()}<br></br>Please contact us in order to resolve this issue.</p>}
                            {successState && <p>Added to cart!</p>}
                        </div>
                        <div>
                            <h4>Description</h4>
                            <p>{data.description}</p>
                        </div>
                        <div>
                            <h4>Write a Review</h4>
                            <form onSubmit={submitReview}>
                                <input name='rating' type='number' placeholder='Rating 1 - 5' min={1} max={5} required></input>
                                <input name='message' type='text' placeholder='Message' min={1} max={5}></input>
                                <button>Submit Review</button>
                                {reviewSubmitState && (<p>{reviewSubmitState.valueOf()}</p>)}
                            </form>
                        </div>
                </aside>
            </div>
        </section>
    )
}