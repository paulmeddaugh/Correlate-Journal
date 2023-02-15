import { forwardRef } from 'react';
import styles from '../../styles/NoteBox/NoteBoxNote.module.css';

/** Keeps track of the time in milliseconds when mouse is pressed down */
let mouseDownStart = 0;

/** The number of milliseconds for the mouse to be held down before calling onSelectDrag. */
const ON_SELECT_DRAG_MILLI = 500;

const NoteBoxNote = ({ note, index, onSelect, onSelectDrag, onSelectDrop, onDelete, selected, dragging, style }, ref) => {

    const deleteNote = (e) => {
        (() => onDelete?.(e, note, index))();
    };

    const selectNote = (e) => {
        onSelect?.(e, note, index);
    }

    /**
     * Determines if mouse is held down long enough to call onSelectDrag.
     */
    // const onMouseDown = (e) => {
    //     mouseDownStart = new Date().getTime();

    //     setTimeout(() => {
    //         if (mouseDownStart) onSelectDrag?.(e, note, index);
    //     }, ON_SELECT_DRAG_MILLI);
    // }

    /**
     * Determines if mouse was held down long enough to call onSelectDrop.
     */
    // const onMouseUp = () => {
    //     if (mouseDownStart + ON_SELECT_DRAG_MILLI < new Date().getTime()) {
    //         onSelectDrop?.(note, index);
    //     }
    //     mouseDownStart = 0;
    // }

    /**
     * Determines if the note is being dragged, and calls onSelectDrag if so.
     */
    // const onMouseMove = (e) => {
    //     if (mouseDownStart && mouseDownStart + ON_SELECT_DRAG_MILLI < new Date().getTime()) {
    //         onSelectDrag?.(e, note, index);
    //     }
    // }

    return (
        <a 
            ref={ref}
            onClick={selectNote}
            onDragStart={(e) => onSelectDrag?.(e, note, index)}
            onDrag={(e) => onSelectDrag?.(e, note, index)}
            onDragEnd={(e) => onSelectDrop?.(e, note, index)}
            // onMouseMove={onMouseMove}
            // onMouseUp={onMouseUp}
            href={'#' + note?.title ?? ''}
            style={Object.assign(style ?? {}, { order: note?.allNotesPosition })}
            className={"list-group-item list-group-item-action flex-column align-items-start " 
                + ((selected.note?.id === note?.id && !dragging) ? "active " : ' ') // Is selected styling
                + (String(note?.title)[0] === '﻿' ? styles.unsavedNote + ' ' : ' ') // Unsaved note styling
                + (dragging ? styles.reordering : '')}
            data-idnotebook={note?.idNotebook}
        >
            <div className="d-flex w-30 justify-content-between">
                <h5 className="mb-1" id="title">{note?.title !== '' ? note?.title : 'Untitled'}</h5>
                <small>
                    {new Date(note?.dateCreated)
                        .toLocaleDateString('en-us', { month:"short", day:"numeric" })}
                </small>
            </div>
            <div className='d-flex justify-content-between'>
                <p className="mb-1">{note?.text !== '' ? note?.text : '-'}</p>
                <small className={styles.unsavedNoteText}>
                    {String(note?.title)[0] === '﻿' ? 'Unsaved' : ''}
                </small>
            </div>
            
            {note?.id !== null && !dragging? 
                <div 
                    className={styles.removeNote 
                        + (selected.note?.id === note?.id ? " " + styles.removeNoteEntry : '')} 
                    onClick={deleteNote} 
                /> : null
            }
        </a>
    )
}

export default forwardRef(NoteBoxNote);