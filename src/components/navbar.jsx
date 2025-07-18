import { Link } from "react-router-dom";


function Navbar(){
    return(
        <div className="navbar bg-base-100 shadow-sm px-60 flex justify-between">
      <a className="btn btn-ghost text-xl">daisyUI</a>
      <div className="flex space-x-5">
        <div>
          <Link to="/">Home</Link>
        </div>
        <div>
          <Link to="/About">About</Link>
        </div>
        <div>
          <Link to="/Contact">Contact</Link>
        </div>
      </div>
    </div>
    );
}

export default Navbar;