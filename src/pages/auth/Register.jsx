import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AuthController from "../../controllers/AuthController";
import Swal from "sweetalert2";
import { useState } from "react";


function Register(){
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const register = AuthController((state) => state.register);
  const navigate = useNavigate();

    const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


    const handleRegister = async (e) => {
  e.preventDefault();

  Swal.fire({
    title: "Creating your account...",
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });

  try {
    await register(form, navigate);
    
    Swal.fire({
      icon: "success",
      title: "Account Created!",
      text: "Your registration was successful. Would you like to login now?",
      showCancelButton: true,
      confirmButtonText: "Login Now",
      cancelButtonText: "Later",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/login");
      }
    });
    
  } catch (err) {
    const errorMessage = err.response?.data?.message 
      || err.response?.data?.errors
      || "Registration failed. Please check your information and try again";
    
    Swal.fire({
      icon: "error",
      title: "Registration Error",
      html: typeof errorMessage === 'string' 
        ? errorMessage 
        : Object.values(errorMessage).map(msg => `<p>${msg}</p>`).join(''),
    });
  }
    };

    return(
    <div className="min-h-screen bg-gradient-to-br from-teal-300 via-cyan-300 to-emerald-300 flex items-center justify-center p-2">
        <div className="bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl px-8 py-4 shadow-inner">
          <h2 className="text-2xl font-bold text-white text-center mb-6 drop-shadow-lg">Register</h2>
          
          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="relative">
              <label className="block text-white text-sm font-medium mb-2 drop-shadow">Name</label>
              <input
                type="text"
                placeholder="First Name"
                className="input validator w-full px-4 py-3 bg-gradient-to-r from-teal-400 to-cyan-400 border-2 
                border-teal-300 rounded-lg text-white placeholder-teal-100 focus:outline-none 
                focus:ring-4 focus:ring-cyan-200 focus:border-cyan-200 focus:scale-105 transition-all 
                duration-300 shadow-inset hover:shadow-lg hover:from-teal-350 hover:to-cyan-350"
                required
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <label className="block text-white text-sm font-medium mb-2 drop-shadow">Email</label>
              <input
                type="email"
                placeholder="user@example.com"
                className="input validator w-full px-4 py-3 bg-gradient-to-r from-teal-400 to-cyan-400 border-2 
                border-teal-300 rounded-lg text-white placeholder-teal-100 focus:outline-none focus:ring-4 
                focus:ring-cyan-200 focus:border-cyan-200 focus:scale-105 transition-all duration-300 
                shadow-inset hover:shadow-lg hover:from-teal-350 hover:to-cyan-350"
                required
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            
                        
            <div className="relative">
              <label className="block text-white text-sm font-medium mb-2 drop-shadow">Password</label>
              <input
                type="password"
                placeholder="Password"
                className="input validator w-full px-4 py-3 bg-gradient-to-r from-teal-400 to-cyan-400 border-2 
                border-teal-300 rounded-lg text-white placeholder-teal-100 focus:outline-none focus:ring-4 
                focus:ring-cyan-200 focus:border-cyan-200 focus:scale-105 transition-all duration-300 
                shadow-inset hover:shadow-lg hover:from-teal-350 hover:to-cyan-350"
                name="password"
                value={form.password}
                onChange={handleChange}
                minLength={7}
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 shadow-lg border border-teal-500 hover:border-teal-400"
            >
              Register
            </button>
          </form>
          
          <div className="text-center mt-6">
            <p className="text-white text-sm drop-shadow">
              Already have an account?{' '}
              <Link
                to="/Login"
                className="text-cyan-100 hover:text-white font-semibold underline hover:no-underline transition-all duration-200 hover:scale-105 inline-block"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
    </div>
    );
}

export default Register;