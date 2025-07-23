import { Route, Routes } from "react-router-dom";
import Home from "../App";
import About from "../pages/About";
import Contact from "../pages/Contact";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/dashboard/Dashboard";

function AppRoute(){
    return(
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home/>}/>
                <Route path="/About" element={<About />} />
                <Route path="/Contact" element={<Contact />} />
            </Route>
            <Route path="/Login" element={<Login />} />
            <Route path="Register" element={<Register />} />
            <Route element={<ProtectedRoute />}>
                <Route path="/Dashboard" element={<Dashboard />} />
            </Route>
        </Routes>
    );
}

export default AppRoute