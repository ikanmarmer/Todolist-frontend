function About(){
  return(
    <div className="min-h-screen bg-gradient-to-br from-teal-300 via-cyan-300 to-emerald-300 font- text-black flex flex-col items-center">
      {/* Hero Section */}
      <section 
        className="flex flex-col items-center justify-center text-center px-6 min-h-screen w-full">
        <h1 className="text-7xl font-bold mb-8 leading-tight" style={{textShadow: '2px 4px 12px rgba(0,0,0,0.3)'}}>About our Todolist</h1>
        <p className="text-xl text-gray-800 mb-6">
          Discover how our powerful task management platform transforms the way you organize, 
          prioritize, and accomplish your daily goals with unprecedented efficiency and clarity.
        </p>
      </section>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-6 md:px-12 mb-20">
        <div className="bg-white rounded-2xl shadow-xl p-8" >
          <h2 className="text-2xl font-semibold mb-4">Intuitive Design</h2>
          <p className="text-gray-700">Navigate through your tasks effortlessly with our clean and minimal interface that feels natural.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8" >
          <h2 className="text-2xl font-semibold mb-4">Smart Prioritization</h2>
          <p className="text-gray-700">Easily set priorities and focus on what truly matters, without clutter or distractions.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8" >
          <h2 className="text-2xl font-semibold mb-4">Real-time Progress</h2>
          <p className="text-gray-700">Track your achievements as they happen, giving you the motivation to keep moving forward.</p>
        </div>
      </div>

      {/* Extra Content Section */}
      <div className="max-w-5xl px-6 mb-40" >
        <h2 className="text-3xl font-bold mb-6">Why Choose Us?</h2>
        <p className="text-gray-800 mb-4">Our Todolist platform is more than just a list of tasks. It's a personal productivity companion that adapts to your workflow. Whether you're a student, a professional, or simply someone who loves staying organized, we offer the tools you need to excel.</p>
        <p className="text-gray-800 mb-4">We continuously update our features to match the evolving demands of our users. Your success is our top priority, and we are committed to helping you achieve your goals faster and smarter.</p>
        <p className="text-gray-800 mb-4">Scroll, explore, and experience the future of productivity management right here with Todolist.</p>
      </div>
    </div>
  );
}

export default About;