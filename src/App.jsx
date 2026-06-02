import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import Sidebar from './components/Sidebar';

function AppLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      {/* PENTING: Tambahkan marginLeft: '250px' 
        karena Sidebar sekarang posisinya fixed (melayang).
        Nilai 250px harus sama dengan lebar sidebar di CSS Anda.
      */}
      <main style={{ 
        flex: 1, 
        marginLeft: '250px', 
        backgroundColor: '#f9fafb', 
        padding: '20px' 
      }}>
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