import { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

const CharacterDetails = () => {
    const [character, setCharacter] = useState([]);
    const [editingFields, setEditingFields] = useState({})

    const {id} = useParams();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                
                const response = await fetch(`http://127.0.0.1:8000/characters/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data)
                    setCharacter(data)
                    
                } else {
                    console.error('Error with loading character')
                }
            } catch(error) {
                console.error('error:', error)
            }
        };

        fetchDetails();
    }, [id, token]);

    if (!character) {
        return <p>Ładowanie danych postaci....</p>;
    }

    const handleChange = (field, value) => {
        setCharacter((prevCharacter) => ({
            ...prevCharacter,
            [field]: value
        }));
    };

    const handleEdit = (field) => {
        setEditingFields((prev) => ({
            ...prev,
            [field]: true
        }));
    };

    const handleSave = async (field) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/characters/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ [field]: character[field]}),
            });

            if (response.ok) {
                setEditingFields((prev) => ({
                    ...prev,
                    [field]: false
                }));
            } else {
                console.error("blad podczas zapisywania danych");
            }

        }catch (error) {
            console.error("BLAD:", error);
        }
    }

    const calculateModifier = (abilityScore) => {
        if (typeof abilityScore !== "number") return 0;  // Unikamy NaN
        return Math.floor((abilityScore - 10) / 2);
    }

    const calculateSkillValue = (isProficient, abilityModifier, proficiencyBonus) => {
        if (typeof abilityModifier !== "number" || typeof proficiencyBonus !== "number") return 0;
        return isProficient ? abilityModifier + proficiencyBonus : abilityModifier;
    };

    const proficiencyBonus = character.proficiency_bonus;

    const skillModifiers = {
        acrobatics: character.dexterity,
        animal_handling: character.wisdom,
        arcana: character.intelligence,
        athletics: character.strength,
        deception: character.charisma,
        history: character.intelligence,
        insight: character.wisdom,
        intimidation: character.charisma,
        investigation: character.intelligence,
        medicine: character.wisdom,
        nature: character.intelligence,
        perception: character.wisdom,
        performance: character.charisma,
        persuasion: character.charisma,
        religion: character.intelligence,
        sleight_of_hand: character.dexterity,
        stealth: character.dexterity,
        survival: character.wisdom,
    }

    return (
        <div>
            <h2>Szczegoly postaci</h2>
            <p>
                <strong>Imię:</strong>
                {editingFields.name ? (
                    <input 
                        type="text" 
                        value={character.name} 
                        onChange={(e) => handleChange("name", e.target.value)} 
                    />
                ) : (
                    character.name
                )}
                <button onClick={() => editingFields.name ? handleSave("name") : handleEdit("name")}>
                    {editingFields.name ? "Zapisz" : "Edytuj"}
                </button>
            </p>
            <p>
                <strong>Klasa:</strong>
                {editingFields.class_name ? (
                    <input 
                        type="text" 
                        value={character.class_name} 
                        onChange={(e) => handleChange("class_name", e.target.value)} 
                    />
                ) : (
                    character.class_name
                )}
                <button onClick={() => editingFields.class_name ? handleSave("class_name") : handleEdit("class_name")}>
                    {editingFields.class_name ? "Zapisz" : "Edytuj"}
                </button>
            </p>
            <p>
                <strong>Rasa:</strong>
                {editingFields.race ? (
                    <input 
                        type="text" 
                        value={character.race} 
                        onChange={(e) => handleChange("race", e.target.value)} 
                    />
                ) : (
                    character.race
                )}
                <button onClick={() => editingFields.race ? handleSave("race") : handleEdit("race")}>
                    {editingFields.race ? "Zapisz" : "Edytuj"}
                </button>
            </p>
            <p>
                <strong>Poziom:</strong>
                {editingFields.level ? (
                    <input 
                        type="text" 
                        value={character.level} 
                        onChange={(e) => handleChange("level", e.target.value)} 
                    />
                ) : (
                    character.level
                )}
                <button onClick={() => editingFields.level ? handleSave("level") : handleEdit("level")}>
                    {editingFields.level ? "Zapisz" : "Edytuj"}
                </button>
            </p>
            
            <h3>Skille</h3>
            <table>
                <thead>
                    <tr>
                        <th>Skill</th>
                        <th>Wartość</th>
                    </tr>
                </thead>
                <tbody>
                    {character.skills ? (
                        Object.entries(character.skills).map(([skill, isProficient]) => {
                            const abilityScore = skillModifiers[skill] ?? 10; // Domyślnie 10
                            const abilityModifier = calculateModifier(abilityScore);
                            const proficiencyBonus = character?.proficiency_bonus ?? 2; // Domyślnie 2
                            const skillValue = calculateSkillValue(isProficient, abilityModifier, proficiencyBonus);

                            return (
                                <tr key={skill}>
                                    <td>{skill.replace('_', ' ')}</td>
                                    <td>{skillValue}</td>
                                    <td><li key={skill}>{skill}: {isProficient ? "•" : ""}</li></td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="2">Brak danych o skillach</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <h3>Cechy:</h3>
            <ul>
                {character.traits && character.traits.length > 0 ? (
                    character.traits.map((trait, index) => (
                        <li key={index}><b>{trait.name}:</b> {trait.description}</li>
                    ))
                ) : (
                    <p>Brak cech</p>
                )}
            </ul>

            <h3>Ataki:</h3>
            <ul>
                {character.attacks && character.attacks.length > 0 ? (
                    character.attacks.map((attack, index) => (
                        <li key={index}><b>{attack.name}:</b> {attack.damage} obrażeń</li>
                    ))
                ) : (
                    <p>Brak ataków</p>
                )}
            </ul>

            <h3>Języki:</h3>
            <ul>
                {character.languages && character.languages.length > 0 ? (
                    character.languages.map((language, index) => (
                        <li key={index}><b>{language.name}:</b> {language.description}</li>
                    ))
                ) : (
                    <p>Brak cech</p>
                )}
            </ul>

            <h3>Ekwipunek:</h3>
            <ul>
                {character.equipment && character.equipment.length > 0 ? (
                    character.equipment.map((item, index) => (
                        <li key={index}><b>{item.quantity}x {item.name}:</b> {item.description}</li>
                    ))
                ) : (
                    <p>Brak cech</p>
                )}
            </ul>

            <h3>Biegłości:</h3>
            <ul>
                {character.proficiencies && character.proficiencies.length > 0 ? (
                    character.proficiencies.map((proficiency, index) => (
                        <li key={index}><b>{proficiency.name}:</b> {proficiency.description}</li>
                    ))
                ) : (
                    <p>Brak cech</p>
                )}
            </ul>
        </div>
        
    )
}

export default CharacterDetails;