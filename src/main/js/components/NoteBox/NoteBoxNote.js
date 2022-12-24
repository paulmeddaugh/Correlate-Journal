import styles from '../../styles/NoteBox/NoteBoxNote.module.css';
import '../../styles/NoteBox/NoteBoxNote.css';

const NoteBoxNote = ({ note, index, onSelect, onDelete, selected }) => {

    const deleteNote = () => {
        if (!window.confirm("Are you sure you want to delete note \"" + note.title + "\"?")) {
            return;
        }

        (() => onDelete(note, index))();
    };

    const selectNote = () => {
        onSelect(note, index);
    }

    return (
        <a 
            onClick={selectNote}
            href={'#' + note.id}
            className={"list-group-item list-group-item-action flex-column align-items-start " 
                + ((selected.note.id === note.id) ? "active " : ' ') // Is selected styling
                + (String(note.title)[0] === '﻿' ? styles.unsavedNote : '')} // Unsaved note styling
            data-idnotebook={note.idNotebook}
        >
            <div className="d-flex w-30 justify-content-between">
                <h5 className="mb-1" id="title">{note.title !== '' ? note.title : 'Untitled'}</h5>
                <small>
                    {new Date(note.dateCreated)
                        .toLocaleDateString('en-us', { month:"short", day:"numeric" })}
                </small>
            </div>
            <div className='d-flex justify-content-between'>
                <p className="mb-1">{note.text !== '' ? note.text : '-'}</p>
                <small className={styles.unsavedNoteText}>
                    {String(note.title)[0] === '﻿' ? 'Unsaved' : ''}
                </small>
            </div>
            
            {note.id !== null ? 
                <div 
                    className={styles.removeNote 
                        + (selected.note.id === note.id ? " " + styles.removeNoteEntry : '')} 
                    onClick={deleteNote} 
                /> : null
            }
        </a>
    )
}

export default NoteBoxNote;