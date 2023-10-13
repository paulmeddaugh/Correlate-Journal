import { forwardRef } from 'react';
import { ListGroupItem } from 'react-bootstrap';
import styles from '../../styles/NoteBox/NoteBoxNote.module.css';

const isNoteNotSaved = (note) => String(note?.title)[0] === '﻿';
const isNoteActive = (selected, note) => selected.note?.id === note?.id;

const NoteBoxNote = ({ note, index, onSelect, onSelectDrag, onSelectDrop, onDelete, selected, dragging, style }, ref) => {

    const handleClick = (e) => onSelect?.(e, note, index);
    const handleDragStart = (e) => onSelectDrag?.(e, note, index);
    const handleDrag = (e) => onSelectDrag?.(e, note, index);
    const handleDragEnd = (e) => onSelectDrop?.(e, note, index);
    const deleteNote = (e) => (() => onDelete?.(e, note, index))();

    return (
        <ListGroupItem
            as="a"
            onClick={handleClick}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            href={`#${note?.title ?? ''}`}
            style={{ ...style, order: note?.allNotesPosition }}
            className={
                `${styles.container} `
                + `${isNoteActive(selected, note) && !dragging ? "active " : ''} ` // Selected styling
                + `${isNoteNotSaved(note) ? styles.unsavedNote : ''} `
                + `${dragging ? styles.reordering : ''}`}
                data-idnotebook={note?.idNotebook}
            ref={ref}
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
                    {isNoteNotSaved(note) ? 'Unsaved' : ''}
                </small>
            </div>
            
            {note?.id !== null && !dragging ? (
                <div className={styles.removeNote} onClick={deleteNote} />
            ) : null}
        </ListGroupItem>
    )
}

export default forwardRef(NoteBoxNote);