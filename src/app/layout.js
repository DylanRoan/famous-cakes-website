import "./layout.scss";
export const dynamic = 'force-dynamic'

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8"></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1"></meta>
        <meta name="theme-color" content="#000000"></meta>
        <meta name="description" content="The Best Cake in Town."></meta>
        <title>Famous Cakes</title>
        <link rel="icon" href="/assets/logo.png"></link>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}


export const viewport = {
  maximumScale: 1,
  minimumScale: 1,
  defaultScale: 1
}