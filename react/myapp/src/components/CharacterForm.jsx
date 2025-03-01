import { useState } from 'react';
import { motion } from 'framer-motion';
import { Transition } from 'react-transition-group';
import './CharacterForm.css';
import { FaTrash,FaArrowLeft, FaArrowRight} from 'react-icons/fa';

const CharacterForm = ({ onSubmit }) => {
    const [step, setStep] = useState(1);
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
    const [newAttack, setNewAttack] = useState({ name: "", attack_bonus: 0, damage: "" });
    const [newProficiency, setNewProficiency] = useState({ name: "", description: "" });
    const [newLanguage, setNewLanguage] = useState({ name: "", description: "" });
    const [newEquipment, setNewEquipment] = useState({ name: "", description: "", quantity: 1});

    

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
        if (category === "attacks") setNewAttack({ name: '', attack_bonus: 0, damage: '' });
        if (category === "proficiencies") setNewProficiency({ name: '', description: '' });
        if (category === "languages") setNewLanguage({ name: '', description: '' });
        if (category === "equipment") setNewEquipment({ name: '', description: '', quantity: 1});
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
        //e.preventDefault();
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

    const [errorMessage, setErrorMessage] = useState('');

    const validateStep = () => {
        switch (step) {
            case 1: 
                return character.name.trim() !== "" 
                && character.class_name.trim() !== "" && character.race.trim() !== ""
                && character.background.trim() !== "" && character.alignment.trim() !== "";
            case 2: 
                return character.hp_max > 0 && character.armor > 0 && character.speed > 0 
                && character.hp_current  > 0 && character.hit_dice.trim() !== "";
            default:
                return true;
        }
    };

    const handleNextStep = () => {
        if (!validateStep()) {
            setErrorMessage("Uzupełnij wszystkie wymagane pola!");
            return;
        }
        setErrorMessage("");
        setStep(prev => Math.min(prev + 1, steps.length));
    };

    const steps = ['Podstawowe informacje', 'Podstawowe informacje 2', 'Atrybuty oraz umiejętności', 'Ekwipunek', 'Inne biegłości oraz języki', 'Ataki', 'Dodatkowe informacje', 'Podsumowanie']

    const handleNext = () => setStep(prev => prev + 1);
    const handlePrev = () => setStep(prev => prev -1);

    

    return (
        <div className="step-wrapper">
        {/* 🔹 Strzałka Wstecz */}
        {step > 1 && (
                    
                    <FaArrowLeft className="nav-button left" onClick={handlePrev} />
                )}
        
        <div className="character-form-container">
        {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="step-container">
                <div className="step-indicator" style={{ transform: `translateX(-${(step - 1) * 20}%)` }}>
                    {steps.map((label, index) => (
                        <div
                            key={index}
                            className={step === index + 1 ? "active" : ""}
                        >
                            {label}
                        </div>
                    ))}
                </div>
            </div>

        
       

            <Transition in={true} timeout={300}>
                {state => (
                    <div className={`form-step fade-${state}`}>
                        
                    
                    
                    {step === 1 && (
                        <div>
                            <h2>Podstawowe informacje</h2>
                            
                            <div className='input-group'>
                                <label>Imię postaci</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={character.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className='input-group'>
                                <label>Klasa</label>
                                <input
                                    type="text"
                                    name="class_name"
                                    value={character.class_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className='input-group'>
                                <label>Rasa</label>
                                <input
                                    type="text"
                                    name="race"
                                    value={character.race}
                                    onChange={handleChange}
                                    />
                            </div>

                            <div className='input-group'>
                                <label>Przeszłość</label>
                                <input
                                    type="text"
                                    name="background"
                                    value={character.background}
                                    onChange={handleChange}
                                    />
                            </div>

                            <div className='input-group'>
                                <label>Zachowanie</label>
                                <input
                                    type="text"
                                    name="alignment"
                                    value={character.alignment}
                                    onChange={handleChange}
                                    />
                            </div>

                            <div className='input-group'>
                                <label>Poziom</label>
                                <input
                                    type="number"
                                    name="level"
                                    value={character.level}
                                    onChange={handleChange}
                                    min="1"
                                />
                            </div>
                            <div className='input-group'>
                                <label>Punkty doświadczenia</label>
                                <input
                                    type="number"
                                    name="experience"
                                    value={character.experience}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h2>Podstawowe informacje 2</h2>
                            <div className='input-group'>
                            <label>Pancerz</label>
                            <input
                                type="number"
                                name="armor"
                                value={character.armor}
                                onChange={handleChange}
                                min="1"
                            />
                        </div>

                        <div className='input-group'>
                            <label>Szybkość</label>
                            <input
                                type="number"
                                name="speed"
                                value={character.speed}
                                onChange={handleChange}
                                min="1"
                            />
                        </div>

                        <div className='input-group'>
                            <label>Zdrowie max</label>
                            <input
                                type="number"
                                name="hp_max"
                                value={character.hp_max}
                                onChange={handleChange}
                                min="1"
                            />
                        </div>

                        <div className='input-group'>
                            <label>Aktualne zdrowie</label>
                            <input
                                type="number"
                                name="hp_current"
                                value={character.hp_current}
                                onChange={handleChange}
                                min="1"
                            />
                        </div>

                        <div className='input-group'>
                            <label>Tymczasowe zdrowie</label>
                            <input
                                type="number"
                                name="hp_temp"
                                value={character.hp_temp}
                                onChange={handleChange}
                                min="1"
                            />
                        </div> 

                        <div className='input-group'>
                            <label>Hit dice</label>
                            <input
                                type="text"
                                name="hit_dice"
                                value={character.hit_dice}
                                onChange={handleChange}
                                />
                        </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h2>Atrybuty oraz umiejętności</h2>
                            <div className='input-group'>
                            <label>Siła</label>
                            <input
                                type="number"
                                name="strength"
                                value={character.strength}
                                onChange={handleChange}
                                min="1"
                            />
                        </div>

                        <div className='input-group'>
                            <label>Zręczność</label>
                            <input
                                type="number"
                                name="dexterity"
                                value={character.dexterity}
                                onChange={handleChange}
                                min="1"
                            />
                        </div>

                        <div className='input-group'>
                            <label>Kondycja</label>
                            <input
                                type="number"
                                name="constitution"
                                value={character.constitution}
                                onChange={handleChange}
                                min="1"
                            />
                        </div>

                        <div className='input-group'>
                            <label>Inteligencja</label>
                            <input
                                type="number"
                                name="intelligence"
                                value={character.intelligence}
                                onChange={handleChange}
                                min="1"
                            />
                        </div>

                        <div className='input-group'>
                            <label>Wisdom</label>
                            <input
                                type="number"
                                name="wisdom"
                                value={character.wisdom}
                                onChange={handleChange}
                                min="1"
                            />
                        </div>

                        <div className='input-group'>
                            <label>Charyzma</label>
                            <input
                                type="number"
                                name="charisma"
                                value={character.charisma}
                                onChange={handleChange}
                                min="1"
                            />
                        </div>

                        <h2>Umiejętności</h2>
                        {character.skills.map((skill) => (
                        <p><label key={skill.name}>
                            <input type='checkbox' name={skill.name} checked={skill.value} onChange={() => handleSkillChange(skill.name)} />
                            {skill.name.charAt(0).toUpperCase() + skill.name.slice(1)}
                        </label></p>
                        ))}
                        </div>
                    )}

                    {step === 4 && (
                        <div>
                            <h2>Cechy</h2>
                            <div className='input-group'>
                            <label>Dodaj Trait</label>
                                <input
                                    type="text"
                                    placeholder="Nazwa Traita"
                                    value={newTrait.name}
                                    onChange={(e) => handleChangeNew("traits", "name", e.target.value)}
                                />
                            </div>
                            <div className='input-group'>
                                <input
                                    type="text"
                                    placeholder="Opis Traita"
                                    value={newTrait.description}
                                    onChange={(e) => handleChangeNew("traits", "description", e.target.value)}
                                />
                            </div>
                                <button type='button' className="button button-next" onClick={() => handleAddItem("traits", newTrait)}>Dodaj cechę</button>

                                <ul className='equipment-list'>
                                    {character.traits.map((trait, index) => (
                                        <li key={index}>
                                            {trait.name} - {trait.description}
                                        <FaTrash className="delete-icon" onClick={() => handleRemoveItem('traits', index)} />
                                        </li>
                                    ))}
                                </ul>
                            
                        </div>
                    )}

                    {step === 5 && (
                        <div>
                            <h2>Inne biegłości</h2>
                            <div className='input-group'>
                            <input
                                    type="text"
                                    placeholder="Nazwa biegłosci"
                                    value={newProficiency.name}
                                    onChange={(e) => handleChangeNew("proficiencies", "name", e.target.value)}
                            />
                            </div>
                            <div className='input-group'>   
                            <input
                                type="text"
                                placeholder="Opis biegłości"
                                value={newProficiency.description}
                                onChange={(e) => handleChangeNew("proficiencies", "description", e.target.value)}
                            />
                            </div>

                            <button type='button' className="button button-next" onClick={() => handleAddItem("proficiencies", newProficiency)}>Dodaj biegłość</button>

                            <ul className='equipment-list'>
                                {character.proficiencies.map((proficiency, index) => (
                                    <li key={index}>
                                        {proficiency.name} - {proficiency.description}
                                    <FaTrash className="delete-icon" onClick={() => handleRemoveItem('proficiencies', index)} />
                                    </li>
                                ))}
                            </ul>

                            <h2>Języki</h2>
                            <div className='input-group'>
                                <input
                                    type="text"
                                    placeholder="Nazwa języka"
                                    value={newLanguage.name}
                                    onChange={(e) => handleChangeNew("languages", "name", e.target.value)}
                                />
                            </div>
                            <div className='input-group'>
                                <input
                                    type="text"
                                    placeholder="Opis języka"
                                    value={newLanguage.description}
                                    onChange={(e) => handleChangeNew("languages", "description", e.target.value)}
                                />
                            </div>

                            <button type='button' className="button button-next" onClick={() => handleAddItem("languages", newLanguage)}>Dodaj język</button>

                            <ul className='equipment-list'>
                                {character.languages.map((language, index) => (
                                    <li key={index}>
                                        {language.name} - {language.description}
                                    <FaTrash className="delete-icon" onClick={() => handleRemoveItem('languages', index)} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {step === 6 && (
                        <div>
                            <h2>Ataki</h2>
                            <div className='input-group'>
                                <input
                                    type="text"
                                    placeholder="Nazwa ataku"
                                    value={newAttack.name}
                                    onChange={(e) => handleChangeNew("attacks", "name", e.target.value)}
                                />
                            </div>
                            <div className='input-group'>
                                <input
                                    type="number"
                                    placeholder="Atak bonus"
                                    value={newAttack.attack_bonus}
                                    onChange={(e) => handleChangeNew("attacks", "attack_bonus", e.target.value)}
                                />
                            </div>
                            <div className='input-group'>
                                <input
                                    type="text"
                                    placeholder="Obrazenia"
                                    value={newAttack.damage}
                                    onChange={(e) => handleChangeNew("attacks", "damage", e.target.value)}
                                />
                            </div>
                            <button type='button' onClick={() => handleAddItem("attacks", newAttack)} className="button button-next">Dodaj atak</button>

                            <ul className='equipment-list'>
                                {character.attacks.map((attack, index) => (
                                    <li key={index}>
                                        {attack.name} - {attack.description}
                                    <FaTrash className="delete-icon" onClick={() => handleRemoveItem('attacks', index)} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {step === 7 && (
                        <div>
                            <h2>Dodatkowe informacje</h2>
                            <div className='input-group'>
                                <label>Historia postaci</label>

                                <textarea
                                    type="text"
                                    name="backstory"
                                    value={character.backstory}
                                    onChange={handleChange}
                                    />
                            </div>
                        </div>
                    )}

                    {step === 8 && (
                        <div className='input-group'>
                            <h2>Podsumowanie</h2>
                            <p><strong>Imię:</strong> {character.name}</p>
                            <p><strong>Poziom:</strong> {character.level}</p>
                            <p><strong>HP:</strong> {character.hp}</p>
                            <p><strong>Siła:</strong> {character.strength}</p>
                            <p><strong>Zręczność:</strong> {character.dexterity}</p>
                            <p><strong>Inteligencja:</strong> {character.intelligence}</p>
                            <h3 className="text-lg mt-3">Ekwipunek:</h3>
                            <ul>
                                {character.equipment.map((item, index) => (
                                    <li key={index}>{item.name}</li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handleSubmit(character)}
                            >
                                Zapisz Postać
                            </button>
                        </div>
                    )}
                    </div>
                )}
            </Transition>
            

            {/* Przyciski nawigacji */}
            <div className="button-group">
                {step > 1 && (
                    <button 
                        onClick={handlePrev} 
                        className="button button-back"
                    >
                        ⬅ Wstecz
                    </button>
                )}
                {step < 8 && (
                    <button 
                        onClick={handleNextStep} 
                        className="button button-next"
                    >
                        Dalej ➡
                    </button>
                )}
            </div>
            
        </div>
        {/* 🔹 Strzałka Dalej */}
        {step < 8 && (
                    <FaArrowRight className="nav-button right" onClick={handleNextStep} />
                )}
    </div>
    );
};


export default CharacterForm;







                

        