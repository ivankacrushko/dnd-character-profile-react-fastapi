import { useState } from "react";
import "./Auth.css"; // Stylizacja
import { toast } from "react-toastify";

const ResetPasswordRequest = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleRequest = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            const response = await fetch("http://127.0.0.1:8000/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("E-mail z linkiem do resetu został wysłany.");
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

            <form onSubmit={handleRequest}>
                <input
                    type="email"
                    placeholder="Podaj e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Wyślij link do resetu</button>
            </form>
        </div>
    );
};

export default ResetPasswordRequest;
