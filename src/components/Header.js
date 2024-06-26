import React from 'react';
import { Search } from 'lucide-react';

const Header = () => (
  <div className="bg-slate-700 text-white p-4 flex justify-between items-center">
    <div className="text-xl font-bold">SPINNAKER</div>
    <div className="flex items-center">
      <span className="mr-4 cursor-pointer hover:text-gray-300">Applications</span>
      <span className="mr-4 cursor-pointer hover:text-gray-300">Infrastructure</span>
      <div className="relative">
        <input type="text" placeholder="Search" className="bg-slate-600 px-2 py-1 rounded text-white" />
        <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
      </div>
    </div>
  </div>
);

export default Header;
