import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Database, 
  Users, 
  ShoppingBag, 
  Package, 
  Bell, 
  Search,
  Menu,
  X
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, to, isCollapsed }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 mb-1 transition-colors duration-200 rounded-lg ${
          isActive
            ? 'bg-indigo-600 text-white'
            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
        }`
      }
    >
      <Icon size={20} className={isCollapsed ? 'mx-auto' : 'mr-3'} />
      {!isCollapsed && <span className="font-medium">{label}</span>}
    </NavLink>
  );
};

export default function AppLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      {/* Sidebar */}
      <aside 
        className={`${isCollapsed ? 'w-20' : 'w-64'} bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          {!isCollapsed && (
            <span className="text-xl font-bold text-white tracking-tight">ErpAI</span>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors mx-auto"
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/" isCollapsed={isCollapsed} />
          <SidebarItem icon={Database} label="AI Raporlama" to="/ai-reporting" isCollapsed={isCollapsed} />
          <SidebarItem icon={Users} label="Müşteriler" to="/customers" isCollapsed={isCollapsed} />
          <SidebarItem icon={ShoppingBag} label="Siparişler" to="/orders" isCollapsed={isCollapsed} />
          <SidebarItem icon={Package} label="Ürünler" to="/products" isCollapsed={isCollapsed} />
        </nav>

        <div className="p-4 border-t border-slate-800 text-sm">
          {!isCollapsed && <p className="text-slate-500">© 2026 ErpAI Sys</p>}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Global arama... (Cmd+K)"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4 ml-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-sm cursor-pointer">
              HK
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}