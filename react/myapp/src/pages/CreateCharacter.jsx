import { useNavigate } from "react-router-dom";
import CharacterForm from "../components/CharacterForm";

const CreateCharacter = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleCreate = async (characterData) => {
        const skillsDict = Object.fromEntries(characterData.skills.map(skill => [skill.name, skill.value]));

        const formattedCharacterData = {
            ...characterData,
            skills: skillsDict
        };
        console.log("Wysyłane dane:", JSON.stringify(formattedCharacterData, null, 2));

        

        try {
            const response = await fetch('http://127.0.0.1:8000/characters/', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}`
                },
                body: JSON.stringify(formattedCharacterData),
            });

            if (response.ok) {
                alert("Character has been created")
                navigate('/characters');
            } else {

                alert("Error with creation");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className='max-w-lg mx-auto mt-10'>
            <CharacterForm onSubmit={handleCreate} />
        </div>
    );
};

export default CreateCharacter;