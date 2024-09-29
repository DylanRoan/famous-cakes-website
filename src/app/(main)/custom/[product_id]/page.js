import './page.scss'

export default async function CustomCake ({ params }) {

    const custom_id = params.product_id

    let data = {}
    try {
        let response = await fetch(process.env.API_URL + '/api/products/product?product_id=' + custom_id, {cache: 'no-store'})
        data = await response.json()

        if (data.status != 200)
            return <main id='error'>Error: {data.message}</main>
    } catch (error) {
        return <main id='error'>Error: {error.toString()}</main>
    }
    
    if (data.message.length < 1)
        return <main id='error'>Invalid product ID.</main>

    let product = data.message[0]
    if (!product.custom)
        return <main id='error'>Invalid product for customization.</main>
    if (!product.availability)
        return <main id='error'>Product is not available.</main>

    return (
        <main id="custom-order">
            <h1>{product.name}</h1>
            <section>
                <aside className='product_image_container' dangerouslySetInnerHTML={{ __html: ` 
                    <img src='/assets/product/${product.category}/${product.subcategory}/${product.product_id}.jpg' class='product_image'  onerror="this.src = '/assets/logo.jpg'" ></img>`}}>
                </aside>
                <aside className='product_content_container'>
                    <div>
                        <p>Name:</p>
                        <p>{product.name}</p>
                    </div>
                    <div>
                        <p>Price:</p>
                        <p>{product.price} AED</p>
                    </div>

                    <div>
                        <p>Description:</p>
                    </div>
                    <div>
                        <p>{product.description}</p>
                    </div>
                </aside>
            </section>
            <form>
                <fieldset>
                    <legend>Options</legend>
                    
                    <div>
                        <label for="custom-filling">Filling:</label>
                        <select id="custom-filling" name="custom-filling">
                            <option value="vanilla">Vanilla</option>
                            <option value="chocolate">Chocolate</option>
                            <option value="red velvet">Red Velvet</option>
                            <option value="marble">Marble</option>
                        </select>
                    </div>

                    <div>
                        <label for="cakepop-order">Cakepops:</label>
                        <select id="cakepop-order" name="cakepop-order">
                            <option value="0">Select Cakepops Order</option>
                            <option value="0">None</option>
                            <option value="6">6 Cakepops (+25 AED)</option>
                            <option value="9">9 Cakepops (+35 AED)</option>
                            <option value="12">12 Cakepops (+50 AED)</option>
                        </select>
                    </div>

                    <div>
                        <label for="cupcake-order">Cupcakes:</label>
                        <select id="cupcake-order" name="cupcake-order">
                            <option value="0">Select Cupcakes Order</option>
                            <option value="0">None</option>
                            <option value="6">6 Cupcakes (+25 AED)</option>
                            <option value="9">9 Cupcakes (+35 AED)</option>
                            <option value="12">12 Cupcakes (+50 AED)</option>
                        </select>
                    </div>

                    <div>
                        <label for="weight">Weight:</label>
                        <select id="weight" name="weight">
                            <option value="0">Select Weight of Cake</option>
                            <option value="1">1 Kilo</option>
                            <option value="2">2 Kilo</option>
                            <option value="3">3 Kilo</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor='special-request'>Special Request</label>
                    </div>
                    <div>
                        <input name='special_request' id='special-request' type='text'></input>
                    </div>
                </fieldset>

                <button>Order</button>
            </form>
        </main>
    )
}