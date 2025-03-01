import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./CharacterList.css";

const CharacterList = () => {
    const [characters, setCharacters] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/characters", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setCharacters(data);
                } else {
                    console.error("Błąd podczas pobierania postaci");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchCharacters();
    }, [token]);

    return (
        <div className="character-list-container">
            <h2>Twoje Postacie</h2>
            {characters.length === 0 ? (
                <p>Nie masz jeszcze żadnych postaci.</p>
            ) : (
                <div className="character-grid">
                    <TransitionGroup>
                        {characters.map((char) => (
                            <CSSTransition key={char.id} timeout={300} classNames="fade">
                                <div className="character-card">
                                    <h3>{char.name}</h3>
                                    <p><strong>Klasa:</strong> {char.class_name}</p>
                                    <p><strong>Poziom:</strong> {char.level}</p>
                                    <button onClick={() => navigate(`/characters/${char.id}`)}>Szczegóły</button>
                                </div>
                            </CSSTransition>
                        ))}
                    </TransitionGroup>
                </div>
            )}
        </div>
    );
};

export default CharacterList;
