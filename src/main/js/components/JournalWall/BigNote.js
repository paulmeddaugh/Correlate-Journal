import { useEffect, forwardRef } from 'react';
import styles from '../../styles/JournalWall/Note.module.css';
import bigStyles from '../../styles/JournalWall/BigNote.module.css';
import Point from '../../scripts/notes/point';

const BigNote = ({ noteAndIndex, inlineStyle, onClick, onMount, isSelected, onMouseEnter, onMouseLeave,
    noConnections, children }, ref) => {

    useEffect(() => {
        const point = (inlineStyle.left && inlineStyle.top) ? new Point(inlineStyle.left, inlineStyle.top) : null;
        onMount(noteAndIndex.note, noteAndIndex.index, point);
    }, []);

    const clicked = () => {
        const point = (inlineStyle.left && inlineStyle.top) ? new Point(inlineStyle.left, inlineStyle.top) : null;
        onClick?.(noteAndIndex.note, noteAndIndex.index, point);
    }

    return (
        <div 
            className={(noteAndIndex?.note.main ? bigStyles.mainNote : bigStyles.stickyNote)
                + ' ' + (noConnections ? bigStyles.noConnections : '')}
            style={inlineStyle}
            onClick={clicked}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            ref={ref}
        >
            <div className={bigStyles.noteDate}>
                {new Date(noteAndIndex?.note.dateCreated)
                    .toLocaleDateString('en-us', { month:"short", day:"numeric" })}
            </div>
            <div className={`${styles.noteTitle} ${bigStyles.noteTitle} ${(isSelected ? styles.selected : '')}`}>
                {noteAndIndex?.note.title}
            </div>
            <div className={bigStyles.noteText}>{noteAndIndex?.note.text}</div>
            {children}
        </div>
    )
}

export default forwardRef(BigNote);