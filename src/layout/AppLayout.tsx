import type React from "react";
import Header from "../components/header/Header";
import { Outlet } from "react-router-dom";
import Footer from "../components/footer/Footer";

const AppLayout: React.FC = () => {
    return(
        <>
                <Header/>
                <Outlet/>
                <Footer/>
        </>
    )
}

export default AppLayout;