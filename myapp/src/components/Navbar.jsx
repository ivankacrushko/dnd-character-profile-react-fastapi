import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="logo">🛡️ D&D App</Link>
                <ul className="nav-links">
                    <li><Link to="/">Strona Główna</Link></li>
                    {token ? (
                        <>
                            <li><Link to="/characters">Twoje Postacie</Link></li>
                            <li><button onClick={handleLogout} className="logout-btn">Wyloguj</button></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/login">Zaloguj</Link></li>
                            <li><Link to="/register">Zarejestruj</Link></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
