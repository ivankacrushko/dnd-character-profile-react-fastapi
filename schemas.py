from pydantic import BaseModel
from typing import List, Optional, Dict



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

class CharacterResponse(BaseModel):
    id: int
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
    skills: Dict[str, bool]
    traits: List[TraitBase]
    features: List[FeatureBase]
    attacks: List[AttackBase]
    languages: List[LanguageBase]
    proficiencies: List[ProficiencyBase]
    equipment: List[EquipmentBase]

    class Config:
        orm_mode = True

class CharacterUpdate(BaseModel):
    name: Optional[str] = None
    class_name: Optional[str] = None
    level: Optional[int] = None
    background: Optional[str] = None
    race: Optional[str] = None
    alignment: Optional[str] = None
    experience: Optional[int] = None
    hp_max: Optional[int] = None
    hp_current: Optional[int] = None
    hp_temp: Optional[int] = None
    armor: Optional[int] = None
    death_saves_success: Optional[int] = None
    death_saves_failure: Optional[int] = None

    strength: Optional[int] = None
    dexterity: Optional[int] = None
    constitution: Optional[int] = None
    intelligence: Optional[int] = None
    wisdom: Optional[int] = None
    charisma: Optional[int] = None

    skills: Optional[Dict[str, bool]] = None
    equipment: Optional[List[EquipmentBase]] = None

    class Config:
        orm_mode = True
    

