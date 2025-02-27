import React, { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import './CharacterDetails.css';

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
                    console.log(character.alignment)
                    
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

    const handleSave = async (field, newValue) => {
        try {
            
            const response = await fetch(`http://127.0.0.1:8000/characters/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ [field]: newValue}),
            });

            if (response.ok) {
                setCharacter(prev => ({ ...prev, [field]: newValue }));
            } else {
                console.error("blad podczas zapisywania danych");
            }

        }catch (error) {
            console.error("BLAD:", error);
        }
    }

    const EditableField = ({ field, value, type = 'text', onChange, onSave }) => {
        const [isEditing, setIsEditing] = useState(false);
        const [inputValue, setInputValue] = useState(value);
        
        const handleChange = (e) => {
            setInputValue(e.target.value); // Aktualizuje wartość lokalnie
        };

        const handleBlur = () => {
            setIsEditing(false);
            if (inputValue !== value) {
                onSave(field, inputValue);
            }
                
        };
    
        const handleKeyDown = (e) => {
            if (e.key === "Enter") {
                handleBlur();
            }
        };
    
        return isEditing ? (
            <input
                type={type}
                value={inputValue}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                autoFocus
                style={{
                    padding: "5px",
                    fontSize: "16px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                }}
            />
        ) : (
            <span
                onClick={() => setIsEditing(true)}
                style={{
                    cursor: "pointer",
                    
                }}
            >
                {value || "Kliknij, aby edytować"}
            </span>
        );
    };

    const calculateModifier = (abilityScore) => {
        if (typeof abilityScore !== "number") return 0;  // Unikamy NaN
        return Math.floor((abilityScore - 10) / 2);
    }

    const calculateSkillValue = (isProficient, abilityModifier, proficiencyBonus) => {
        if (typeof abilityModifier !== "number" || typeof proficiencyBonus !== "number") return 0;
        return isProficient ? abilityModifier + proficiencyBonus : abilityModifier;
    };

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
        <div className="character-sheet">
            {/* Nagłówek */}
            <div className="header">
                <h1>
                <EditableField
                    field="name"
                    value={character.name}
                    onChange={(field, newValue) => setCharacter(prev => ({ ...prev, [field]: newValue }))}
                    onSave={(field, newValue) => handleSave(field, newValue)}
                />
                </h1>

                <p><strong>Klasa:</strong>
                <EditableField
                    field="class_name"
                    value={character.class_name}
                    onChange={(field, newValue) => setCharacter(prev => ({ ...prev, [field]: newValue }))}
                    onSave={(field, newValue) => handleSave(field, newValue)}
                /> | <strong>Poziom:</strong>
                <EditableField
                    field="level"
                    type='number'
                    value={character.level}
                    onChange={(field, newValue) => setCharacter(prev => ({ ...prev, [field]: newValue }))}
                    onSave={(field, newValue) => handleSave(field, newValue)}
                /></p>
                <p><strong>Rasa:</strong>
                <EditableField
                    field="race"
                    value={character.race}
                    onChange={(field, newValue) => setCharacter(prev => ({ ...prev, [field]: newValue }))}
                    onSave={(field, newValue) => handleSave(field, newValue)}
                /> | <strong>Charakter:</strong>
                <EditableField
                    field="alignment"
                    value={character.alignment}
                    onChange={(field, newValue) => setCharacter(prev => ({ ...prev, [field]: newValue }))}
                    onSave={(field, newValue) => handleSave(field, newValue)}
                /></p>
            </div>

            {/* HP & Inspiracja */}
            <div className="hp-section">
                <p><strong>HP:</strong> 
                <EditableField
                    field="hp_current"
                    type='number'
                    value={character.hp_current}
                    onChange={(field, newValue) => setCharacter(prev => ({ ...prev, [field]: newValue }))}
                    onSave={(field, newValue) => handleSave(field, newValue)}
                />(+
                <EditableField
                    field="hp_temp"
                    type='number'
                    value={character.hp_temp}
                    onChange={(field, newValue) => setCharacter(prev => ({ ...prev, [field]: newValue }))}
                    onSave={(field, newValue) => handleSave(field, newValue)}
                />) / 
                <EditableField
                    field="hp_max"
                    type='number'
                    value={character.hp_max}
                    onChange={(field, newValue) => setCharacter(prev => ({ ...prev, [field]: newValue }))}
                    onSave={(field, newValue) => handleSave(field, newValue)}
                /></p>
                <p><strong>AC:</strong> 
                <EditableField
                    field="armor"
                    type='number'
                    value={character.armor}
                    onChange={(field, newValue) => setCharacter(prev => ({ ...prev, [field]: newValue }))}
                    onSave={(field, newValue) => handleSave(field, newValue)}
                /></p>

                <p><strong>Speed:</strong> 
                <EditableField
                    field="speed"
                    type='number'
                    value={character.speed}
                    onChange={(field, newValue) => setCharacter(prev => ({ ...prev, [field]: newValue }))}
                    onSave={(field, newValue) => handleSave(field, newValue)}
                /></p>

                <p><strong>Hit-Dice:</strong> 
                <EditableField
                    field="hit_dice"
                    value={character.hit_dice}
                    onChange={(field, newValue) => setCharacter(prev => ({ ...prev, [field]: newValue }))}
                    onSave={(field, newValue) => handleSave(field, newValue)}
                /></p>
            </div>

            {/* Atrybuty + skille*/}
            <div className='attributes_skills'>
                <div className="attributes">
                    {["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"].map((attr) => (
                        <div key={attr} className="attribute">
                            <h2>{attr.toUpperCase().slice(0, 3)}</h2>
                            <p>{character[attr]}</p>
                            <span>+{calculateModifier(character[attr])}</span>
                        </div>
                    ))}
                </div>
                
                {/* Skille */}
                <div className="skills">
                    {character.skills ? (
                        <table>
                        <tbody>
                        
                            {Object.entries(character.skills).map(([skill, isProficient]) => {
                                const abilityScore = skillModifiers[skill] ?? 10; // Domyślnie 10
                                const abilityModifier = calculateModifier(abilityScore);
                                const proficiencyBonus = character?.proficiency_bonus ?? 2; // Domyślnie 2
                                const skillValue = calculateSkillValue(isProficient, abilityModifier, proficiencyBonus);

                                return (
                                    <tr key={skill}>
                                        <td>{skill.charAt(0).toUpperCase() + skill.slice(1).replace('_', ' ')}</td>
                                        <td>{skillValue}</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                            </table>
                        ) : (
                            <tr>
                                <td colSpan="2">Brak danych o skillach</td>
                            </tr>
                        )}
                    
                </div>

                <div className='traits-container'>
                {/* Traits & features */}
                    <div className="info-box">
                            <h2>Cechy</h2>
                            {character.traits && character.traits.length > 0 ? (
                                <ul>
                                    {character.traits.map((trait, index) => (
                                        <li key={index}>
                                            <strong>{trait.name}</strong> - {trait.description}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Brak cech</p>
                            )}

                            {character.features && character.features.length > 0 ? (
                                <ul>
                                    {character.features.map((feature, index) => (
                                        <li key={index}>
                                            <strong>{feature.name}</strong> - {feature.description}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Brak features</p>
                            )}
                        </div>
                        {/* Bieglosci */}
                        <div className="info-box">
                            <h2>Inne biegłości</h2>
                            {character.proficiencies && character.proficiencies.length > 0 ? (
                                <ul>
                                    {character.proficiencies.map((proficiency, index) => (
                                        <li key={index}>
                                            <strong>{proficiency.name}</strong> - {proficiency.description}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Brak biegłości</p>
                            )}
                        </div>

                        {/* Languages */}
                        <div className="info-box">
                            <h2>Języki</h2>
                            {character.languages && character.languages.length > 0 ? (
                                <ul>
                                    {character.languages.map((language, index) => (
                                        <li key={index}>
                                            <strong>{language.name}</strong> - {language.description}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Brak biegłości</p>
                            )}
                        </div>
                        {/* Ekwipunek */}
                        <div className="info-box">
                            <h2>Ekwipunek</h2>
                            {character.equipment && character.equipment.length > 0 ? (
                                <ul>
                                    {character.equipment.map((item, index) => (
                                        <li key={index}>
                                            <strong>{item.name}</strong> - {item.description} (x{item.quantity})
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Brak przedmiotów</p>
                            )}
                        </div>
            </div>
            </div>

            
            
            
        </div>
        
    )
}

export default CharacterDetails;