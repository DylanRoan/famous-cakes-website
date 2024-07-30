'use client'

import { useEffect, useState } from "react"

export default function AccountPanel () {
    const [data, setData] = useState(false);
    const [errorState, setErrorState] = useState(false);

    /*
    const fetchData = async () => {
        try {
            await fetch(process.env.API_URL + '/api/user', {cache: 'no-store'})
            .then(response => response.json())
            .then(data => {
                if (data.status == 200)
                    setData(data.message[0])
                else
                    setErrorState(data.message)
            }).catch(error => {setErrorState(error); console.log(error)})
        } catch (e) { setErrorState(e); console.log(e)}
    }

    useEffect(() => { fetchData() }, [])
    */

    useEffect(() => { //TEST \\ REMOVE IN PROD
        setData({
            username: "Test User",
            email: "test@gmail.com",
            email_verified: false,
            phone_code: "+971",
            phone_number: "54 337 5942",
            phone_verified: false,
            creation_date: Date()
        })
     }, []) //TEST \\ REMOVE IN PROD

    if (errorState) return <div>Error: {errorState.toString()} <br></br>Please contact us to review / fix this issue.</div>
    if (!data) return <div>Loading information...</div >

    return (
        <div>
            <section>
                <h1>Welcome {data.username}!</h1>
                <p>Email: {data.email}</p>
                <p>Phone: {data.phone_code} {data.phone_number} </p>
            </section>
            <section>
                <h2>Pending Orders</h2>
            </section>

            <section>
                <h2>Notices</h2>
                {!data.email_verified ? (<p className="profile-unverified">Email Unverified : Your account will be deleted in 30 days.</p>) : ''}
                {!data.phone_verified ? (<p className="profile-unverified">Phone Number Unverified : You will not be able to make orders or reviews</p>) : ''}
            </section>
        </div>
    )
}