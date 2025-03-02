import { useState } from "react";
import { motion } from "framer-motion";

const DiceRoller = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [rolling, setRolling] = useState(false);
    const [result, setResult] = useState(null);
    const [selectedDice, setSelectedDice] = useState("1d20");

    const diceOptions = ["1d4", "1d6", "1d8", "1d10", "1d20"];

    // Funkcja do rzutu kością
    const rollDice = () => {
        const sides = parseInt(selectedDice.substring(2));
        setRolling(true);

        setTimeout(() => {
            setResult(Math.floor(Math.random() * sides) + 1);
            setRolling(false);
        }, 1500); // Symulacja toczenia kości
    };

    return (
        <>
            {/* Floating Button */}
            <button
                className="fixed bottom-20 right-5 bg-red-500 text-white p-4 rounded-full shadow-lg hover:bg-red-600 transition"
                onClick={() => setIsOpen(true)}
            >
                🎲
            </button>

            {/* Boczne okno */}
            {isOpen && (
                <div className="fixed top-0 right-0 w-full md:w-1/3 h-full bg-gray-900 bg-opacity-90 text-white p-6 transition-transform transform translate-x-0">
                    {/* Zamknięcie panelu */}
                    <button className="absolute top-4 right-4 text-2xl" onClick={() => setIsOpen(false)}>✖</button>

                    <h2 className="text-2xl font-bold mb-4">Rzuć kością</h2>

                    {/* Wybór kości */}
                    <div className="flex gap-2 mb-4">
                        {diceOptions.map((dice) => (
                            <button
                                key={dice}
                                className={`p-2 border rounded ${selectedDice === dice ? "bg-red-500" : "bg-gray-700"}`}
                                onClick={() => setSelectedDice(dice)}
                            >
                                {dice}
                            </button>
                        ))}
                    </div>

                    {/* Animacja toczenia kości */}
                    <div className="h-32 flex items-center justify-center">
                        {rolling ? (
                            <motion.div
                                className="text-6xl"
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 0.5 }}
                            >
                                🎲
                            </motion.div>
                        ) : result !== null ? (
                            <p className="text-4xl font-bold">{result}</p>
                        ) : (
                            <p className="text-lg">Wybierz kość i rzuć!</p>
                        )}
                    </div>

                    {/* Przycisk rzutu */}
                    <button
                        className="w-full bg-red-500 py-2 text-lg font-bold mt-4 rounded hover:bg-red-600 transition"
                        onClick={rollDice}
                    >
                        Rzuć!
                    </button>
                </div>
            )}
        </>
    );
};

export default DiceRoller;
