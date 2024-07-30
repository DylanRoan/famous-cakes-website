import Header from "../components/header/header";
import Footer from "../components/footer/footer";

export default function MainLayout({ children }) {
  return (
      <div>
        <Header></Header>
        {children}
        <Footer></Footer>
      </div>
  );
}
