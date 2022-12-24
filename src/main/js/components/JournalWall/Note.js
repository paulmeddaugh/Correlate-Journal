import { useEffect, forwardRef, useRef } from 'react';
import Point from '../../scripts/notes/point';
import styles from '../../styles/JournalWall/Note.module.css';

const tackImg = require('../../resources/tack.png');

const Note = ({ noteAndIndex, onClick, onMount, isSelected, inlineStyle, isConnection }, ref) => {

    const noteRef = useRef(null);

    useEffect(() => {
        const point = (inlineStyle?.left && inlineStyle?.top) ?
            new Point(inlineStyle.left, inlineStyle.top) : null;
        const { left, top } = noteRef?.current?.getBoundingClientRect();
        onMount?.(noteAndIndex.note, noteAndIndex.index, new Point(left, top));
    }, []);

    const clicked = () => {
        const { left, top } = noteRef.current?.getBoundingClientRect();
        onClick?.(noteAndIndex.note, noteAndIndex.index, new Point(left, top));
    }

    return (
        <div 
            id={noteAndIndex.note.id}
            className={(noteAndIndex?.note.main ? styles.mainNote : styles.stickyNote) + ' '
                + (isConnection ? styles.connectionNote : '')} 
            style={inlineStyle}
            onClick={clicked}
            ref={(el) => {noteRef.current = el; ref?.(el)}}
        >
            <div className={styles.noteTitle + (isSelected ? ' ' + styles.selected : '')}>
                {noteAndIndex?.note.title}
            </div>
            <div className={`${styles.noteText} ${isConnection ? styles.connectionText : ''}`}>
                {noteAndIndex?.note.text}
            </div>
            {!isConnection && <div className={styles.connectionWallInfo}>
                Click to show connections
            </div>}
            {/* {isConnection ? (
                <img className={styles.tack} src={tackImg} />
            ): null} */}
        </div>
    )
}

export default forwardRef(Note);