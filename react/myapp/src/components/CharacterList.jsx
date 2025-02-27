import { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const CharacterList = () => {
    const [characters, setCharacters] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/characters', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setCharacters(data)
                } else {
                    console.error('Blad podczas pobierania postaci');
                }
            } catch (error) {
                console.error('error:' ,error);
            }
        };

        fetchCharacters();
    }, [token]);

    return (
        <div className="container">
            <h2>Twoje postacie</h2>
            {characters.length === 0 ? (
                <p>Nie masz jeszcze żadnych postaci.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Imię</th>
                            <th>Klasa</th>
                            <th>Poziom</th>
                            <th>Akcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {characters.map((char) => (
                            <tr key={char.id}>
                                <td>{char.name}</td>
                                <td>{char.class_name}</td>
                                <td>{char.level}</td>
                                <td>
                                    <button onClick={() => navigate(`/characters/${char.id}`)}>Szczegóły</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default CharacterList