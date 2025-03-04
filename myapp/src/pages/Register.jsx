import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css"; // Stylizacja
import { toast } from "react-toastify";

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const validatePassword = (password => {
        const minLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*]/.test(password);
        return minLength && hasUpperCase && hasNumber && hasSpecialChar;
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Hasła sie nie zgadzają!")
            return;
        }

        if (!validatePassword(password)) {
            setError("Hasło musi mieć:");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({email, password}),
            });

            if (response.ok) {
                toast.success('Zarejestrowane pomyslnie!');
                navigate("/login"); // Przekierowanie po rejestracji
            } else {
                setError("Błąd rejestracji. Spróbuj ponownie.");
            }
        } catch (error) {
            setError("Błąd serwera, spróbuj ponownie.");
        }
    };

    return (
        <div className="auth-container">
            <h2>Rejestracja</h2>
            {error && <p className="error">{error}</p>}
            <form>
                
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
                <input
                    type="password"
                    name="confirmpassword"
                    placeholder="Powtórz hasło"
                    value={confirmPassword}
                    onChange={((e) => setConfirmPassword(e.target.value))}
                    required
                />
                <button onClick={handleSubmit}>Zarejestruj się</button>
            </form>
            <p>Zapomniałeś hasła? <a href="/reset-password">Zresetuj je tutaj</a></p>
        </div>
    );
};

export default Register;
