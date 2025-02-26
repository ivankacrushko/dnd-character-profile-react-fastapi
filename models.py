from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from database import Base



class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)

    character = relationship('Character', back_populates='user', uselist=False)

class Character(Base):
    __tablename__ = 'characters'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship('User', back_populates='characters')

    name = Column(String)
    class_name = Column(String)
    level = Column(Integer)
    background = Column(String)
    race = Column(String)
    alignment = Column(String)
    experience = Column(Integer)

    strength = Column(Integer)
    dexterity = Column(Integer)
    constitution = Column(Integer)
    intelligence = Column(Integer)
    charisma = Column(Integer)
    wisdom = Column(Integer)

    proficency_bonus = Column(Integer)
    armor = Column(Integer)
    speed = Column(Integer)
    hp_max = Column(Integer)
    hp_current = Column(Integer)
    hp_temp = Column(Integer)
    hit_dice = Column(String)

    death_saves_success = Column(Integer)
    death_saves_failure = Column(Integer)

    backstory = Column(Text)

    skills = relationship('Skill', back_populates='character')
    attacks = relationship('Attack', back_populates='character')
    proficiencies = relationship('Proficiency', back_populates='character')
    languages = relationship('Language', back_populates='character')
    equipment = relationship('Equipment', back_populates='character')
    traits = relationship('Trait', back_populates='character')
    features = relationship('Feature', back_populates='character')

class Skill(Base):
    __tablename__ = 'skills'

    id = Column(Integer, primary_key=True, index=True)
    character_id = Column(Integer, ForeignKey('characters.id'))
    character = relationship('Character', back_populates='skill')

    acrobatics = Column(Boolean, default=False)
    animal_handling = Column(Boolean, default=False)
    arcana = Column(Boolean, default=False)
    athletics = Column(Boolean, default=False)
    deception = Column(Boolean, default=False)
    history = Column(Boolean, default=False)
    insight = Column(Boolean, default=False)
    intimidation = Column(Boolean, default=False)
    investigation = Column(Boolean, default=False)
    medicine = Column(Boolean, default=False)
    nature = Column(Boolean, default=False)
    perception = Column(Boolean, default=False)
    performance = Column(Boolean, default=False)
    persuasion = Column(Boolean, default=False)
    religion = Column(Boolean, default=False)
    sleight_of_hand = Column(Boolean, default=False)
    stealth = Column(Boolean, default=False)
    survival = Column(Boolean, default=False)

class Attack(Base):
    __tablename__ = 'attacks'

    id = Column(Integer, primary_key=True, index=True)
    character_id = Column(Integer, ForeignKey('characters.id'))
    character = relationship('Character', back_populates='attacks')

    name = Column(String)
    damage = Column(String)
    bonus = Column(Integer)
    type = Column(String)

class Proficiency(Base):
    __tablename__ = 'proficiencies'

    id = Column(Integer, primary_key=True, index=True)
    character_id = Column(Integer, ForeignKey('characters.id'))
    character = relationship('Character', back_populates='proficiencies')

    name = Column(String)

class Language(Base):
    __tablename__ = 'languages'

    id = Column(Integer, primary_key=True, index=True)
    character_id = Column(Integer, ForeignKey('characters.id'))
    character = relationship('Character', back_populates='languages')

    name = Column(String)

class Equipment(Base):
    __tablename__ = 'equipment'

    id = Column(Integer, primary_key=True, index=True)
    character_id = Column(Integer, ForeignKey('characters.id'))
    character = relationship('Character', back_populates='equipment')

    name = Column(String)
    quantity = Column(Integer, default = 1)

class Trait(Base):
    __tablename__ = 'traits'

    id = Column(Integer, primary_key=True, index=True)
    character_id = Column(Integer, ForeignKey('characters.id'))
    character = relationship('Character', back_populates='traits')

    name = Column(String)
    description = Column(Text)

class Feature(Base):
    __tablename__ = 'features'

    id = Column(Integer, primary_key=True, index=True)
    character_id = Column(Integer, ForeignKey('characters.id'))
    character = relationship('Character', back_populates='features')

    name = Column(String)
    description = Column(Text)


class UserRegister(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str

    class Config:
        from_attributes = True