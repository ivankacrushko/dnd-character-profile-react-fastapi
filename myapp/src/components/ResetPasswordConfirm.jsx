import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Auth.css"; // Stylizacja
import { toast } from "react-toastify";

const ResetPasswordConfirm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleReset = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            const response = await fetch("http://127.0.0.1:8000/reset-password/confirm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, new_password: newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Hasło zostało zresetowane!")
                setTimeout(() => navigate("/login"), 2000);
            } else {
                toast.error(data.detail || "Wystąpił błąd.");
            }
        } catch (error) {
            toast.error("Błąd serwera. Spróbuj ponownie.");
        }
    };

    return (
        <div className="auth-container">
            <h2>Resetowanie hasła</h2>
            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}

            {token ? (
                <form onSubmit={handleReset}>
                    <input
                        type="password"
                        placeholder="Nowe hasło"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Zmień hasło</button>
                </form>
            ) : (
                <p>Nieprawidłowy lub wygasły token.</p>
            )}
        </div>
    );
};

export default ResetPasswordConfirm;
