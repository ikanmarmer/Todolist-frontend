import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function TitleRoute(){
    const location = useLocation();

    useEffect(() => {
        const titles = {
            "/": "Home ",
            "/About": "About ",
            "/Contact": "Contact ",
            "/Login": "Login ",
            "/Register": "Register ",
            "/Dashboard": "Dashboard ",
            "/todo-list": "Todo List ",
            "/todo-list-detail": "Todo List Detail ",
            "/profile": "Profile ",
            "/setting": "Setting ",
            "/plans": "Plans ",
        };

        document.title = titles[location.pathname];
    }, [location]);
    return null;
}

export default TitleRoute;