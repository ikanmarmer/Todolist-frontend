import { Link } from "react-router-dom";

function Navbar(){
    return(
      <header className="bg-[#00cfd1] py-4 px-8 flex items-center justify-between shadow-lg transition-all duration-500">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-3xl font-bold text-black animate-fade-in">Todolist</Link>
          <nav className="flex gap-6">
            <Link to="/"  className="text-black text-lg relative transition-all duration-300 hover:text-white hover:scale-110 hover:after:w-full after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300">Home</Link>
            <Link to="/About" className="text-black text-lg relative transition-all duration-300 hover:text-white hover:scale-110 hover:after:w-full after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300">About</Link>
            <Link to="/Contact" className="text-black text-lg relative transition-all duration-300 hover:text-white hover:scale-110 hover:after:w-full after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300">Contact</Link>
          </nav>
        </div>
        <div className="flex gap-4">
          <Link to="/Login" className="bg-gray-100 text-black px-6 py-2 rounded-lg font-semibold shadow hover:bg-[#00cfd1] hover:text-white hover:scale-105 transition-all duration-300 ease-in-out">Login</Link>
          <Link to="/Register" className="bg-gray-100 text-black px-6 py-2 rounded-lg font-semibold shadow hover:bg-[#00cfd1] hover:text-white hover:scale-105 transition-all duration-300 ease-in-out">Register</Link>
        </div>
      </header>
    );
}

export default Navbar;