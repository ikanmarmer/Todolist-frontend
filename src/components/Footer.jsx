import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 py-12 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h5 className="text-xl font-bold text-white mb-4">Todolist</h5>
              <p className="text-gray-400">
                The ultimate task management solution for individuals and teams.
              </p>
            </div>
            <div>
              <h6 className="font-semibold text-white mb-4">Product</h6>
              <div className="space-y-2">
                <Link to="#" className="block text-gray-400 hover:text-white">Features</Link>
                <Link to="#" className="block text-gray-400 hover:text-white">Pricing</Link>
                <Link to="#" className="block text-gray-400 hover:text-white">API</Link>
              </div>
            </div>
            <div>
              <h6 className="font-semibold text-white mb-4">Company</h6>
              <div className="space-y-2">
                <Link to="/About" className="block text-gray-400 hover:text-white">About</Link>
                <Link to="#" className="block text-gray-400 hover:text-white">Blog</Link>
                <Link to="#" className="block text-gray-400 hover:text-white">Careers</Link>
              </div>
            </div>
            <div>
              <h6 className="font-semibold text-white mb-4">Support</h6>
              <div className="space-y-2">
                <Link to="#" className="block text-gray-400 hover:text-white">Help Center</Link>
                <Link to="/Contact" className="block text-gray-400 hover:text-white">Contact</Link>
                <Link to="#" className="block text-gray-400 hover:text-white">Privacy</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 Todolist. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
  );
}

export default Footer;