from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Character, Skill, Trait, Feature, Attack, Proficiency, Language, Equipment
from schemas import CharacterCreate
from auth import get_current_user
from models import User

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

@router.put('/characters/{character_id}/', response_model=CharacterCreate)
def update_character(character_id: int, character_data: CharacterCreate, db: Session = Depends(get_db)):
    db_character = db.query(Character).filter(Character.id == character_id).first()

    if not db_character:
        raise HTTPException(status_code=404, detail='Character not found')
    
    for key, value in character_data.dict().items():
        setattr(db_character, key, value)

    db.commit()
    db.refresh(db_character)
    return db_character