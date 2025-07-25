import { Link } from "react-router-dom";

function Home() {
  return (
<div className="min-h-screen bg-gradient-to-br from-teal-300 via-cyan-300 to-emerald-300 flex flex-col items-center justify-center">
      {/* Hero Section */}
      <section
        className="flex flex-col items-center justify-center text-center px-6 min-h-screen w-full"

      >
        <h2 className="text-6xl font-extrabold text-black mb-4 drop-shadow-2xl" style={{textShadow: '2px 4px 12px rgba(0,0,0,0.3)'}}>
          Get Started
        </h2>
        <p className="text-xl text-black max-w-2xl mb-8 drop-shadow-lg" style={{textShadow: '1px 2px 8px rgba(0,0,0,0.15)'}}>
          Manage your daily tasks easily and efficiently using our Todolist.
          Add, prioritize, and track your progress in one clean and intuitive
          view.
        </p>
        <Link to="/register" className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-4 px-12 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
          Start Now
        </Link>
      </section>

      {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mb-16 mx-auto w-full justify-items-center">
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-8 shadow-lg" style={{textShadow: '2px 4px 12px rgba(0,0,0,0.3)'}}>
            <h2 className="text-3xl font-bold text-black mb-6">Our Mission</h2>
            <p className="text-gray-800 text-lg leading-relaxed">
              We believe productivity should be intuitive, not overwhelming. Todolist was created 
              to simplify task management by providing a clean, efficient platform that adapts 
              to your unique workflow and helps you achieve more with less stress.
            </p>
          </div>
          
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-8 shadow-lg" style={{textShadow: '2px 4px 12px rgba(0,0,0,0.3)'}}>
            <h2 className="text-3xl font-bold text-black mb-6">Why Choose Us</h2>
            <p className="text-gray-800 text-lg leading-relaxed">
              Our platform combines powerful functionality with elegant simplicity. From intelligent 
              prioritization to seamless progress tracking, every feature is designed to enhance 
              your productivity without adding unnecessary complexity to your day.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mb-16 mx-auto w-full justify-items-center">
          <div className="text-center">
            <div className="bg-cyan-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white">✓</span>
            </div>
            <h3 className="text-2xl font-bold text-black mb-3">Smart Organization</h3>
            <p className="text-gray-800">
              Automatically categorize and prioritize your tasks based on deadlines, importance, and your personal workflow patterns.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-teal-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white">⚡</span>
            </div>
            <h3 className="text-2xl font-bold text-black mb-3">Lightning Fast</h3>
            <p className="text-gray-800">
              Experience instant task creation, editing, and completion with our optimized interface designed for speed and efficiency.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white">📊</span>
            </div>
            <h3 className="text-2xl font-bold text-black mb-3">Progress Insights</h3>
            <p className="text-gray-800">
              Track your productivity trends and celebrate achievements with detailed analytics and progress visualization tools.
            </p>
          </div>
        </div>

        {/* Team Values */}
        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-12 max-w-4xl text-center mb-16 shadow-lg mx-auto">
          <h2 className="text-4xl font-bold text-black mb-8" >Built for Everyone</h2>
          <p className="text-xl text-gray-800 leading-relaxed mb-8"  >
            Whether you are a busy professional managing complex projects, a student organizing coursework, 
            or someone looking to bring more structure to daily life, Todolist adapts to your needs and 
            grows with your ambitions.
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-700" >
            <span className="bg-white bg-opacity-40 px-4 py-2 rounded-full flex items-center gap-2"><span role="img" aria-label="student">🎓</span>Students</span>
            <span className="bg-white bg-opacity-40 px-4 py-2 rounded-full flex items-center gap-2"><span role="img" aria-label="professional">💼</span>Professionals</span>
            <span className="bg-white bg-opacity-40 px-4 py-2 rounded-full flex items-center gap-2"><span role="img" aria-label="team">👥</span>Teams</span>
            <span className="bg-white bg-opacity-40 px-4 py-2 rounded-full flex items-center gap-2"><span role="img" aria-label="individual">🧑</span>Individuals</span>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mb-24 mx-auto">
          <h2 className="text-3xl font-bold text-black mb-6">Ready to Get Organized?</h2>
          <p className="text-lg text-gray-800 mb-8 max-w-2xl">
            Join us who have transformed productivity with Todolist. 
            Start your journey toward better task management today.
          </p>
          <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-4 px-12 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
            Get Started
          </button>
        </div>
      </div>
  );
}

export default Home;