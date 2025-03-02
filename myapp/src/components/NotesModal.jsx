import { useState, useEffect } from "react";

const NotesPanel = ({ isOpen, onClose, onSave, initialNotes }) => {
    const [notes, setNotes] = useState(initialNotes || "");

    useEffect(() => {
        setNotes(initialNotes);
    }, [initialNotes]);

    const handleSave = () => {
        onSave(notes);
        onClose();
    };

    return (
        <div className={`notes-panel ${isOpen ? "open" : ""}`}>
            <div className="notes-content">
                <button className="close-btn" onClick={onClose}>×</button>
                <h2>Notatki do kampanii</h2>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows="10"
                    placeholder="Wpisz notatki..."
                />
                <button className="save-btn" onClick={handleSave}>Zapisz</button>
            </div>
        </div>
    );
};

export default NotesPanel;
