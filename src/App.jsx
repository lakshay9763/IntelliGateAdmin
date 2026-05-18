import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./app/store";

// Your Pages
import AdminDashboard from "../AdminDashboard";
// import Login from "./pages/Login"; // Ensure you have this path correct
import { setAuth, setAuthLoading } from "./features/auth/auth.slice"; // Import Redux actions
import adminApi from "./api/adminApi";
import Login from "./pages/auth/Login";

// ─── THE GATEKEEPER COMPONENT ─────────────────────────────────────────────
// This component checks if the user is authenticated. If not, it redirects to Login.
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  // Don't redirect while we are still asking the backend if the cookie is valid
 if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        width: '100vw', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#F8F9FD', // Matches your login background
        fontFamily: 'DM Sans, sans-serif'
      }}>
        
        {/* Injecting CSS Keyframes for Animations */}
        <style>
          {`
            @keyframes pulse-ring {
              0% { transform: scale(0.7); opacity: 0.8; }
              100% { transform: scale(1.8); opacity: 0; }
            }
            @keyframes float {
              0% { transform: translateY(0px); }
              50% { transform: translateY(-8px); }
              100% { transform: translateY(0px); }
            }
            @keyframes fade-text {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
          `}
        </style>

        {/* Animated Icon Container */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
          
          {/* Pulsing Purple Radar Ring */}
          <div style={{
            position: 'absolute',
            width: '70px',
            height: '70px',
            backgroundColor: '#7C6AF5', // Your theme purple
            borderRadius: '50%',
            animation: 'pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite'
          }} />

          {/* Floating Shield */}
          <div style={{
            fontSize: '52px',
            animation: 'float 3s ease-in-out infinite',
            position: 'relative',
            zIndex: 2,
            filter: 'drop-shadow(0px 10px 15px rgba(124, 106, 245, 0.3))' // Subtle purple glow
          }}>
            🛡️
          </div>
        </div>

        {/* Branding */}
        <h2 style={{ margin: 0, color: '#111', fontSize: '24px', fontWeight: '900', letterSpacing: '0.5px' }}>
          IntelliGate
        </h2>
        
        {/* Fading Status Text */}
        <p style={{ 
          color: '#888', 
          fontSize: '13px', 
          fontWeight: '700', 
          marginTop: '8px', 
          letterSpacing: '0.5px',
          animation: 'fade-text 2s ease-in-out infinite' 
        }}>
          Authenticating session...
        </p>

      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ─── THE MAIN APP LOGIC ───────────────────────────────────────────────────
const AppContent = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // 1. Check Session on Initial Load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Ping the backend. Axios will automatically attach the httpOnly cookie.
        // const response = await 
        const [response] = await Promise.all([adminApi.get('/me'), new Promise(resolve => setTimeout(resolve,1500))])
        
        console.log(response,'hell');
        dispatch(setAuth(response.data.admin)); 
      } catch (error) {
        // If the cookie is missing/expired, clear Redux (Unauthorized)
        dispatch(setAuth(null)); 

      }
    };

    checkAuthStatus();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        
        {/* PUBLIC ROUTE: Login Page */}
        <Route 
          path="/login" 
          element={
            // If they are already logged in, push them straight to the dashboard
            isAuthenticated ? <Navigate to="/" replace /> : <Login />
          } 
        />

        {/* PROTECTED ROUTE: Dashboard */}
        <Route 
          path="/*" // The /* allows AdminDashboard to handle its own nested routing
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

      </Routes>
    </BrowserRouter>
  );
};

// ─── ROOT COMPONENT ───────────────────────────────────────────────────────
// We must wrap AppContent in the Provider so that it can use the Redux 'useDispatch' hook inside the useEffect.
const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;