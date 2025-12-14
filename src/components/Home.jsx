import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaShieldAlt, FaPenFancy, FaSearch, FaUserLock, FaMagic, FaLightbulb } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-stone-900 font-sans cursor-default">
      {/*  Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 mt-3 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
            <h1 className="text-2xl font-bold font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif] bg-gradient-to-r from-[rgb(255,65,108)] via-[rgb(77,41,255)] to-[rgb(255,41,216)] bg-clip-text text-transparent">
              ThoughtSharing App
            </h1>
          </Link>

          {/* Menu */}
          <div className="flex items-center gap-6 font-medium text-stone-600">
            <Link to="/login" className="hover:text-stone-900 transition-colors">Login</Link>
            <Link to="/signup" className="hover:text-stone-900 transition-colors">Sign Up</Link>
            <a href="#contact" className="hover:text-stone-900 transition-colors">Contact Us</a>
          </div>
        </div>
      </nav>

      {/* 🦸 Hero Section */}
      <section className="relative px-6 py-20 lg:py-32 flex flex-col items-center text-center max-w-5xl mx-auto">
        <div className="mb-6">
           <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold tracking-wide uppercase">
             Your Digital Safe Space
           </span>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-500">Welcome</h2>
        <h1 className="text-5xl md:text-7xl font-extrabold text-stone-900 leading-tight mb-6">
          ThoughtSharing App
        </h1>
        <p className="text-xl md:text-2xl text-stone-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          A safe space to write what your heart feels.
          <br className="hidden md:block"/>
          Because some thoughts deserve to be shared.
        </p>
        
        <Link 
          to="/signup"
          className="bg-black text-white text-[15px] font-semibold px-10 py-3 rounded-full rounded-tl-none hover:shadow-[0_4px_8px_rgba(0,0,0,0.3)] transition-all"
        >
          Start Sharing
        </Link>
      </section>

      {/* ✨ Features Section */}
      <section className="px-6 py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">Everything you need to express yourself</h2>
            <p className="text-stone-500">Simple, powerful, and designed for you.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FaPenFancy className="text-blue-500" />}
              title="Write Freely"
              desc="Capture your personal thoughts and notes in a clean, distraction-free environment."
            />
            <FeatureCard 
              icon={<FaHeart className="text-red-500" />}
              title="Connect with Likes"
              desc="Show appreciation for thoughts that resonate with you using our Instagram-style like system."
            />
            <FeatureCard 
              icon={<FaSearch className="text-purple-500" />}
              title="Instant Search"
              desc="Easily find any past thought or note with our lightning-fast search."
            />
            <FeatureCard 
              icon={<FaUserLock className="text-green-500" />}
              title="Personal Dashboard"
              desc="Your own private corner of the internet to manage and organize your ideas."
            />
             <FeatureCard 
              icon={<FaMagic className="text-orange-500" />}
              title="Beautiful Design"
              desc="A modern, aesthetic interface that makes writing a joy."
            />
             <FeatureCard 
              icon={<FaShieldAlt className="text-stone-700" />}
              title="Secure Platform"
              desc="Your data is yours. We prioritize your privacy and security above all."
            />
          </div>
        </div>
      </section>

      {/* 🔒 Security Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block p-4 rounded-full bg-green-50 mb-6">
                <FaShieldAlt className="text-4xl text-green-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-6">Why this app is secure</h2>
            <p className="text-stone-500 text-lg leading-relaxed mb-8">
                We use top-tier authentication systems to ensure that only <strong>you</strong> can access your account. 
                Your data is protected with industry-standard security measures. No one can see your private thoughts unless you choose to share them.
            </p>
        </div>
      </section>

      {/* 📬 Contact Section */}
      <section id="contact" className="px-6 py-20 bg-stone-900 text-stone-300">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">We'd love to hear from you</h2>
          <p className="mb-8 text-lg">
            Facing an issue? Have a suggestion? Or just want to say hi?
          </p>
          
          <div className="bg-stone-800/50 p-8 rounded-2xl inline-block backdrop-blur-sm border border-stone-700">
             <p className="text-stone-400 mb-2 uppercase text-sm font-semibold tracking-wider">Contact & Support</p>
             <a href="mailto:thoughtsharing09@gmail.com" className="text-2xl md:text-3xl font-bold text-white hover:text-blue-400 transition-colors">
                thoughtsharing09@gmail.com
             </a>
             <p className="mt-4 text-stone-500">
                We typically reply within 24 hours.
             </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-stone-950 text-stone-600 text-center text-sm border-t border-stone-800">
        <p className="mb-2">© {new Date().getFullYear()} ThoughtSharing App. All rights reserved.</p>
        <p className="text-stone-500 text-xs mt-4">
          Created by: <span className="font-semibold text-stone-400">Drashti manguwala</span>
        </p>
        <p className="text-stone-500 text-xs mt-1">
          Suggestion by: <span className="font-semibold text-stone-400">Het Mistry, Het anghan, Chauhan Nishita</span>
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-stone-100">
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-stone-50 mb-6 text-2xl">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-stone-800 mb-3">{title}</h3>
      <p className="text-stone-500 leading-relaxed">{desc}</p>
    </div>
  );
}
