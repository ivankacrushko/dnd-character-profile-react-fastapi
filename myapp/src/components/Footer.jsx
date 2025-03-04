import React from "react";
import "./Footer.css"; // Plik ze stylami (stwórz jeśli go nie masz)

const Footer = () => {
    return (
        <footer className="footer">
            <p>© {new Date().getFullYear()} Application to follow your campaigns and characters. Made by <a href='https://github.com/ivankacrushko'>https://github.com/ivankacrushko</a>.</p>

        </footer>
    );
};

export default Footer;
