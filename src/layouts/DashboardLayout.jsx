import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import PageTitle from "../routes/PageTitle";
import { useEffect, useState } from "react";
import Aos from 'aos';
import 'aos/dist/aos.css';

function DashboardLayout() {
  PageTitle();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [forceMobileNav, setForceMobileNav] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    Aos.init({ duration: 1000, once: true });
    
    // Fungsi untuk mendeteksi zoom level dan ukuran layar
    const checkLayout = () => {
      // Deteksi ukuran layar
      setIsMobile(window.innerWidth < 1024);
      
      // Deteksi zoom level
      const zoomLevel = window.outerWidth / window.innerWidth;
      setForceMobileNav(zoomLevel >= 1.1);
    };

    // Jalankan saat pertama kali dimuat dan saat resize
    checkLayout();
    window.addEventListener('resize', checkLayout);

    return () => {
      window.removeEventListener('resize', checkLayout);
    };
  }, []);

  // Hitung margin top dinamis
  const mainMarginTop = forceMobileNav || isMobile ? 'mt-20' : '';

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-teal-300 via-cyan-300 to-emerald-300">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Konten utama */}
      <div className="flex-1">
        {/* Navbar Mobile */}
        <header 
          className={`fixed top-0 left-0 right-0 z-40 bg-white shadow-md p-4 flex items-center justify-between ${
            forceMobileNav ? 'flex' : 'lg:hidden'
          }`}
        >
          <div className="text-xl font-bold text-gray-800">Your Logo</div>
          
          {/* Tombol hamburger animasi */}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            aria-label="Toggle sidebar"
          >
            <div className="w-6 h-6 relative transform transition-all duration-300">
              <span className={`absolute left-0 top-1/2 block w-full h-0.5 bg-current transform transition duration-300 ease-in-out 
                ${sidebarOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'}`}></span>
              <span className={`absolute left-0 top-1/2 block w-full h-0.5 bg-current transition duration-300 ease-in-out 
                ${sidebarOpen ? 'opacity-0' : ''}`}></span>
              <span className={`absolute left-0 top-1/2 block w-full h-0.5 bg-current transform transition duration-300 ease-in-out 
                ${sidebarOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'}`}></span>
            </div>
          </button>
        </header>

        {/* Main Content */}
        <main className={`py-6 px-6 md:px-10 transition-all duration-300 ${mainMarginTop} ${
          forceMobileNav ? '' : 'xl:ml-64'
        }`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;