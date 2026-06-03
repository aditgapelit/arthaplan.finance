import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import MouseGlow from './components/MouseGlow';

function AppLayout({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Determine if we should show the sidebar
  const publicRoutes = ['/', '/login', '/register'];
  const isPublicRoute = publicRoutes.includes(location.pathname);
  const shouldShowSidebar = user && !isPublicRoute;

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      position: 'relative',
      overflow: 'hidden',
      zIndex: 0
    }}>
      {/* Global MouseGlow - rendered once, behind everything */}
      <MouseGlow />
      
      {/* Floating Toggle Button when sidebar is closed */}
      <AnimatePresence>
        {shouldShowSidebar && !isSidebarOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsSidebarOpen(true)}
            style={{
              position: 'fixed',
              top: '24px',
              left: '24px',
              zIndex: 50,
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '50%',
              padding: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            whileHover={{ 
              scale: 1.1,
              borderColor: 'rgba(16, 185, 129, 0.6)',
              boxShadow: '0 8px 16px -1px rgba(5, 150, 105, 0.2)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu size={20} strokeWidth={1.5} color="#059669" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Collapsible Sidebar */}
      {shouldShowSidebar && (
        <motion.aside
          initial={false}
          animate={{ 
            width: isSidebarOpen ? 260 : 0,
            x: isSidebarOpen ? 0 : -300,
            opacity: isSidebarOpen ? 1 : 0
          }}
          transition={{ 
            type: "spring", 
            stiffness: 250, 
            damping: 25 
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            zIndex: 40,
            overflow: 'hidden'
          }}
        >
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </motion.aside>
      )}

      {/* Main Content Area - Full Width Stretch */}
      <main
        style={{
          flex: 1,
          marginLeft: shouldShowSidebar && isSidebarOpen ? '260px' : '0',
          backgroundColor: '#f8fafc',
          transition: 'margin-left 0.3s ease',
          width: '100%',
          maxWidth: '100%',
          minHeight: '100vh',
          position: 'relative',
          zIndex: 10
        }}
      >
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
