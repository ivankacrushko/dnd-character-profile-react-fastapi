from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Character, Skill, Trait, Feature, Attack, Proficiency, Language, Equipment
from schemas import CharacterCreate, CharacterResponse, CharacterUpdate
from auth import get_current_user
from models import User
import logging

router = APIRouter()

@router.post('/characters/', response_model=CharacterCreate)
def create_character(character: CharacterCreate, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    character_data = character.dict()
    print(character_data)

    skill_data = character_data.pop('skills', {})
    trait_data = character_data.pop('traits', {})
    feature_data = character_data.pop('features', {})
    attack_data = character_data.pop('attacks', {})
    proficiency_data = character_data.pop('proficiencies', {})
    language_data = character_data.pop('languages', {})
    equipment_data = character_data.pop('equipment', {})

    db_character = Character(**character_data)
    if db_character.user_id is None:
        db_character.user_id = current_user.id

    
    
    db.add(db_character)
    db.commit()
    db.refresh(db_character)
    
    db_skills = Skill(character_id=db_character.id, **skill_data)
    db_traits = [Trait(character_id=db_character.id, **trait) for trait in trait_data]
    db_features = [Feature(character_id=db_character.id, **feature) for feature in feature_data]
    db_attacks = [Attack(character_id=db_character.id, **attack) for attack in attack_data]
    db_proficiencies = [Proficiency(character_id=db_character.id, **proficiency) for proficiency in proficiency_data]
    db_languages = [Language(character_id=db_character.id, **language) for language in language_data]
    db_equipment = [Equipment(character_id=db_character.id, **item) for item in equipment_data]

    db.add(db_skills)
    db.commit()
    db.refresh(db_skills)

    if db_traits:
        db.add_all(db_traits)
        db.commit()

    if db_features:
        db.add_all(db_features)
        db.commit()

    if db_attacks:
        db.add_all(db_attacks)
        db.commit()

    if db_proficiencies:
        db.add_all(db_proficiencies)
        db.commit()

    if db_languages:
        db.add_all(db_languages)
        db.commit()

    if db_equipment:
        db.add_all(db_equipment)
        db.commit()

    return db_character

@router.put("/characters/{character_id}")
def update_character(character_id: int, update_data: CharacterUpdate, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    # Pobieramy postać z bazy
    character = db.query(Character).filter(Character.id == character_id, Character.user_id == user.id).first()
    
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")

    
    update_dict = update_data.dict(exclude_unset=True)  # Konwersja na dict
    print(update_dict)


    for key, value in update_dict.items():
        if key == "skills":  # Specjalne traktowanie dla skilli
            skill_obj = db.query(Skill).filter(Skill.character_id == character_id).first()
            if not skill_obj:
                raise HTTPException(status_code=404, detail="Skills not found")

            for skill_name, skill_value in value.items():
                if hasattr(skill_obj, skill_name):  
                    setattr(skill_obj, skill_name, skill_value)
        
        elif key == "equipment":

            if not isinstance(value, list):  
                raise HTTPException(status_code=400, detail="Equipment must be a list")

            for item in value:
                if not isinstance(item, dict):  
                    raise HTTPException(status_code=400, detail="Invalid equipment format")


                existing_item = db.query(Equipment).filter(
                    Equipment.character_id == character.id,
                    Equipment.name == item["name"]
                ).first()

                if existing_item:
                    if item.get("quantity", 1) <= 0:  
                        db.delete(existing_item)
                    else:
                        existing_item.quantity = item.get("quantity", 1)
                else:
                    item_instance = Equipment(
                        name=item.get("name", "Unknown Item"),
                        description=item.get("description", ""),
                        quantity=item.get("quantity", 1),
                        character_id=character.id
                    )
                    db.add(item_instance)  
                    character.equipment.append(item_instance)
        else:
            setattr(character, key, value)

    db.commit()
    db.refresh(character)

    return {"message": "Character updated successfully", "character": character}

@router.get("/characters/{character_id}", response_model=CharacterResponse)
def get_character(character_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    character = db.query(Character).filter(Character.id == character_id, Character.user_id == current_user.id).first()
    
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")

    skills = character.skills[0] if character.skills else None
    traits = [{"name": t.name, "description": t.description} for t in character.traits] if character.traits else []
    features = [{"name": f.name, "description": f.description} for f in character.features] if character.features else []
    attacks = [{"name": a.name,'attack_bonus': a.attack_bonus, "damage": a.damage} for a in character.attacks] if character.attacks else []
    languages = [{"name": l.name,'description': l.description} for l in character.languages] if character.languages else []
    proficiencies = [{"name": p.name,'description': p.description} for p in character.proficiencies] if character.proficiencies else []
    equipment = [{"name": e.name,'description': e.description, 'quantity': e.quantity} for e in character.equipment] if character.equipment else []

    skills_data = {
        "acrobatics": skills.acrobatics if skills else False,
        "animal_handling": skills.animal_handling if skills else False,
        "arcana": skills.arcana if skills else False,
        "athletics": skills.athletics if skills else False,
        "deception": skills.deception if skills else False,
        "history": skills.history if skills else False,
        "insight": skills.insight if skills else False,
        "intimidation": skills.intimidation if skills else False,
        "investigation": skills.investigation if skills else False,
        "medicine": skills.medicine if skills else False,
        "nature": skills.nature if skills else False,
        "perception": skills.perception if skills else False,
        "performance": skills.performance if skills else False,
        "persuasion": skills.persuasion if skills else False,
        "religion": skills.religion if skills else False,
        "sleight_of_hand": skills.sleight_of_hand if skills else False,
        "stealth": skills.stealth if skills else False,
        "survival": skills.survival if skills else False,
    }

    character_data = character.__dict__.copy()
    character_data["skills"] = skills_data  # Podmieniamy skills na słownik
    character_data["traits"] = traits
    character_data["features"] = features
    character_data["attacks"] = attacks
    character_data["languages"] = languages
    character_data["equipment"] = equipment
    character_data["proficiencies"] = proficiencies
    # Konwersja do JSON
    return character_data
        