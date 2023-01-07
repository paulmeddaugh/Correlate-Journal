import { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { binarySearch } from '../../scripts/utility/utility';
import styles from '../../styles/JournalWall/JournalWall.module.css';
import NoteWall from "./NoteWall";
import Graph from "../../scripts/graph/graph.js";
import Point from '../../scripts/notes/point';
import Line from "./Line";

const MAIN_NOTE_SIZE = { width: 100, height: 100 };
const STICKY_NOTE_SIZE = { width: 100, height: 100 };

const NOTE_WALL_GAP = 475; // 435
const NOTE_WALL_X_START = 250;//'30%';
const NOTE_WALL_Y_START = window.innerHeight / 2 - 20;//'40%';

const CENTER_LINE_X_OFFSET = 0;

const JournalWall = ({ graph, selectedState: [selected, setSelected], filters }) => {

    const [notes, setNotes] = useState([]);
    const [independentNotes, setIndependentNotes] = useState([]);
    const [scrollToMap, setScrollToMap] = useState(new Map());
    const [centerPoints, setCenterPoints] = useState([]);

    const journalWallRef = useRef(null);

    let navigate = useNavigate();

    useEffect(() => {
        // Determine notes to put as center of spider web: 'main' type and 'sticky' with no connections 
        setNotes(graph.getVertices());

        const arr = graph.getVertices();
        const filtersMap = {
            notebook: (note, nbId) => note.idNotebook === Number(nbId),
        };

        // Determines the center notes for each NoteWall: O(n)
        let centerPointsArr = [], prevPointIndex = 0, arrLen = arr.length;
        for (let i = 0, deleteCount = 0; i < arrLen - deleteCount; i++) {

            // Base filter that the centering note either must be 'main' or have no connections
            let filtering = (arr[i].main === true || graph.getVertexNeighbors(i).length === 0) 
                ? false : true;

            // Any selected custom filters
            if (!filtering) for (let type in filters) {
                filtering = (!filtersMap[type](arr[i], filters[type]));
            }

            if (filtering) {
                arr.splice(i--, 1);
                deleteCount++;
            } else {
                // Dynamically creates centerPoint list
                const cenLen = centerPointsArr.length;
                centerPointsArr.push((cenLen === 0) 
                    ? new Point(NOTE_WALL_X_START, NOTE_WALL_Y_START) // Starting point if empty
                    : new Point(centerPointsArr[cenLen - 1].x + // Determines next from the last
                        (graph.getVertexNeighbors(prevPointIndex).length === 0 ? NOTE_WALL_GAP * .8 : NOTE_WALL_GAP),
                        NOTE_WALL_Y_START
                ));
                prevPointIndex = i + deleteCount;
                scrollToMap.set(arr[i].id, centerPointsArr[cenLen]); // Adds point as the scrollTo point 
                arr[i] = { note: arr[i], index: i + deleteCount }; // Stores the note and index
            }
        }

        setIndependentNotes(arr.concat());
        setCenterPoints(centerPointsArr.concat());
        
    }, [graph, filters]);

    useEffect(() => {
        if (selected.scrollTo === false) return;

        const point = scrollToMap.get(selected.note?.id);
        const width = journalWallRef.current.getBoundingClientRect().width;
        if (point) {
            setTimeout(() => {
                journalWallRef.current.scrollTo({ left: point.x - (width / 2), behavior: 'smooth' });
            }, 0);
        }
    }, [selected, journalWallRef]);

    const getCenterPoint = (i) => centerPoints[i];

    // Determines position of the lines that connect each centered, or 'independent,' note
    const lineOrigin = (i) => {
        const { x: left, y: top } = getCenterPoint(i) || {};
        return left !== undefined ? { left, top: top + CENTER_LINE_X_OFFSET } : {};
    }

    const getConnectingNotes = (graphIndex) => {
        const ids = graph.getVertexNeighbors(graphIndex); // Id's of each connection

        // Maps id's to objects with the live note data and its index
        const connectingNotes = (notes) ? ids?.map(({ v }, i) => {
            const results = binarySearch(notes, v.id);
            return { note: results[0], index: results[1] };
        }) : null;
        return (connectingNotes) ? connectingNotes : [];
    }

    const onNoteMount = (note, index, point) => {
        // Adds the scrollPoint of each note if not already set
        if (!scrollToMap.has(note.id)) scrollToMap.set(note.id, point);
        setScrollToMap(new Map(scrollToMap));
    } 

    const onCenterNoteClick = (note, index, point) => {
        setTimeout(() => setSelected({ note, index }), 50);
    }

    const onCenterNoteDoubleClick = (note, index, point) => {
        navigate('/editor');
    }

    const onConnectionClick = (note, index, point, centerNote, onCloseHandler) => {

        // Smooth scrolls to the connected note
        const { width, left } = journalWallRef.current.getBoundingClientRect();
        const noteWidth = (note.main) ? MAIN_NOTE_SIZE.width : STICKY_NOTE_SIZE.width;
        const absolutePointX = point.x - left + journalWallRef.current.scrollLeft + noteWidth;
        const scrollX = absolutePointX - width / 2;
        journalWallRef.current.scrollTo({ left: scrollX, behavior: 'smooth' });

        // Generates a NoteWall with the connected note as the center
        return (
            <NoteWall 
                noteAndIndex={{ note: graph.getVertex(index), index }}
                centerPoint={new Point(absolutePointX, NOTE_WALL_Y_START)}
                connectingNotes={getConnectingNotes(index)}
                onNoteMount={onNoteMount}
                onNoteClick={onCenterNoteClick}
                onNoteDoubleClick={onCenterNoteDoubleClick}
                onConnectionClick={onConnectionClick}
                isConnectionWall={true}
                selected={selected}
                extendBoundaryBy={75}
                isCloseable={onCloseHandler ? true : false}
                onClose={onCloseHandler ? onCloseHandler : null}
            />
        );
    };

    return (
        <div className={styles.main} ref={journalWallRef}>
            {independentNotes?.map((noteAndIndex, i) => getCenterPoint(i) ? (
                <Fragment key={i}>
                    <Line 
                        length={i !== independentNotes.length - 1 ? NOTE_WALL_GAP : 200} 
                        rotateOrigin={lineOrigin(i)} 
                        animation={false}
                        color={i !== independentNotes.length - 1 ? '#9a2e30' : 'transparent'}
                        thickness={3}
                    />
                    <NoteWall 
                        noteAndIndex={noteAndIndex}
                        centerPoint={getCenterPoint(i)}
                        connectingNotes={getConnectingNotes(noteAndIndex.index)}
                        onNoteMount={onNoteMount}
                        onNoteClick={onCenterNoteClick}
                        onNoteDoubleClick={onCenterNoteDoubleClick}
                        onConnectionClick={onConnectionClick}
                        tabIndex={100 + i}
                        selected={selected}
                    />
                </Fragment>
            ) : null)}
        </div>
    )
}

export default JournalWall;