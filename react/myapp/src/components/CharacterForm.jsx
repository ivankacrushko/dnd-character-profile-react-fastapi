import { useState } from 'react';

const CharacterForm = ({ onSubmit }) => {
    const [character, setCharacter] = useState({
        name: '',
        class_name: '',
        level: 1,
        background: '',
        race: '',
        armor: 10,
        proficiency_bonus: 2,
        speed: 25,
        hp_max: 10,
        hp_current: 10,
        hp_temp: 0,
        hit_dice: '',
        death_saves_success: 0,
        death_saves_failure: 0,
        backstory: '',
        alignment: '',
        experience: 0,
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
        skills: [
            { name: "acrobatics", value: false },
            { name: "animal_handling", value: false },
            { name: "arcana", value: false },
            { name: "athletics", value: false },
            { name: "deception", value: false },
            { name: "history", value: false },
            { name: "insight", value: false },
            { name: "intimidation", value: false },
            { name: "investigation", value: false },
            { name: "medicine", value: false },
            { name: "nature", value: false },
            { name: "perception", value: false },
            { name: "performance", value: false },
            { name: "persuasion", value: false },
            { name: "religion", value: false },
            { name: "sleight_of_hand", value: false },
            { name: "stealth", value: false },
            { name: "survival", value: false }
        ],
        traits: [],
        features: [],
        attacks: [],
        proficiencies: [],
        languages: [],
        equipment: []
    });

    const [newTrait, setNewTrait] = useState({ name : "", description: ""});
    const [newFeature, setNewFeature] = useState({ name : "", description: ""});
    const [newAttack, setNewAttack] = useState({ name: "", attack_bonus: "", damage: "" });
    const [newProficiency, setNewProficiency] = useState({ name: "", description: "" });
    const [newLanguage, setNewLanguage] = useState({ name: "", description: "" });
    const [newEquipment, setNewEquipment] = useState({ name: "", description: "", quantity: ''});

    const [isTraitsOpen, setIsTraitsOpen] = useState(false);
    const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
    const [isAttacksOpen, setIsAttacksOpen] = useState(false);
    const [isProficienciesOpen, setIsProficienciesOpen] = useState(false);
    const [isLanguagesOpen, setIsLanguagesOpen] = useState(false);
    const [isEquipmentOpen, setIsEquipmentOpen] = useState(false);

    const handleChangeNew = (category, field, value) => {
        if (category === "traits") {
            setNewTrait((prev) => ({ ...prev, [field]: value }));
        } else if (category === "features") {
            setNewFeature((prev) => ({ ...prev, [field]: value }));
        } else if (category === "attacks") {
            setNewAttack((prev) => ({ ...prev, [field]: value }));
        } else if (category === "proficiencies") {
            setNewProficiency((prev) => ({ ...prev, [field]: value }));
        } else if (category === "languages") {
            setNewLanguage((prev) => ({ ...prev, [field]: value }));
        } else if (category === "equipment") {
            setNewEquipment((prev) => ({ ...prev, [field]: value }));
        }
    };
    
    const handleAddItem = (category, newItem) => {
        console.log(newItem)
        if (!newItem.name.trim()) {
            console.error('BLAD: proba dodania pustego elementu', newItem);
            return;
        }
    
        setCharacter((prevCharacter) => ({
            ...prevCharacter,
            [category]: [...prevCharacter[category], newItem],
        }));
    
        if (category === "traits") setNewTrait({ name: "", description: "" });
        if (category === "features") setNewFeature({ name: "", description: "" });
        if (category === "attacks") setNewAttack({ name: '', attack_bonus: '', damage: '' });
        if (category === "proficiencies") setNewProficiency({ name: '', description: '' });
        if (category === "languages") setNewLanguage({ name: '', description: '' });
        if (category === "equipment") setNewEquipment({ name: '', description: '', quantity: ''});
    };

    const handleRemoveItem = (category, index) => {
        setCharacter((prevCharacter) => ({
            ...prevCharacter,
            [category]: prevCharacter[category].filter((_, i) => i !== index)
        }));
    };

    const handleChange = (e) => {
        const { name, value} = e.target;
        setCharacter({ ...character, [name]: value});

        
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(character);
    };

    const handleSkillChange = (skillName) => {
        setCharacter((prevCharacter) => ({
            ...prevCharacter,
            skills: prevCharacter.skills.map((skill) =>
                skill.name === skillName ? { ...skill, value: !skill.value } : skill
            )
        }));
    };
    

    return (
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-md text-white">
            <h2 className="text-xl font-bold mb-4">Tworzenie postaci</h2>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm">Imię postaci</label>
                    <input
                        type="text"
                        name="name"
                        value={character.name}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm">Klasa</label>
                    <input
                        type="text"
                        name="class_name"
                        value={character.class_name}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm">Rasa</label>
                    <input
                        type="text"
                        name="race"
                        value={character.race}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                    />
                </div>

                <div>
                    <label className="block text-sm">Przeszłość</label>
                    <input
                        type="text"
                        name="background"
                        value={character.background}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                    />
                </div>

                <div>
                    <label className="block text-sm">Zachowanie</label>
                    <input
                        type="text"
                        name="alignment"
                        value={character.alignment}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                    />
                </div>

                <div>
                    <label className="block text-sm">Poziom</label>
                    <input
                        type="number"
                        name="level"
                        value={character.level}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                        min="1"
                    />
                </div>

                <div>
                    <label className="block text-sm">Bonus z biegłości</label>
                    <input
                        type="number"
                        name="proficiency_bonus"
                        value={character.proficiency_bonus}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                        min="1"
                    />
                </div>

                <div>
                    <label className="block text-sm">Punkty doświadczenia</label>
                    <input
                        type="number"
                        name="experience"
                        value={character.experience}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                        min="1"
                    />
                </div>

                <div>
                    <label className="block text-sm">Pancerz</label>
                    <input
                        type="number"
                        name="armor"
                        value={character.armor}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                        min="1"
                    />
                </div>

                <div>
                    <label className="block text-sm">Szybkość</label>
                    <input
                        type="number"
                        name="speed"
                        value={character.speed}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                        min="1"
                    />
                </div>

                <div>
                    <label className="block text-sm">Zdrowie max</label>
                    <input
                        type="number"
                        name="hp_max"
                        value={character.hp_max}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                        min="1"
                    />
                </div>

                <div>
                    <label className="block text-sm">Aktualne zdrowie</label>
                    <input
                        type="number"
                        name="hp_current"
                        value={character.hp_current}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                        min="1"
                    />
                </div>

                <div>
                    <label className="block text-sm">Tymczasowe zdrowie</label>
                    <input
                        type="number"
                        name="hp_temp"
                        value={character.hp_temp}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                        min="1"
                    />
                </div>

                <div>
                    <label className="block text-sm">Hit dice</label>
                    <input
                        type="text"
                        name="hit_dice"
                        value={character.hit_dice}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                    />
                </div>

                <div>
                    <label className="block text-sm">Rzuty na smierc(sukces)</label>
                    <input
                        type="number"
                        name="death_saves_success"
                        value={character.death_saves_success}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                        min="1"
                    />
                </div>

                <div>
                    <label className="block text-sm">Rzuty na smierc(porazka)</label>
                    <input
                        type="number"
                        name="death_saves_failure"
                        value={character.death_saves_failure}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                        min="1"
                    />
                </div>

                <div>
                    <label className="block text-sm">Siła</label>
                    <input
                        type="number"
                        name="strength"
                        value={character.strength}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                        min="1"
                    />
                </div>

                <div>
                    <label className="block text-sm">Zręczność</label>
                    <input
                        type="number"
                        name="dexterity"
                        value={character.dexterity}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                        min="1"
                    />
                </div>

                <div>
                    <label className="block text-sm">Kondycja</label>
                    <input
                        type="number"
                        name="constitution"
                        value={character.constitution}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                        min="1"
                    />
                </div>

                <div>
                    <label className="block text-sm">Inteligencja</label>
                    <input
                        type="number"
                        name="intelligence"
                        value={character.intelligence}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                        min="1"
                    />
                </div>

                <div>
                    <label className="block text-sm">Wisdom</label>
                    <input
                        type="number"
                        name="wisdom"
                        value={character.wisdom}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                        min="1"
                    />
                </div>

                <div>
                    <label className="block text-sm">Charyzma</label>
                    <input
                        type="number"
                        name="charisma"
                        value={character.charisma}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                        min="1"
                    />
                </div>

                <div>
                    <label className="block text-sm">Historia postaci</label>
                    <input
                        type="text"
                        name="backstory"
                        value={character.backstory}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                    />
                </div>
            </div >
            <div className="grid grid-cols-2 gap-4">
            <h3>Umiejętności</h3>
            {character.skills.map((skill) => (
                <label key={skill.name}>
                    <input type='checkbox' name={skill.name} checked={skill.value} onChange={() => handleSkillChange(skill.name)} />
                    {skill.name.charAt(0).toUpperCase() + skill.name.slice(1)}
                </label>
            ))}
            </div>

            <div>
                <button onClick={() => setIsTraitsOpen(!isTraitsOpen)}>
                    {isTraitsOpen ? "🔽 Zamknij Traity" : "▶ Otwórz Traity"}
                </button>
                {isTraitsOpen && (
                    <div>
                        <h3>Dodaj Trait</h3>
                        <input
                            type="text"
                            placeholder="Nazwa Traita"
                            value={newTrait.name}
                            onChange={(e) => handleChangeNew("traits", "name", e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Opis Traita"
                            value={newTrait.description}
                            onChange={(e) => handleChangeNew("traits", "description", e.target.value)}
                        />
                        <button type='button' onClick={() => handleAddItem("traits", newTrait)}>Dodaj Trait</button>

                        <table>
                            <thead>
                                <tr>
                                    <th>Nazwa</th>
                                    <th>Opis</th>
                                </tr>
                            </thead>
                            <tbody>
                                {character.traits.map((trait, index) => (
                                    <tr key={index}>
                                        <td>{trait.name}</td>
                                        <td>{trait.description}</td>
                                        <td><button type='button' onClick={() => handleRemoveItem('traits', index)}>Usun</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div>
                <button onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}>
                    {isFeaturesOpen ? "🔽 Zamknij Features" : "▶ Otwórz Features"}
                </button>
                {isFeaturesOpen && (
                    <div>
                        <h3>Dodaj Feature</h3>
                        <input
                            type="text"
                            placeholder="Nazwa Feature"
                            value={newFeature.name}
                            onChange={(e) => handleChangeNew("features", "name", e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Opis Feature"
                            value={newFeature.description}
                            onChange={(e) => handleChangeNew("features", "description", e.target.value)}
                        />
                        <button onClick={() => handleAddItem("features", newFeature)}>Dodaj Feature</button>

                        <table>
                            <thead>
                                <tr>
                                    <th>Nazwa</th>
                                    <th>Opis</th>
                                </tr>
                            </thead>
                            <tbody>
                                {character.features.map((feature, index) => (
                                    <tr key={index}>
                                        <td>{feature.name}</td>
                                        <td>{feature.description}</td>
                                        <td><button type='button' onClick={() => handleRemoveItem('features', index)}>Usun</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div>
                <button onClick={() => setIsAttacksOpen(!isAttacksOpen)}>
                    {isAttacksOpen ? "🔽 Zamknij Attacks" : "▶ Otwórz Attacks"}
                </button>
                {isAttacksOpen && (
                    <div>
                        <h3>Dodaj Atak</h3>
                        <input
                            type="text"
                            placeholder="Nazwa ataku"
                            value={newAttack.name}
                            onChange={(e) => handleChangeNew("attacks", "name", e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Atak bonus"
                            value={newAttack.attack_bonus}
                            onChange={(e) => handleChangeNew("attacks", "attack_bonus", e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Obrazenia"
                            value={newAttack.damage}
                            onChange={(e) => handleChangeNew("attacks", "damage", e.target.value)}
                        />
                        <button onClick={() => handleAddItem("attacks", newAttack)}>Dodaj Feature</button>

                        <table>
                            <thead>
                                <tr>
                                    <th>Nazwa</th>
                                    <th>Opis</th>
                                </tr>
                            </thead>
                            <tbody>
                                {character.attacks.map((attack, index) => (
                                    <tr key={index}>
                                        <td>{attack.name}</td>
                                        <td>{attack.attack_bonus}</td>
                                        <td>{attack.damage}</td>
                                        <td><button type='button' onClick={() => handleRemoveItem('attacks', index)}>Usun</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div>
                <button onClick={() => setIsProficienciesOpen(!isProficienciesOpen)}>
                    {isProficienciesOpen ? "🔽 Zamknij biegłosci" : "▶ Otwórz biegłosci"}
                </button>
                {isProficienciesOpen && (
                    <div>
                        <h3>Dodaj biegłość</h3>
                        <input
                            type="text"
                            placeholder="Nazwa biegłosci"
                            value={newProficiency.name}
                            onChange={(e) => handleChangeNew("proficiencies", "name", e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Opis biegłości"
                            value={newProficiency.description}
                            onChange={(e) => handleChangeNew("proficiencies", "description", e.target.value)}
                        />

                        <button onClick={() => handleAddItem("proficiencies", newProficiency)}>Dodaj biegłość</button>

                        <table>
                            <thead>
                                <tr>
                                    <th>Nazwa</th>
                                    <th>Opis</th>
                                </tr>
                            </thead>
                            <tbody>
                                {character.proficiencies.map((proficiency, index) => (
                                    <tr key={index}>
                                        <td>{proficiency.name}</td>
                                        <td>{proficiency.description}</td>
                                        <td><button type='button' onClick={() => handleRemoveItem('proficiencies', index)}>Usun</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div>
                <button onClick={() => setIsLanguagesOpen(!isLanguagesOpen)}>
                    {isLanguagesOpen ? "🔽 Zamknij jezyki" : "▶ Otwórz jezyki"}
                </button>
                {isLanguagesOpen && (
                    <div>
                        <h3>Dodaj język</h3>
                        <input
                            type="text"
                            placeholder="Nazwa języka"
                            value={newLanguage.name}
                            onChange={(e) => handleChangeNew("languages", "name", e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Opis języka"
                            value={newLanguage.description}
                            onChange={(e) => handleChangeNew("languages", "description", e.target.value)}
                        />

                        <button onClick={() => handleAddItem("languages", newLanguage)}>Dodaj biegłość</button>

                        <table>
                            <thead>
                                <tr>
                                    <th>Nazwa</th>
                                    <th>Opis</th>
                                </tr>
                            </thead>
                            <tbody>
                                {character.languages.map((language, index) => (
                                    <tr key={index}>
                                        <td>{language.name}</td>
                                        <td>{language.description}</td>
                                        <td><button type='button' onClick={() => handleRemoveItem('languages', index)}>Usun</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div>
                <button onClick={() => setIsEquipmentOpen(!isEquipmentOpen)}>
                    {isEquipmentOpen ? "🔽 Zamknij eq" : "▶ Otwórz eq"}
                </button>
                {isEquipmentOpen && (
                    <div>
                        <h3>Ekwipunek</h3>
                        <input
                            type="text"
                            placeholder="Nazwa przedmiotu"
                            value={newEquipment.name}
                            onChange={(e) => handleChangeNew("equipment", "name", e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Opis przedmiotu"
                            value={newEquipment.description}
                            onChange={(e) => handleChangeNew("equipment", "description", e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Ilosc"
                            value={newEquipment.quantity}
                            onChange={(e) => handleChangeNew("equipment", "quantity", e.target.value)}
                        />

                        <button onClick={() => handleAddItem("equipment", newEquipment)}>Dodaj przedmiot</button>

                        <table>
                            <thead>
                                <tr>
                                    <th>Nazwa</th>
                                    <th>Opis</th>
                                    <th>Ilosc</th>
                                </tr>
                            </thead>
                            <tbody>
                                {character.equipment.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>{item.description}</td>
                                        <td>{item.quantity}</td>
                                        <td><button type='button' onClick={() => handleRemoveItem('equipment', index)}>Usun</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">
                Zapisz postać
            </button>
        </form>
    );
};


export default CharacterForm;