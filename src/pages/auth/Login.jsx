import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthController from "../../controllers/AuthController";
import Swal from "sweetalert2";

function Login(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = AuthController((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Login...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await login(email, password, navigate);
      Swal.fire({
        icon: "success",
        title: "Berhasil Login",
        text: "Selamat datang kembali",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal Login",
        text: err.response?.data?.message || "Email atau password salah",
      });
    }
  };

    return(
    <div className="min-h-screen bg-gradient-to-br from-teal-300 via-cyan-300 to-emerald-300 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl p-4 shadow-inner">
          <h2 className="text-2xl font-bold text-white text-center mb-6 drop-shadow-lg">Login</h2>
          
          <form className="max-w-md mx-auto space-y-4" onSubmit={handleLogin}>
            <div className="relative">
              <label className="block text-white text-sm font-medium mb-2 drop-shadow">Email</label>
              <input
                type="email"
                value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  required
                className="input validator w-full px-4 py-3 bg-gradient-to-r from-teal-400 to-cyan-400 border-2 border-teal-300 rounded-lg text-white placeholder-teal-100 focus:outline-none focus:ring-4 focus:ring-cyan-200 focus:border-cyan-200 focus:scale-105 transition-all duration-300 shadow-inset hover:shadow-lg hover:from-teal-350 hover:to-cyan-350"
              />
            </div>
            
            <div className="relative flex items-center">
              <div className="w-full">
                <label className="block text-white text-sm font-medium mb-2 drop-shadow">Password</label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                  required
                  minLength={7}
                  className="input validator w-full px-4 py-3 bg-gradient-to-r from-teal-400 to-cyan-400 border-2 border-teal-300 rounded-lg text-white placeholder-teal-100 focus:outline-none focus:ring-4 focus:ring-cyan-200 focus:border-cyan-200 focus:scale-105 transition-all duration-300 shadow-inset hover:shadow-lg hover:from-teal-350 hover:to-cyan-350 pr-10"
                  style={{paddingRight: '2.5rem'}}
                />
              </div>
              
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 shadow-lg border border-teal-500 hover:border-teal-400"
            >
              Login
            </button>
          </form>
          
          <div className="text-center mt-6">
            <p className="text-white text-sm drop-shadow">
              Don't have an account?{' '}
              <Link
                to="/Register"
                className="text-cyan-100 hover:text-white font-semibold underline hover:no-underline transition-all duration-200 hover:scale-105 inline-block"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
    </div>

    );
}

export default Login;