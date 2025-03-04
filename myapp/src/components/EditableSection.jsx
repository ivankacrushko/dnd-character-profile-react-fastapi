import React, { useState } from 'react';
//import './CharacterDetails.css';
import { FaPencilAlt, FaTrash, FaPlus} from 'react-icons/fa';
import { toast } from "react-toastify";


const EditableSection = ({ title, fieldName, items = [], onSave, characterId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [localItems, setLocalItems] = useState(items || []);

    const isEquipmentField = fieldName === "equipment";
    const isAttackSection = fieldName === "attacks";
    //console.log(localItems)
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

    const handleSave = async () => {
        

        await onSave(fieldName, localItems);
        setIsModalOpen(false);
    };

    const handleDelete = async (itemId, index) => {
        try {
            const url = `http://127.0.0.1:8000/characters/${characterId}/${fieldName}/${itemId}`;
            
    
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

export default EditableSection;