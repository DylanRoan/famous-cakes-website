'use client'

import { useState } from 'react'
import './page.scss'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Login () {
    const [failedLogin, setFailedLogin] = useState(false)
    const [errorState, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    const router = useRouter()

    const onSubmit = async (e) => {
        e.preventDefault()

        setFailedLogin(false)
        setError(false)

        if (loading) return
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const data = {
            email: formData.get("email"),
            password: formData.get("password")
        }
        
        //Make a login attempt
        try {
            await fetch(process.env.API_URL + '/api/authentication/login', {
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
                    setFailedLogin(true)
                if (data.status != 200)
                    setLoading(false)
                if (data.status == 200) {
                    window.location.href = "/"
                }
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
        <main id='login' className='bg-blush'>
            <section>
                <aside>
                    <div className='intro'>
                        <img src='assets/logo.png' className='logo'></img>
                        <h3 className='header'>Welcome Back!</h3>
                    </div>
                    <form onSubmit={onSubmit}>
                        <input type="text" id="email" name="email" required placeholder='Email'></input>

                        <input type="password" id="password" name="password" required  placeholder='Password'></input>
                        
                        <input type='submit' id='submit' name='submit' value={"Log in!"}></input>

                        { failedLogin && ( <p className='error'>Login failed. Wrong password or email?</p>) }
                        { errorState && ( <p className='error'>There was an error while trying to log in. Please contact us to let us check.</p>) }
                    </form>
                    <div className='extra'>
                        <Link href='/signup'><p>Sign up instead</p></Link>
                        <Link href='/resetpassword'><p>Forgot password?</p></Link>
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