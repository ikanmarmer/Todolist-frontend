import { useState } from "react";
import Swal from "sweetalert2";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        import.meta.env.VITE_API_URL + "/contact",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const contentType = res.headers.get('content-type');
    let data;
    
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      throw new Error(`Unexpected response: ${text.slice(0, 100)}`);
    }

    if (res.ok) {
      // ... sukses
    } else {
      throw new Error(data.message || `HTTP error! Status: ${res.status}`);
    }
  } catch (err) {
    Swal.fire({
      icon: "error",
        title: "Oops...",
        text: err.message,
    });
  }
};
  //     const data = await res.json();

  //     if (res.ok) {
  //       Swal.fire({
  //         icon: "success",
  //         title: "Message Sent!",
  //         text: data.message,
  //       });
  //       setForm({ name: "", email: "", subject: "", message: "" });
  //     } else {
  //       throw new Error(data.message || "Server error");
  //     }
  //   } catch (err) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Oops...",
  //       text: err.message,
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div
      className="bg-gradient-to-br from-teal-300 via-cyan-300 to-emerald-300
                 text-black overflow-x-hidden"
    >
      {/* 1. Hero occupying the first viewport */}
      <div
        className="h-screen flex flex-col justify-center items-center
                   px-4 text-center"
      >
        <h1
          className="text-7xl font-bold mb-6 leading-tight"
          style={{
            textShadow: "2px 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          Contact
        </h1>
        <p className="text-xl text-gray-800 max-w-xl">
          We would love to hear from you. Reach out to us anytime!
        </p>
      </div>

      {/* 2. Form, still on the same background */}
      <div className="px-4 pb-24"> {/* pb-24 adds space before footer */}
        <div className="max-w-lg mx-auto bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl px-8 py-7 shadow-inner mt-16">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-white text-sm font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Your name"
                className="w-full px-4 py-3 bg-gradient-to-r from-teal-400 to-cyan-400
                           border-2 border-teal-300 rounded-lg text-white
                           placeholder-teal-100 focus:outline-none focus:ring-4
                           focus:ring-cyan-200 focus:border-cyan-200
                           transition-all duration-300 shadow-inset hover:shadow-lg"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-white text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-gradient-to-r from-teal-400 to-cyan-400
                           border-2 border-teal-300 rounded-lg text-white
                           placeholder-teal-100 focus:outline-none focus:ring-4
                           focus:ring-cyan-200 focus:border-cyan-200
                           transition-all duration-300 shadow-inset hover:shadow-lg"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-white text-sm font-medium mb-1">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
                placeholder="Subject"
                className="w-full px-4 py-3 bg-gradient-to-r from-teal-400 to-cyan-400
                           border-2 border-teal-300 rounded-lg text-white
                           placeholder-teal-100 focus:outline-none focus:ring-4
                           focus:ring-cyan-200 focus:border-cyan-200
                           transition-all duration-300 shadow-inset hover:shadow-lg"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-white text-sm font-medium mb-1">
                Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows="5"
                placeholder="Type your message here..."
                className="w-full px-4 py-3 bg-gradient-to-r from-teal-400 to-cyan-400
                           border-2 border-teal-300 rounded-lg text-white
                           placeholder-teal-100 focus:outline-none focus:ring-4
                           focus:ring-cyan-200 focus:border-cyan-200
                           transition-all duration-300 shadow-inset hover:shadow-lg"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-teal-600 to-cyan-700
                         hover:from-teal-700 hover:to-cyan-800 text-white font-bold
                         py-3 rounded-lg transition-all duration-300 transform
                         hover:scale-105 hover:shadow-xl active:scale-95 shadow-lg
                         border border-teal-500 disabled:opacity-50 ${
                           loading ? "loading" : ""
                         }`}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
