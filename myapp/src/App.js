import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import { Navigate } from 'react-router-dom';
import CreateCharacter from './pages/CreateCharacter';
import CharacterList from './components/CharacterList';
import CharacterDetails from './components/CharacterDetails';
import Navbar from "./components/Navbar";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to='/login' replace />;
  }

  return children;
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await fetch('http://127.0.0.1:8000/login', {
      method: "POST",
      headers: {'Content-Type' : 'application/x-www-form-urlencoded'},
      body: new URLSearchParams({username : email, password}),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.access_token);
      alert('Logged in!');
      navigate('/dashboard');
    } else {
      alert('Wrong logging params');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input type='email' placeholder='Email' onChange={((e) => setEmail(e.target.value))} />
      <br />
      <input type='password' placeholder='Password' onChange={((e) => setPassword(e.target.value))} />
      <br />
      <button onClick={handleLogin}>Log in</button>
      <p>
        Don't you have an account? Create one <Link to='/register'>here</Link>
      </p>

    </div>
  );
}

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    const response = await fetch('http://127.0.0.1:8000/register', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, password}),
    });
    console.log(JSON.stringify({ email, password }));

    if (response.ok) {
      alert('Registered successfully! You can login now.');
      navigate('/login');
    } else {
      alert('Whoops, something went wrong.')
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <input type='email' placeholder='Email' onChange={((e) => setEmail(e.target.value))} />
      <br />
      <input type='password' placeholder='Password' onChange={((e) => setPassword(e.target.value))} />
      <br />
      <button onClick={handleRegister}>Register</button>
      <p>
        You do have an account? Log in <Link to='/login'>here</Link>
      </p>

    </div>
  );
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
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute> } />
        <Route path='/create-character' element={<ProtectedRoute><CreateCharacter /></ProtectedRoute>} />
        <Route path='/characters' element={<ProtectedRoute><CharacterList /></ProtectedRoute>} />
        <Route path='/characters/:id' element={<ProtectedRoute><CharacterDetails /></ProtectedRoute>} />
        <Route path='/' element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
