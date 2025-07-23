import { Route, Routes } from "react-router-dom";
import Home from "../App";
import About from "../pages/About";
import Contact from "../pages/Contact";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import TodoListDetail from "../pages/dashboard/TodolistDetail";
import TodoList from "../pages/dashboard/TodoList";
import Profile from "../pages/dashboard/Profile";
import Setting from "../pages/dashboard/Setting";
import Plans from "../pages/dashboard/Plan";

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
            <Route element={<ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>}>
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/todo-list" element={<TodoList />} />
        <Route path="/todo-list-detail/:id" element={<TodoListDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/plans" element={<Plans />} />
      </Route>
        </Routes>
    );
}

export default AppRoute