import React, { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import './CharacterDetails.css';
import { FaPencilAlt, FaTrash, FaPlus} from 'react-icons/fa';
import NotesModal from './NotesModal';
import DiceRoller from "./DiceRoller";
import { toast } from "react-toastify";


const CharacterDetails = () => {
    const [character, setCharacter] = useState([]);

    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const [notes, setNotes] = useState(character.notes || '');
    const [isDiceRollerOpen, setIsDiceRollerOpen] = useState(false);

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

    const handleSave = async (field, newValue) => {
        try {
            const bodyData = JSON.stringify({ [field]: newValue });
            
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
    };

    

    
    

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

    const EditableSection = ({ title, fieldName, items = [], onSave }) => {
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [localItems, setLocalItems] = useState(items || []);
    
        const isEquipmentField = fieldName === "equipment";
        const isAttackSection = fieldName === "attacks";
    
        // Aktualizuje wartość konkretnego pola
        const handleEdit = (index, field, value) => {
            const updatedItems = [...localItems];
            updatedItems[index] = { ...updatedItems[index], [field]: value };
            setLocalItems(updatedItems);
        };
    
        // Dodaje nowy pusty element
        const handleAdd = () => {
            if (isEquipmentField) {
                setLocalItems([...localItems, { name: "", description: "", quantity: 1 }]);
            } else if (isAttackSection) {
                setLocalItems([...localItems, { name: "", attackBonus: 0, damage: "" }]);
            } else {
                setLocalItems([...localItems, { name: "", description: "" }]);
            }
        };
    
        // Usuwa element (ustawia ilość na 0 w przypadku ekwipunku)
        
        
    
        // Zapisuje zmiany
        const handleSave = async () => {
            

            await onSave(fieldName, localItems);
            setIsModalOpen(false);
        };

        const handleDelete = async (itemId, index) => {
            try {
                const url = `http://127.0.0.1:8000/characters/${character.id}/${fieldName}/${itemId}`;
                
        
                const response = await fetch(url, { method: "DELETE" });
        
                if (!response.ok) {
                    toast.error('Najpierw zapisz');
                    const errorText = await response.text();
                    throw new Error(`Failed to delete item: ${errorText}`);
                }
        
                
                setLocalItems(localItems.filter((_, i) => i !== index));
            } catch (error) {
                console.error("Error deleting item:", error);
            }
        };
    
        return (
            <>
            
                
                {isAttackSection ? (
                    <div className='attacks-box'>
                        <div className="section-header">
                            <h2>{title}</h2>
                            <FaPencilAlt className="edit-icon" onClick={() => setIsModalOpen(true)} />
                        </div>
                        
                            
                        <table>
                            <thead>
                            <tr>
                                <th>Nazwa</th>
                                <th>Attack Bonus</th>
                                <th>Obrażenia</th>
                            </tr>
                            </thead>
                            <tbody>
                            {localItems.map((item, index) => (
                                <tr key={index}>
                                <td>
                                    {item.name}
                                </td>
                                <td>
                                    {item.attack_bonus}
                                </td>
                                <td>
                                    {item.damage}
                                </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="info-box">
                        <div className="section-header">
                            <h3>{title}</h3>
                            <FaPencilAlt className="edit-icon" onClick={() => setIsModalOpen(true)} />
                        </div>
                        <>
                        {localItems.length > 0 ? (
                            <ul>
                                {localItems.map((item, index) => (
                                    <li key={index}>
                                        <strong>{item.name}</strong> - {item.description}
                                        {!isAttackSection && ` - ${item.description}`}
                                        {isEquipmentField && ` (x${item.quantity})`}
                                        {isAttackSection && ` (Bonus: +${item.attack_bonus}, Damage: ${item.damage})`}
                                    </li>
                                ))}
                            </ul>
                            ) : (
                            <p>Brak danych</p>
                        )}
                        </>
                        </div>
                    )}
    
                {/* Modal edycji */}
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
                                    {!isAttackSection && (
                                    <input
                                        type="text"
                                        placeholder="Opis"
                                        value={item.description}
                                        onChange={(e) => handleEdit(index, "description", e.target.value)}
                                    />
                                    )}
    
                                    {isEquipmentField && (
                                        <input
                                            type="number"
                                            placeholder="Ilość"
                                            value={item.quantity}
                                            min="1"
                                            onChange={(e) => handleEdit(index, "quantity", Number(e.target.value))}
                                        />
                                    )}
    
                                    {isAttackSection && (
                                        <>
                                            <input
                                                type="number"
                                                placeholder="Attack Bonus"
                                                value={item.attack_bonus}
                                                onChange={(e) => handleEdit(index, "attack_bonus", Number(e.target.value))}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Damage (np. 1d8+2)"
                                                value={item.damage}
                                                onChange={(e) => handleEdit(index, "damage", e.target.value)}
                                            />
                                            
                                        </>
                                    )}
                                    
                                    <FaTrash className="delete-icon" onClick={() => handleDelete(item.id, index)} />
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
            
            </>
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

    const saveNotes = (newNotes) => {
        setIsNotesOpen(newNotes);
    }




    return (
        <div className="character-sheet">
            {/* Floating Button */}
            <button className="floating-button" onClick={() => setIsNotesOpen(true)}>📝</button>
            <button className="dice-floating-button" onClick={() => setIsDiceRollerOpen(true)}>DICE</button>
            
            {/* Modale */}
            <NotesModal 
                isOpen={isNotesOpen} 
                onClose={() => setIsNotesOpen(false)} 
                onSave={saveNotes} 
                initialNotes={notes}
            />
            <DiceRoller 
                isOpen={isDiceRollerOpen} 
                onClose={() => setIsDiceRollerOpen(false)} 
            />
            
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
            <div className='attributes-skills'>
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
                    <EditableSection
                            title="Attacks"
                            items={character.attacks}
                            fieldName="attacks"
                            onSave={handleSave}
                        />
                </div>  

                <div className='traits-container'>
                {/* Traits & features */}
                        {/* Traits */}
                        <EditableSection
                            title="Traits"
                            items={character.traits}
                            fieldName="traits"
                            onSave={handleSave}
                        />

                        {/* Features */}
                        <EditableSection
                            title="Features"
                            items={character.features}
                            fieldName="features"
                            onSave={handleSave}
                        />

                        {/* Proficiencies */}
                        <EditableSection
                            title="Proficiencies"
                            items={character.proficiencies}
                            fieldName="proficiencies"
                            onSave={handleSave}
                        />


                        {/* Languages */}
                        <EditableSection
                            title="Languages"
                            items={character.languages}
                            fieldName="languages"
                            onSave={handleSave}
                        />
                        
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