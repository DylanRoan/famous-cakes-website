'use client'

import { useEffect, useState } from "react";

export default function ProductManager ({ params }) {
    const product_id = params.product_id

    const [data, setData] = useState(false);
    const [submitType, setSubmitType] = useState(false);

    const [errorState, setErrorState] = useState(false);
    const [loadingState, setLoadingState] = useState(false);

    useEffect(() => {
        async function fetchData() {
            
        }
        
        if (product_id === 'new')
            setData([])
        else
        fetchData()

    }, [])


    if (!data)
        return <main id="loading">Loading...</main>

}