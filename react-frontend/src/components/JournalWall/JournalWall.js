import { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { binarySearch } from '../../scripts/utility/utility';
import styles from '../../styles/JournalWall/JournalWall.module.css';
import NoteWall from "./NoteWall";
import Graph from "../../scripts/graph/graph.js";
import Point from '../../scripts/notes/point';
import Line from "./Line";
import { useFilters, useGraph, useSelected, useSetSelected, useUserOrder } from "../LoginProvider";
import { comparePositions } from "../../scripts/utility/customOrderingAsStrings";
import { useSharedState } from "../../hooks/useGlobalState";
import { WINDOW_WIDTH_TO_FILL } from "../../scripts/constants";

const MAIN_NOTE_SIZE = { width: 100, height: 100 };
const STICKY_NOTE_SIZE = { width: 100, height: 100 };
const STICKY_NOTE_WALL_WIDTH = 75; // truthfully idk

const NOTE_WALL_GAP = 475; // 435
const NOTE_WALL_X_START = 250;//'30%';
const NOTE_WALL_Y_START = window.innerHeight / 2 - 20;//'40%';

const CENTER_LINE_X_OFFSET = 0;

const JournalWall = () => {

    const graph = useGraph();
    const selected = useSelected(), setSelected = useSetSelected();
    const filters = useFilters();
    const userOrder = useUserOrder();

    const [independentNotes, setIndependentNotes] = useState([]);
    const [scrollToMap, setScrollToMap] = useState(new Map());
    const [centerPoints, setCenterPoints] = useState([]);

    const journalWallRef = useRef(null);

    const [isNoteboxPinned] = useSharedState('notebox/isPinned');

    let navigate = useNavigate();

    useEffect(() => { // Determines the notes to put as the center of the webs

        // Pulls notes from userOrder to match with custom ordering
        const arr = userOrder.map((orderObj) => graph.getVertex(orderObj.graphIndex));
        const filtersMap = {
            notebook: (note, nbId) => note.idNotebook === Number(nbId),
        };

        // Determines center notes for each NoteWall: O(n)
        let centerPointsArr = [], prevPointIndex = 0, arrLen = arr.length;
        for (let i = 0, deleteCount = 0; i < arrLen - deleteCount; i++) {

            // Base filter that the centering note either must be 'main' or have no connections
            const connSize = graph.getVertexNeighbors(userOrder[i].graphIndex).length;
            let filtered = (arr[i].main === true || !connSize) 
                ? false : true;

            // Any custom filters if not already filtered
            if (!filtered) for (let type in filters) {
                filtered = (!filtersMap[type](arr[i], filters[type]));
            }

            if (filtered) { // Removes
                arr.splice(i--, 1);
                deleteCount++;

            } else {
                // Dynamically creates centerPoint list
                const cenLen = centerPointsArr.length;
                const prevNoteConnSize = graph.getVertexNeighbors(prevPointIndex).length;
                const point = (!cenLen) ? 
                      new Point(NOTE_WALL_X_START, NOTE_WALL_Y_START) // Starting point if empty
                    : new Point(
                        centerPointsArr[cenLen - 1].x + (!prevNoteConnSize ? NOTE_WALL_GAP * .8 : NOTE_WALL_GAP), 
                        NOTE_WALL_Y_START
                    );
                centerPointsArr.push(point);
                scrollToMap.set(arr[i].id, centerPointsArr[cenLen]); // Adds point as the scrollTo point 
                arr[i] = { note: arr[i], index: prevPointIndex = i + deleteCount }; // Stores the note and index
            }
        }

        setIndependentNotes(arr.concat());
        setCenterPoints(centerPointsArr.concat());
        
    }, [graph, filters]);

    useEffect(() => {
        if (selected.scrollTo === false || !selected.note?.main) return;

        const notePoint = scrollToMap.get(selected.note?.id);

        if (!notePoint) return;

        let { width: thoughtWallWidth, height: thoughtWallHeight } = journalWallRef.current.getBoundingClientRect();

        const isNoteBoxFilled = isNoteboxPinned && (window.innerWidth < WINDOW_WIDTH_TO_FILL);
        if (isNoteBoxFilled) thoughtWallWidth = window.innerWidth;

        const noteDims = {
            width: selected.note?.main ? 0 : STICKY_NOTE_SIZE.width,
            height: selected.note?.main ? 0 : STICKY_NOTE_SIZE.height
        };

        setTimeout(() => {
            journalWallRef.current.scrollTo({
                left: notePoint.x - (thoughtWallWidth / 2) + noteDims.width / 2, 
                top: notePoint.y - (thoughtWallHeight / 2) + noteDims.height / 2,
                behavior: 'smooth' 
            });
        }, 0);
    }, [selected, journalWallRef]);

    const getCenterPoint = (i) => centerPoints[i];

    // Determines position of the lines that connect each centered, or 'independent,' note
    const lineOrigin = (i) => {
        const { x: left, y: top } = getCenterPoint(i) || {};
        return left !== undefined ? { left, top: top + CENTER_LINE_X_OFFSET } : {};
    }

    const getConnectingNotes = (userOrderIndex) => {

        // Confirms valid graphIndex value of userOrderIndex
        const graphIndex = userOrder[userOrderIndex]?.graphIndex;
        if ([undefined, null].includes(graphIndex)) return [];

        // Ids of all connections
        const connIds = graph.getVertexNeighbors(graphIndex);
        const notes = graph.getVertices();

        // Maps connection ids to live note data: O(n)
        const connectingNotes = connIds?.map(({ v }, i) => {
            // Determines note: O(log n)
            const [ connNote ] = binarySearch(notes, v.id);

            // Determines userOrderIndex: O(log n)
            const order = connNote.allNotesPosition;
            const [ , index ] = binarySearch(userOrder, order, 0, 'order', comparePositions);

            return { note: connNote, index };
        });

        return (connectingNotes) ? connectingNotes : [];
    }

    

    const onNoteMount = (note, userOrderIndex, point) => {
        // Adds the scrollPoint of each note if not already set
        if (!scrollToMap.has(note.id)) scrollToMap.set(note.id, point);
        setScrollToMap(new Map(scrollToMap));
    } 

    const onCenterNoteClick = (note, userOrderIndex, point) => {
        setTimeout(() => setSelected({ note, index: userOrder[userOrderIndex].graphIndex }), 50);
    }

    const onCenterNoteDoubleClick = (note, userOrderIndex, point) => {
        navigate('/editor');
    }

    const onConnectionClick = (note, userOrderIndex, point, bigNoteIdStack, onCloseHandler) => {

        const graphIndex = userOrder[userOrderIndex].graphIndex;

        // Scrolls to note on wall rather than create new one if 'Main' type
        if (note.main && bigNoteIdStack.length !== 0) {
            setSelected({ note, index: graphIndex });
            return;
        }

        // Smooth scrolls to the connected note
        const { width, left } = journalWallRef.current.getBoundingClientRect();
        const noteWidth = (note.main) ? MAIN_NOTE_SIZE.width : STICKY_NOTE_WALL_WIDTH;
        const absolutePointX = point.x - left + journalWallRef.current.scrollLeft + noteWidth;
        const scrollX = absolutePointX - (width / 2);
        journalWallRef.current.scrollTo({ left: scrollX, behavior: 'smooth' });

        // Generates a NoteWall with the connected note as the center
        return (
            <NoteWall 
                noteAndIndex={{ note: graph.getVertex(graphIndex), index: graphIndex }}
                centerPoint={new Point(absolutePointX, NOTE_WALL_Y_START)}
                connectingNotes={getConnectingNotes(userOrderIndex)}
                onNoteMount={onNoteMount}
                onNoteClick={onCenterNoteClick}
                onNoteDoubleClick={onCenterNoteDoubleClick}
                onConnectionClick={onConnectionClick}
                originBigNoteIdStack={bigNoteIdStack}
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