import { useState } from "react";
import "./DiceRoller.css";

const DiceRoller = ({ isOpen, onClose }) => {
    const [selectedDice, setSelectedDice] = useState(6); // Domyślnie d6
    const [diceValue, setDiceValue] = useState(1);
    const [rolling, setRolling] = useState(false);

    // Dostępne kości
    const diceTypes = [4, 6, 8, 10, 20];

   

    const rollDice = () => {
        if (rolling) return; // Zapobiega spamowi kliknięć
        setRolling(true);
        const newDiceValue = Math.floor(Math.random() * selectedDice) + 1;

        setTimeout(() => {
            setDiceValue(newDiceValue);
            setRolling(false);
        }, 1000);
    };

    return (
        <div className={`dice-panel ${isOpen ? "open" : ""}`}>
            <div className="dice-content">
                <button className="close-btn" onClick={onClose}>×</button>
                <h2>Rzut kością</h2>

                {/* Wybór kości */}
                <div className="dice-select">
                    {diceTypes.map((type) => (
                        <button
                            key={type}
                            className={`dice-button ${selectedDice === type ? "active" : ""}`}
                            onClick={() => setSelectedDice(type)}
                        >
                            d{type}
                        </button>
                    ))}
                </div>

                <h2>Wynik: {diceValue}</h2>
                <button onClick={rollDice} className="roll-btn" disabled={rolling}>
                    {rolling ? "Toczenie..." : "Rzuć"}
                </button>
            </div>
        </div>
    );
};

export default DiceRoller;
