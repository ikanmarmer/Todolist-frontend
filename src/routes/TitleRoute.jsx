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
            "/Dashboard": "Dashboard "
        };

        document.title = titles[location.pathname];
    }, [location]);
    return null;
}

export default TitleRoute;