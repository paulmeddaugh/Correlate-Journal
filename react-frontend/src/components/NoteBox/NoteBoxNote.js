import { forwardRef } from 'react';
import styles from '../../styles/NoteBox/NoteBoxNote.module.css';

const NoteBoxNote = ({ note, index, onSelect, onSelectDrag, onSelectDrop, onDelete, selected, dragging, style }, ref) => {

    const handleClick = (e) => onSelect?.(e, note, index);
    const handleDragStart = (e) => onSelectDrag?.(e, note, index);
    const handleDrag = (e) => onSelectDrag?.(e, note, index);
    const handleDragEnd = (e) => onSelectDrop?.(e, note, index);
    const deleteNote = (e) => (() => onDelete?.(e, note, index))();

    return (
        <a 
            ref={ref}
            onClick={handleClick}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            href={`#${note?.title ?? ''}`}
            style={{ ...style, order: note?.allNotesPosition }}
            className={"list-group-item list-group-item-action flex-column align-items-start " 
                + styles.container + ' '
                + ((selected.note?.id === note?.id && !dragging) ? "active " : ' ') // Selected styling
                + (String(note?.title)[0] === '﻿' ? styles.unsavedNote + ' ' : ' ') // Unsaved note styling
                + (dragging ? styles.reordering : '')}
            data-idnotebook={note?.idNotebook}
        >
            <div className="d-flex w-30 justify-content-between">
                <h5 className="mb-1" id="title">
                    {['', '﻿'].includes(note?.title) ? 'Untitled' : note?.title}
                </h5>
                <small>
                    {new Date(note?.dateCreated).toLocaleDateString('en-us', { month:"short", day:"numeric" })}
                </small>
            </div>
            <div className='d-flex justify-content-between'>
                <p className="mb-1">
                    {note?.text !== '' ? note?.text : '-'}
                </p>
                <small className={styles.unsavedNoteText}>
                    {String(note?.title)[0] === '﻿' ? 'Unsaved' : ''}
                </small>
            </div>
            
            {note?.id !== null && !dragging ? (
                <div 
                    className={styles.removeNote }
                        // + (selected.note?.id === note?.id ? " " + styles.removeNoteEntry : '')} 
                    onClick={deleteNote} 
                />
            ) : null}
        </a>
    )
}

export default forwardRef(NoteBoxNote);