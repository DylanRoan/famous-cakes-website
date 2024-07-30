'use client'

import { useState } from 'react'
import './page.scss'
import Link from 'next/link'
import { useRouter } from 'next/navigation'


export default function Signup () {
    const [failedSignup, setFailedSignup] = useState(false)
    const [errorState, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const onSubmit = async (e) => {
        e.preventDefault()
        
        setFailedSignup(false)
        setError(false)

        if (loading) return
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const data = {
            username: formData.get("username"),
            email: formData.get("email"),
            password: formData.get("password"),
            phone_code: formData.get("phone_code"),
            phone: formData.get("phone"),
        }
        
        //Make a signup attempt
        let dir = false
        try {
            await fetch(process.env.API_URL + '/api/authentication/signup', {
                cache: 'no-store',
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: `${JSON.stringify(data)}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.status == 400) 
                    setError(true)
                if (data.status == 403) 
                    setFailedSignup(true)
                if (data.status != 200)
                    setLoading(false)
                if (data.status == 200)
                    router.push("/login")
            })
            .catch(error => { 
                setError(true)
                setLoading(false)
                console.log(error)
             })
        }
        catch (e) {
            console.log(e)
            setError(true)
            setLoading(false)
        }
    }

    return (
        <main id='signup' className='bg-blush'>
            <section>
                <aside>
                    <div className='intro'>
                        <img src='assets/logo.png' className='logo'></img>
                        <h3 className='header'>Join us today!</h3>
                    </div>
                    <form onSubmit={onSubmit}>
                        <input type="text" id="username" name="username" required placeholder='Username'></input>

                        <input type="text" id="email" name="email" required placeholder='Email'></input>

                        
                        <div className='phone_container'>
                            <input type="tel" id="phone_code" name="phone_code" required placeholder='(+971)'></input>
                            <input type="tel" id="phone" name="phone" required placeholder='123 567 8910'></input>
                        </div>

                        <input type="password" id="password" name="password" required  placeholder='Password'></input>
                        
                        <input type='submit' id='submit' name='submit' value={"Sign up!"}></input>

                        { failedSignup && ( <p className='error'>That account already exists!</p>) }
                        { errorState && ( <p className='error'>There was an error while trying to sign up. Please contact us to let us check.</p>) }
                    </form>
                    <div className='extra'>
                        <Link href='/login'><p>Already have an account?</p></Link>
                    </div>
                </aside>
                <aside>
                    <video loop autoPlay muted={true}>
                        <source src="/assets/famous-cakes-making.mp4" type="video/mp4" />
                    </video>
                </aside>
            </section>
        </main>
    )
}