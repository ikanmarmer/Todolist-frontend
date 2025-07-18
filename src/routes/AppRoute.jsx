import { Route, Routes } from "react-router-dom";
import Home from "../App";
import About from "../about";
import Contact from "../contact";

function AppRoute(){
    return(
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/About" element={<About />} />
            <Route path="/Contact" element={<Contact />} />
        </Routes>
    );
}

export default AppRoute