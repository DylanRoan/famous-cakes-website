import React from 'react'
import ProductsShowcase from '../../components/products-showcase/products-showcase';

import './homepage-css.scss'

const HomePage = () => {

    /* Dummy Data for Featured Cakes */
    const test_data = [
        {"name": "Cupcake", "type": "Sweets", "price": "12 AED / Piece", "id": "52152", "image": "https://scontent.ffjr1-1.fna.fbcdn.net/v/t39.30808-6/445436768_1068620634733928_4386343075900921374_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_ohc=AhzmhUUkPpIQ7kNvgEXGfXM&_nc_ht=scontent.ffjr1-1.fna&oh=00_AYAh7ieM2vFpGhGLfA84s0F4S58KsPqxVP3_peTk2CrnyA&oe=665D4D45"},
        {"name": "Cupcake", "type": "Sweets", "price": "12 AED / Piece", "id": "52152",  "image": "https://scontent.ffjr1-1.fna.fbcdn.net/v/t39.30808-6/445436768_1068620634733928_4386343075900921374_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_ohc=AhzmhUUkPpIQ7kNvgEXGfXM&_nc_ht=scontent.ffjr1-1.fna&oh=00_AYAh7ieM2vFpGhGLfA84s0F4S58KsPqxVP3_peTk2CrnyA&oe=665D4D45"},
        {"name": "Cupcake", "type": "Sweets", "price": "12 AED / Piece", "id": "52152",  "image": "https://scontent.ffjr1-1.fna.fbcdn.net/v/t39.30808-6/445436768_1068620634733928_4386343075900921374_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_ohc=AhzmhUUkPpIQ7kNvgEXGfXM&_nc_ht=scontent.ffjr1-1.fna&oh=00_AYAh7ieM2vFpGhGLfA84s0F4S58KsPqxVP3_peTk2CrnyA&oe=665D4D45"},
        {"name": "Cupcake", "type": "Sweets", "price": "12 AED / Piece", "id": "52152",  "image": "https://scontent.ffjr1-1.fna.fbcdn.net/v/t39.30808-6/445436768_1068620634733928_4386343075900921374_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_ohc=AhzmhUUkPpIQ7kNvgEXGfXM&_nc_ht=scontent.ffjr1-1.fna&oh=00_AYAh7ieM2vFpGhGLfA84s0F4S58KsPqxVP3_peTk2CrnyA&oe=665D4D45"},
        {"name": "Cupcake", "type": "Sweets", "price": "12 AED / Piece", "id": "52152",  "image": "https://scontent.ffjr1-1.fna.fbcdn.net/v/t39.30808-6/445436768_1068620634733928_4386343075900921374_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_ohc=AhzmhUUkPpIQ7kNvgEXGfXM&_nc_ht=scontent.ffjr1-1.fna&oh=00_AYAh7ieM2vFpGhGLfA84s0F4S58KsPqxVP3_peTk2CrnyA&oe=665D4D45"},
        {"name": "Cupcake", "type": "Sweets", "price": "12 AED / Piece", "id": "52152",  "image": "https://scontent.ffjr1-1.fna.fbcdn.net/v/t39.30808-6/445436768_1068620634733928_4386343075900921374_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_ohc=AhzmhUUkPpIQ7kNvgEXGfXM&_nc_ht=scontent.ffjr1-1.fna&oh=00_AYAh7ieM2vFpGhGLfA84s0F4S58KsPqxVP3_peTk2CrnyA&oe=665D4D45"},
        {"name": "Cupcake", "type": "Sweets", "price": "12 AED / Piece", "id": "52152",  "image": "https://scontent.ffjr1-1.fna.fbcdn.net/v/t39.30808-6/445436768_1068620634733928_4386343075900921374_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_ohc=AhzmhUUkPpIQ7kNvgEXGfXM&_nc_ht=scontent.ffjr1-1.fna&oh=00_AYAh7ieM2vFpGhGLfA84s0F4S58KsPqxVP3_peTk2CrnyA&oe=665D4D45"},
        {"name": "Cupcake", "type": "Sweets", "price": "12 AED / Piece", "id": "52152",  "image": "https://scontent.ffjr1-1.fna.fbcdn.net/v/t39.30808-6/445436768_1068620634733928_4386343075900921374_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_ohc=AhzmhUUkPpIQ7kNvgEXGfXM&_nc_ht=scontent.ffjr1-1.fna&oh=00_AYAh7ieM2vFpGhGLfA84s0F4S58KsPqxVP3_peTk2CrnyA&oe=665D4D45"}
    ]
    
    return (
        <main id='homepage'>
            <section className='banner'>
            <video loop autoPlay muted={true}>
                <source src="/coffee.mp4" type="video/mp4" />
            </video>
            </section>
            <article>
                <h1>Cakes</h1>
                <ProductsShowcase data={test_data} />
                <aside>
                    
                </aside>
            </article>
        </main>
    );
}
  
export default HomePage;