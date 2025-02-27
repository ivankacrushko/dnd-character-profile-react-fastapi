from pydantic import BaseModel
from typing import List, Optional



class SkillBase(BaseModel):
    acrobatics: bool = False
    animal_handling: bool = False
    arcana: bool = False
    athletics: bool = False
    deception: bool = False
    history: bool = False
    insight: bool = False
    intimidation: bool = False
    investigation: bool = False
    medicine: bool = False
    nature: bool = False
    perception: bool = False
    performance: bool = False
    persuasion: bool = False
    religion: bool = False
    sleight_of_hand: bool = False
    stealth: bool = False
    survival: bool = False

class FeatureBase(BaseModel):
    name: str
    description: str

class TraitBase(BaseModel):
    name: str
    description: str

class AttackBase(BaseModel):
    name: str
    attack_bonus: int
    damage: str

class ProficiencyBase(BaseModel):
    name: str
    description: str

class LanguageBase(BaseModel):
    name: str
    description: str

class EquipmentBase(BaseModel):
    name: str
    description: str
    quantity: int

class CharacterCreate(BaseModel):
    name: str
    class_name: str
    level: int
    background: str
    race: str
    armor: int
    proficiency_bonus: int
    speed: int
    hp_max: int
    hp_current: int
    hp_temp: int
    hit_dice: str
    death_saves_success: int
    death_saves_failure: int
    backstory: str
    alignment: str
    experience: int
    strength: int
    dexterity: int
    constitution: int
    intelligence: int
    wisdom: int
    charisma: int
    skills: SkillBase
    traits: List[TraitBase] = []
    features: List[FeatureBase] = []
    attacks: List[AttackBase] = []
    proficiencies: List[ProficiencyBase] = []
    languages: List[LanguageBase] = []
    equipment: List[EquipmentBase] = []

    class Config:
        from_attributes = True
    

