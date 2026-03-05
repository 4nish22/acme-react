// components/layout/AppLayout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./footer";

const AppLayout = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Outlet /> 
      </main>
      <Footer />
    </>
  );
};

export default AppLayout;