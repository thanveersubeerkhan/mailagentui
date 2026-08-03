import { Link } from 'react-router-dom';
import { Cloud, Server, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-400/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="z-10 text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-6 tracking-tight">
          System Dashboard
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Select an environment to view analytics, monitor status, and manage infrastructure seamlessly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl z-10">
        <Link 
          to="/platform"
          className="group relative bg-white backdrop-blur-xl border border-gray-200 rounded-3xl p-8 hover:bg-gray-50 transition-all duration-500 overflow-hidden hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] shadow-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="bg-orange-100 p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform duration-500">
              <Cloud className="w-8 h-8 text-orange-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform</h2>
            <p className="text-gray-600 mb-8 flex-grow">
              Access the Edge Network dashboard. Monitor web traffic, configure WAF rules, and manage DNS settings globally.
            </p>
            <div className="flex items-center text-orange-600 font-medium group-hover:text-orange-500 transition-colors">
              <span>Enter Environment</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </div>
        </Link>

        <Link 
          to="/server"
          className="group relative bg-white backdrop-blur-xl border border-gray-200 rounded-3xl p-8 hover:bg-gray-50 transition-all duration-500 overflow-hidden hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(99,102,241,0.15)] shadow-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="bg-indigo-100 p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform duration-500">
              <Server className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Core Server</h2>
            <p className="text-gray-600 mb-8 flex-grow">
              Manage your internal infrastructure. View hardware metrics, active processes, and email analysis tools.
            </p>
            <div className="flex items-center text-indigo-600 font-medium group-hover:text-indigo-500 transition-colors">
              <span>Enter Environment</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
