import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css"; // Stylizacja
import { toast } from "react-toastify";

const Login = () => {
    const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
    const [error, setError] = useState("");
    const navigate = useNavigate();

    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://127.0.0.1:8000/login", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({username : email, password}),
            });

            const data = await response.json();
            if (response.ok) {
                
                localStorage.setItem("token", data.access_token);
                toast.success('Zalogowano pomyslnie!');
                navigate("/characters"); // Przekierowanie po zalogowaniu
            } else {
                setError("Niepoprawne dane logowania!");
            }
        } catch (error) {
            setError("Błąd serwera, spróbuj ponownie.");
        }
    };

    return (
        <div className="auth-container">
            
            <h2>Logowanie</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={((e) => setEmail(e.target.value))}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Hasło"
                    value={password}
                    onChange={((e) => setPassword(e.target.value))}
                    required
                />
                <button onClick={handleSubmit}>Zaloguj</button>
            </form>
            <p>Zapomniałeś hasła? <a href="/reset-password">Zresetuj je tutaj</a></p>
            <p>Nie masz konta? <a href="/register">Zarejestruj się</a></p>
        </div>
    );
};

export default Login;
