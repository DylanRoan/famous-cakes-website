import { sessionCheck } from '@//app/session/session'

import { ProductsList } from '../../products/[[...category]]/page'
import '../../products/[[...category]]/page.scss'

import { cookies } from 'next/headers'

export default async function Products ({ params }) {
    const search = params.search
    let current_session = await sessionCheck()
    let session_cookie = cookies().get('session_token')

    let query = new URLSearchParams()
    query.set('limit', '20')
    query.set('value', search)

    return (
    <main id='products-page'>
        {
            await fetch(process.env.API_URL + `/api/products/search?${query.toString()}`, {
                cache: "no-store",
                headers: {'Cookie': `session_token=${session_cookie ? session_cookie.value : ''}`}
                })
            .then(response => response.json())
            .then(data => <ProductsList current_session={current_session} data={data}></ProductsList>)
            .catch(error => <div>Error: {error.toString()}</div>)
        }
    </main>
    )
}