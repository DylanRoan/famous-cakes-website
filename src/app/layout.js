import "./layout.scss";
import Navbar from "./components/navbar/navbar";
import Footer from "./components/footer/footer";
export const dynamic = 'force-dynamic'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8"></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
        <meta name="theme-color" content="#000000"></meta>
        <meta name="description" content="Famous Cakes is a cafe located around Al Wahda, Abu Dhabi."></meta>
        <title>Famous Cakes</title>
        <link rel="icon" href="/logo.png"></link>
      </head>
      <body>
        <Navbar></Navbar>
        {children}
        <Footer></Footer>
      </body>
    </html>
  );
}
