import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import { Navigate } from 'react-router-dom';
import CreateCharacter from './pages/CreateCharacter';
import CharacterList from './pages/CharacterList';
import CharacterDetails from './pages/CharacterDetails';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPasswordRequest from "./pages/ResetPasswordRequest";
import ResetPasswordConfirm from "./pages/ResetPasswordConfirm";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to='/login' replace />;
  }

  return children;
}

function Dashboard() {
  return (
    <div>
      <h1>Welcome in dnd app!</h1>
      <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/login';}} >
        Log out
      </button>

      <button onClick={() => { window.location.href = '/create-character';}} >
        Utworz postac
      </button>
      <button onClick={() => { window.location.href = '/characters';}} >
        Lista postaci
      </button>
    </div>
  );
}



function App() {
  return (
    <Router>
      <Navbar />
      <ToastContainer position="bottom-right" autoClose={3000} />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="/reset-password" element={<ResetPasswordRequest />} />
        <Route path="/reset-password/confirm" element={<ResetPasswordConfirm />} />
        <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute> } />
        <Route path='/create-character' element={<ProtectedRoute><CreateCharacter /></ProtectedRoute>} />
        <Route path='/characters' element={<ProtectedRoute><CharacterList /></ProtectedRoute>} />
        <Route path='/characters/:id' element={<ProtectedRoute><CharacterDetails /></ProtectedRoute>} />
        <Route path='/' element={<Login />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
