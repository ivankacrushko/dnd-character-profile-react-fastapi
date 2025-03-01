import React, { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import './CharacterDetails.css';
import { FaPencilAlt, FaTrash, FaPlus} from 'react-icons/fa';

const CharacterDetails = () => {
    const [character, setCharacter] = useState([]);

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

    const EditableSection = ({ title, items, fieldName, onSave }) => {
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [localItems, setLocalItems] = useState(items || []);
    
        const handleEdit = (index, field, value) => {
            const updatedItems = [...localItems];
            updatedItems[index] = { ...updatedItems[index], [field]: value };
            setLocalItems(updatedItems);
        };
    
        const handleAdd = () => {
            setLocalItems([...localItems, { name: "", description: "", quantity: 1 }]);
        };
    
        const handleDelete = (index) => {
            handleEdit(index, 'quantity', 0);
        };
    
        const handleSave = async () => {
            await onSave(fieldName, localItems);
            setIsModalOpen(false);
        };
    
        return (
            <div className="section">
                <div className="section-header">
                    <h3>{title}</h3>
                    <FaPencilAlt className="edit-icon" onClick={() => setIsModalOpen(true)} />
                </div>
    
                <ul>
                    {localItems.map((item, index) => (
                        <li key={index}>
                            <strong>{item.name}</strong> - {item.description} (x{item.quantity})
                        </li>
                    ))}
                </ul>
    
                {/* Modal */}
                {isModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h2>Edytuj {title}</h2>
                            {localItems.map((item, index) => (
                                <div key={index} className="edit-item">
                                    <input
                                        type="text"
                                        placeholder="Nazwa"
                                        value={item.name}
                                        onChange={(e) => handleEdit(index, "name", e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Opis"
                                        value={item.description}
                                        onChange={(e) => handleEdit(index, "description", e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Ilość"
                                        value={item.quantity}
                                        min="1"
                                        onChange={(e) => handleEdit(index, "quantity", Number(e.target.value))}
                                    />
                                    <FaTrash className="delete-icon" onClick={() => handleDelete(index)} />
                                </div>
                            ))}
                            <button onClick={handleAdd}><FaPlus /> Dodaj</button>
                            <div className="modal-buttons">
                                <button onClick={() => setIsModalOpen(false)}>Anuluj</button>
                                <button onClick={handleSave}>Zapisz</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const handleSkillChange = async (skill, newValue) => {
        setCharacter((prevCharacter) => ({
            ...prevCharacter,
            skills: {
                ...prevCharacter.skills,
                [skill]: newValue,
            }
        }));
    
        try {
            const response = await fetch(`http://127.0.0.1:8000/characters/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    skills: {
                        ...character.skills,
                        [skill]: newValue
                    }
                }),
            });
    
            if (!response.ok) {
                console.error("Błąd podczas zapisywania skilla");
            }
        } catch (error) {
            console.error("Błąd:", error);
        }
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
    };

    const handleDeathSaveChange = async (type, index) => {
        let newValue = character[type];
    
        if (index + 1 > newValue) {
            newValue = index + 1; // Inkrementacja
        } else {
            newValue = index; // Dekrementacja
        }

        handleSave(type, newValue);
    };


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
        <div className="death-saves">
        <h3>Rzuty ocalające</h3>
        
        <div className="death-save-section">
            <span>Saves:</span>
            {[0, 1, 2].map((i) => (
                <input
                    key={`success-${i}`}
                    type="checkbox"
                    checked={character.death_saves_success > i}
                    onChange={(e) => handleDeathSaveChange("death_saves_success", i)}
                />
            ))}
        </div>

        <div className="death-save-section">
            <span>Fails:</span>
            {[0, 1, 2].map((i) => (
                <input
                    key={`fail-${i}`}
                    type="checkbox"
                    checked={character.death_saves_failure > i}
                    onChange={(e) => handleDeathSaveChange("death_saves_failure", i)}
                />
            ))}
        </div>
        </div>
            </div>

            {/* Atrybuty + skille*/}
            <div className='attributes_skills'>
                <div className="attributes">
                    {["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"].map((attr) => (
                        
                        <div key={attr} className="attribute">
                            <h2>{attr.toUpperCase().slice(0, 3)}</h2>
                            <p><EditableField
                                field={attr}
                                type='number'
                                value={character[attr]}
                                onChange={(field, newValue) => setCharacter(prev => ({ ...prev, [field]: newValue }))}
                                onSave={(field, newValue) => handleSave(field, newValue)}
                            /></p>
                            <span>+{calculateModifier(character[attr])}</span>
                        </div>
                    ))}
                </div>
            <div className='skills-attacks'>  
                {/* Skille */}
                <div className="skills">
                <h2>Umiejętności</h2>
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
                                            <td><input
                                                    type="checkbox"
                                                    checked={isProficient}
                                                    onChange={(e) => handleSkillChange(skill, e.target.checked)}
                                            /></td>
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
                    <div className="attacks">
                            <h2>Ataki</h2>
                            <table>
                            
                            {character.attacks && character.attacks.length > 0 ? (
                                <tbody>
                                    <tr>
                                            <th>Nazwa</th>
                                            <th>Bonus</th>
                                            <th>DMG</th>
                                        </tr>
                                    {character.attacks.map((attack, index) => (
                                        <tr key={attack}>
                                            <td>{attack.name}</td>
                                            <td>+{attack.attack_bonus}</td>
                                            <td>{attack.damage}</td>
                                        </tr>
                                    ))}
                                
                                </tbody>
                            ) : (
                                <p>Brak przedmiotów</p>
                            )}
                            </table>
                        </div>
                </div>  

                <div className='traits-container'>
                {/* Traits & features */}
                    <h2>Cechy</h2>
                    <div className="info-box">
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
                        <h2>Inne biegłości</h2>
                        <div className="info-box">
                            
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
                        <h2>Języki</h2>
                        <div className="info-box">
                            
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
                        <EditableSection
                            title="Equipment"
                            items={character.equipment}
                            fieldName="equipment"
                            onSave={handleSave}
                        />
            </div>
            </div>

            
            
            
            
            
        </div>
        
    )
}

export default CharacterDetails;