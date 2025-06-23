import { useState, ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  Eye, 
  LayoutDashboard, 
  ClipboardList, 
  MessageSquare, 
  Image, 
  User, 
  LogOut, 
  Menu, 
  X,
  Mail,
  Phone
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <Eye className="h-6 w-6 text-blue-500" />
            <span className="ml-2 font-semibold text-gray-800">Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-20 h-full w-64 bg-white border-r border-gray-200 transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Eye className="h-6 w-6 text-blue-500" />
            <span className="ml-2 font-semibold text-gray-800">Dr. Sávio Admin</span>
          </div>
        </div>
        
        <nav className="mt-6 px-3">
          <ul className="space-y-1">
            <li>
              <Link
                to="/admin"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/admin')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <LayoutDashboard className="h-5 w-5 mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/admin/services"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/admin/services')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <ClipboardList className="h-5 w-5 mr-3" />
                Serviços
              </Link>
            </li>
            <li>
              <Link
                to="/admin/testimonials"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/admin/testimonials')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <MessageSquare className="h-5 w-5 mr-3" />
                Depoimentos
              </Link>
            </li>
            <li>
              <Link
                to="/admin/hero"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/admin/hero')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Image className="h-5 w-5 mr-3" />
                Banner Principal
              </Link>
            </li>
            <li>
              <Link
                to="/admin/about"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/admin/about')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <User className="h-5 w-5 mr-3" />
                Sobre
              </Link>
            </li>
            <li>
              <Link
                to="/admin/contacts"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/admin/contacts')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Mail className="h-5 w-5 mr-3" />
                Contatos
              </Link>
            </li>
            <li>
              <Link
                to="/admin/contact-info"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/admin/contact-info')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Phone className="h-5 w-5 mr-3" />
                Informações de Contato
              </Link>
            </li>
          </ul>
          
          <div className="pt-8 mt-8 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 w-full"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sair
            </button>
          </div>
        </nav>
      </aside>
      
      {/* Content */}
      <div className="lg:pl-64">
        <div className="pt-16 lg:pt-0">
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-10 bg-gray-900 opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;