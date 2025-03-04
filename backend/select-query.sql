SELECT traits.character_id, traits.name, features.name, proficiencies.name, languages.name, equipment.name, attacks, skills FROM characters 
LEFT JOIN skills ON skills.character_id = characters.id
LEFT JOIN traits ON traits.character_id = characters.id
LEFT JOIN features ON features.character_id = characters.id
LEFT JOIN proficiencies ON proficiencies.character_id = characters.id
LEFT JOIN languages ON languages.character_id = characters.id
LEFT JOIN equipment ON equipment.character_id = characters.id
LEFT JOIN attacks ON attacks.character_id = characters.id
WHERE characters.id = 23