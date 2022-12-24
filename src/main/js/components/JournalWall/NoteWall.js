import { Fragment, useEffect, useRef, useState } from "react";
import styles from '../../styles/JournalWall/NoteWall.module.css';
import BigNote from './BigNote';
import Note from "./Note";
import Line from "./Line";
import { binarySearch } from "../../scripts/utility/utility";

const CONNECTIONS_DISTANCE = 175;

const NOTE_CENTER_MAIN_X = 100 / 2;
const NOTE_CENTER_MAIN_Y = 125 / 2;
const NOTE_CENTER_STICKY_X = 100 / 2;
const NOTE_CENTER_STICKY_Y = 100 / 2;
const BIG_NOTE_MAIN_HOVER_WIDTH = 175;
const BIG_NOTE_STICKY_HOVER_WIDTH = 175;
const BIG_NOTE_MAIN_HOVER_HEIGHT = 219;
const BIG_NOTE_STICKY_HOVER_HEIGHT = 175;

const NoteWall = ({ noteAndIndex, centerPoint, connectingNotes, onMount, extendBoundaryBy,
    onConnectionClick, onNoteClick, onNoteMount, selected, isConnectionWall, isCloseable, onClose }) => {

    const [bigNoteAnimation, setBigNoteAnimation] = useState(0);
    const noteWallRef = useRef(null);
    const bigNoteRef = useRef(null);
    const noteRefs = useRef([]);
    const [connectionWall, setConnectionWall] = useState(null);

    useEffect(() => {
        onMount?.();
        noteWallRef.current.focus();
    }, []);

    const boundaryInline = () => ({
        width: BIG_NOTE_MAIN_HOVER_WIDTH + CONNECTIONS_DISTANCE + (extendBoundaryBy ?? 0),
        height: BIG_NOTE_MAIN_HOVER_HEIGHT + CONNECTIONS_DISTANCE + (extendBoundaryBy ?? 0),
        left: centerPoint.x,
        top: centerPoint.y
    });

    const bigNoteInlineStyle = () => {
        return (!bigNoteAnimation) ? {} : {
            width: noteAndIndex?.note.main ? BIG_NOTE_MAIN_HOVER_WIDTH : BIG_NOTE_STICKY_HOVER_WIDTH,
            height: noteAndIndex?.note.main ? BIG_NOTE_MAIN_HOVER_HEIGHT : BIG_NOTE_STICKY_HOVER_HEIGHT,
            border: '1px solid',
            opacity: .95,
        };
    }

    const connectingNoteInlineStyle = (i) => {

        // First appearance (val = 0): JS to randomly rotate each note slightly left or right 
        if (!bigNoteAnimation) {
            return {
                rotate: (Math.floor(Math.random() * 2) ? '' : '-') + '1deg',
            };
        }

        // Hover over beginning position (val = 1): 
        if (bigNoteAnimation === 1 && noteRefs.current.length) {
            // Places replacing Note components at the same Note's last position in first appearance
            if (noteRefs.current[i].style?.top === '') {
                if (noteRefs.current[i].id) {
                    const { left: noteLeft, top: noteTop } = noteRefs.current[i].getBoundingClientRect();
                    const { left: parentLeft, top: parentTop } = noteWallRef.current.getBoundingClientRect();
                    noteRefs.current[i] = { // Replaces ref with its last position styling
                        left: noteLeft - parentLeft + NOTE_CENTER_MAIN_X, 
                        top: noteTop - NOTE_CENTER_MAIN_Y,
                    };
                }

                // Triggers ending position styling (animated with css transition)
                setTimeout(() => {
                    if (bigNoteAnimation === 1) setBigNoteAnimation(2);
                    noteRefs.current = [];
                }, 5);
            }

            return noteRefs.current[i];

        // Hover over ending position (val = 2)
        } else {
            const angle = getLineAngle(i);
            const noteWallCenter = getNoteWallCenter();
            
            return {
                left: noteWallCenter.left + CONNECTIONS_DISTANCE * Math.cos(angle),
                top: noteWallCenter.top + CONNECTIONS_DISTANCE * Math.sin(angle)
            };
        }
    };

    const getLineAngle = (i) => (Math.PI * 2 / connectingNotes.length) * i - Math.PI / 2;

    const getNoteWallCenter = () => {
        const { width: parentWidth, height: parentHeight } = noteWallRef.current.getBoundingClientRect();
        return {
            left: parentWidth / 2,
            top: parentHeight / 2,
        }
    }

    const onConnectionClicked = (n, i, p) => {
        const wall = onConnectionClick(n, i, p, noteAndIndex.note, () => setConnectionWall(null)); 
        if (wall) setConnectionWall(wall);
    }

    const onBlur = () => {
        setConnectionWall(null);
    }

    if (bigNoteAnimation) {
        return (
            <>
                <div 
                    className={`${styles.noteWallBoundary} ${(isConnectionWall) ? styles.connectionNoteWall : ''}`} 
                    style={boundaryInline()} 
                    onBlur={onBlur}
                    tabIndex={centerPoint.x + noteAndIndex.note.id}
                    onMouseLeave={() => setBigNoteAnimation(0)}
                    ref={noteWallRef}
                >
                    <BigNote 
                        noteAndIndex={noteAndIndex} 
                        inlineStyle={bigNoteInlineStyle()} 
                        onClick={onNoteClick}
                        onMount={onNoteMount}
                        onMouseEnter={() => setBigNoteAnimation(1)}
                        onMouseLeave={connectingNotes?.length === 0 ? () => setBigNoteAnimation(0) : null}
                        isSelected={selected?.note.id === noteAndIndex.note.id}
                        noConnections={connectingNotes?.length === 0}
                        ref={bigNoteRef}
                    />
                    {connectingNotes.map((noteAndIndex, i) => (
                        <Fragment key={100 + i}>
                            <Note 
                                noteAndIndex={noteAndIndex}
                                inlineStyle={connectingNoteInlineStyle(i)}
                                onClick={onConnectionClicked}
                                onMount={onNoteMount}
                                isSelected={selected?.note.id === noteAndIndex.note.id}
                                isConnection={false}
                            />
                            <Line 
                                angle={getLineAngle(i)} 
                                length={CONNECTIONS_DISTANCE}
                                color={'white'}
                                rotateOrigin={getNoteWallCenter()}
                                animation={false}
                                fadeIn={true}
                            />
                        </Fragment>
                    ))}
                    {isCloseable && <div className={styles.closeButton} onClick={onClose}>X</div>}
                </div>

                {!!connectionWall && connectionWall}
            </>
        )
    }

    return (
        <>
            <div 
                className={`${styles.noteWallBoundary} ${(isConnectionWall) ? styles.connectionNoteWall : ''}`} 
                style={boundaryInline()}
                ref={noteWallRef}
                onMouseLeave={() => setBigNoteAnimation(0)}
            >
                <BigNote 
                    noteAndIndex={noteAndIndex} 
                    inlineStyle={bigNoteInlineStyle()} 
                    onClick={onNoteClick}
                    onMount={onNoteMount}
                    onMouseEnter={() => setBigNoteAnimation(1)}
                    isSelected={selected?.note.id === noteAndIndex.note.id}
                    noConnections={connectingNotes?.length === 0}
                    ref={bigNoteRef}
                >
                    {connectingNotes.length >= 1 ? (
                        <div className={styles.bigNoteTop} id='bigNoteTop'>
                            {connectingNotes.slice(0, Math.ceil(connectingNotes.length / 2)).map((noteAndIndex, i) => (
                                <Note 
                                    noteAndIndex={noteAndIndex}
                                    inlineStyle={connectingNoteInlineStyle(i)}
                                    onClick={onConnectionClicked}
                                    onMount={onNoteMount}
                                    isSelected={selected?.note.id === noteAndIndex.note.id}
                                    isConnection={true}
                                    ref={(el) => {
                                        if (el && !binarySearch(noteRefs.current, el.id)[0]) 
                                        noteRefs.current.push(el)
                                    }}
                                    key={200 + i} 
                                />
                            ))}
                            <div className={styles.connectionLabel}>
                                ---------------- Connections
                            </div>
                        </div>
                    ) : null}
                    {connectingNotes.length === 0 ? (
                        null
                    ) : connectingNotes.length === 1 ? (
                        null
                    ) : connectingNotes.length >= 2 ? (
                        <div className={styles.bigNoteBottom} id='bigNoteBottom'>
                            {connectingNotes.slice(Math.ceil(connectingNotes.length / 2)).map((noteAndIndex, i) => (
                                <Note 
                                    noteAndIndex={noteAndIndex}
                                    inlineStyle={connectingNoteInlineStyle(i + connectingNotes.length / 2)}
                                    onClick={onConnectionClicked}
                                    onMount={onNoteMount}
                                    isSelected={selected?.note.id === noteAndIndex.note.id}
                                    isConnection={true}
                                    ref={(el) => {if (el && !binarySearch(noteRefs, el.id)[0]) noteRefs.current.push(el)}}
                                    key={300 + i} 
                                />
                            ))}
                            <div className={`${styles.connectionLabel} ${styles.connectionLabelBottom}`}>
                                ---------------- Connections
                            </div>
                        </div>
                    ) : null}
                </BigNote>
                {isCloseable && <div className={styles.closeButton} onClick={onClose}>X</div>}
            </div>

            {!!connectionWall && connectionWall}
        </>
    )
}

export default NoteWall;