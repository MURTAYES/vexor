import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useAuthStore from './store/authStore';
import Layout from './components/Layout';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import InventoryList from './views/InventoryList';
import AddProduct from './views/AddProduct';
import Checkout from './views/Checkout';
import InvoiceList from './views/InvoiceList';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/inventory" element={<InventoryList />} />
                    <Route path="/inventory/new" element={<AddProduct />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/invoices" element={<InvoiceList />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
