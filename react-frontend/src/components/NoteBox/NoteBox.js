import { useEffect, useRef, useState } from 'react';
import styles from '../../styles/NoteBox/NoteBox.module.css';
import NoteBoxNote from './NoteBoxNote';
import CustomSelect from './CustomSelect';
import { binarySearch } from '../../scripts/utility/utility';
import axios from 'axios';
import Notebook from '../../scripts/notes/notebook'
import ReorderingLine from './ReorderingLine';
import { comparePositions } from '../../scripts/utility/customOrderingAsStrings';

const NOTEBOX_WIDTH = window.innerWidth < 450 ? window.innerWidth + 1 : 301;

const pinSrc = require("../../resources/unpinIcon.jpg");
const unpinSrc = require("../../resources/unpinIcon2.png");
const filterIcon = require("../../resources/filterIcon.png");

const NoteBox = ({ userId, graphState: [graph, setGraph], userOrderState: [userOrder, setUserOrder],
    notebooksState: [notebooks, setNotebooks], selectedState: [selected, setSelected], 
    onNotebookSelect, pinned,  }) => {

    const [areSearchResults, setSearchResults] = useState(true);
    const [customSelectValues, setCustomSelectValue] = useState({
        innerHTML: 'All Notebooks',
        'data-id': null,
    });

    // For reordering notes in a user-defined order
    const [reorderingNoteProps, setReorderingNoteProps] = useState(null); // { note, index, noteArrRefs }
    const [reorderingNotePoints, setReorderingNotePoints] = useState({}); // { dragPoint, snapPoint }
    const reorderingNoteRef = useRef(null);
    const snapIndex = useRef(0); // The index in the graph the user is reordering reorderingNoteProps.note to

    const infobox = useRef(null);
    const listGroupFlush = useRef(null);
    const noteBoxNoteRefs = useRef(new Set());
    const searchInput = useRef(null);
    const noNotes = useRef(null);

    const pinIcon = useRef(null);

    useEffect(() => {
        if (pinned === false) unpin();
    }, []); 

    useEffect(() => {
        setSearchResults(graph.getVertices()?.length === 0 ? false : true);
    }, [graph]);

    const unpin = (animate = true) => {
        infobox.current.style.width = '0px';
        pinIcon.current.style.display = 'block'; // makes visible

        const finalPosition = () => {
            infobox.current.style.position = 'absolute';
            infobox.current.style.right = '100%';
        }

        if (animate) {
            setTimeout(() => finalPosition(), 1000); // Allows transition effect first
        } else {
            finalPosition();
        }
    };

    const pin = () => {
        infobox.current.style.width = NOTEBOX_WIDTH + 'px';
        infobox.current.style.position = 'unset';
        pinIcon.current.style.display = 'none'; // makes invisible
    };

    const searchInputChange = () => {
        let anyNotes = false;
        const notesInBox = listGroupFlush.current.children;
        for (let i = 1; i < notesInBox.length; i++) {

            const idSelectedNb = customSelectValues['data-id'];
            const idNotebook = notesInBox[i].getAttribute('data-idnotebook');
            const regex = new RegExp(searchInput.current.value, 'i');
            const isMatching = notesInBox[i].children[0].children[0].innerHTML.match(regex) || // in title
            notesInBox[i].children[1].innerHTML.match(regex); // or text

            if (isMatching && (!idSelectedNb || idSelectedNb === idNotebook)) {
                notesInBox[i].style.display = "block";
                anyNotes = true;
            } else {
                notesInBox[i].style.display = "none";
            }
        }

        setSearchResults(anyNotes);
    };

    const onSelectNote = (e, note, index) => {
        setSelected({ note: note, index: index });
    };

    /**
     * 
     * 
     * @param {*} e The 'dragstart' and 'drag' events.
     * @param {*} note The note object of the NoteBoxNote being dragged.
     * @param {number} index The index of the note object of the NoteBoxNote in the graph.
     */
    const onSelectDrag = (e, note, index) => {

        const arr = (reorderingNoteProps !== null) ? // if noteArrRefs state hasn't been init yet
            reorderingNoteProps.noteArrRefs : getNoteBoxNoteRefs();

        if (e.type === "dragstart") {
            const { halfWidth, halfHeight } = getDraggingNoteBoxNoteHalfDimensions(arr);
            setReorderingNoteProps({ 
                note, 
                index, 
                noteArrRefs: Array.from(noteBoxNoteRefs.current),
                halfWidth,
                halfHeight
            });
            snapIndex.current = index;
        }

        // Determines duplicated component dragPoint
        const { halfWidth, halfHeight } = (reorderingNoteProps !== null) ? 
            reorderingNoteProps : getDraggingNoteBoxNoteHalfDimensions(arr);
        const dragPoint = { left: e.clientX - halfWidth, top: e.clientY - halfHeight };
        
        /* Determines snapPoint */ 
        const arrAppropSnapIndex = snapIndex.current === -1 ? 0 : snapIndex.current;
        const { left, top, height } = arr[arrAppropSnapIndex].getBoundingClientRect(); // current NoteBoxNote

        // Checks if mouse is closer to another snapPoint
        let snapDistance, snapHeight = (snapIndex.current !== -1 ? height : 0);
        if (Math.abs(snapDistance = e.clientY - (top + snapHeight)) > halfHeight) {
            const noteBelow = snapDistance > 0;

            // Skips if new snapIndex will go out of bounds
            if (!(noteBelow && snapIndex.current === arr.length - 1) && !(!noteBelow && snapIndex.current === -1)) {
                if (noteBelow) { snapIndex.current++; } else { snapIndex.current--; }
                const { top, height } = arr[arrAppropSnapIndex].getBoundingClientRect();
                snapHeight = (snapIndex.current !== -1 ? height : 0);
            }
        }

        const snapPoint = { left , top: top + snapHeight };
        setReorderingNotePoints({ dragPoint, snapPoint });

        function getNoteBoxNoteRefs () {
            return Array.from(noteBoxNoteRefs.current);
        }

        function getDraggingNoteBoxNoteHalfDimensions (arr) {
            return {
                halfWidth: infobox.current.getBoundingClientRect().width / 2,
                halfHeight: arr[index].getBoundingClientRect().height / 2,
            };
        }
    };

    const onSelectDrop = (e, note, index) => {
        console.log('dropping');
        setReorderingNoteProps(null);


    };

    const onDeleteNote = (e, note, index) => {

        if (!window.confirm("Are you sure you want to delete note \"" + note.title + "\"?")) {
            return;
        }

        // Delete from backend
        if (note.id >= 0) axios.delete('/api/notes/' + note.id + '/delete');

        // Delete on frontend: O(1)
        graph.removeVertex(index);
        setGraph(graph.clone());

        // Resets selected note if deleted
        if (note.id === selected.note.id) {
			const i = (selected.index - 1 >= 0) ? selected.index - 1 : -1;
			setSelected({ note: graph.getVertex(i), index: i });
		}

        e.stopPropagation();
    }

    const onSelectNotebook = (innerHTML, value, id) => {
        let anyNotes = false;
        for (let i = 1, notesInBox = listGroupFlush.current.children; i < notesInBox.length; i++) {
            if ((notesInBox[i].getAttribute('data-idnotebook') === id) || (!id)) {
                notesInBox[i].style.display = 'block';
                anyNotes = true;
            } else {
                notesInBox[i].style.display = 'none';
            }
        }

        noNotes.current.style.display = (!anyNotes) ? 'block' : 'none';
        setCustomSelectValue({ innerHTML: innerHTML, 'data-id': id });

        onNotebookSelect?.({ name: innerHTML, id });
    }

    // Handler for the onRemove prop of the customized select for notebooks
    const onDeleteNotebook = (notebook) => {

        // Deletes on backend
        axios.delete('/api/notebooks/' + notebook.id + '/delete').then((response) => {
            console.log(response);
        });

        // Deletes notebook: O(log n) time
        const id = notebook.id, [, index] = binarySearch(notebooks, id, 1);
        notebooks.splice(index, 1);
        setNotebooks(notebooks);

        // Deletes notes in notebook: O(n) time
        for (let note of graph.getVertices()) {
            if (note.idNotebook === id) {
                graph.removeVertex(note);
            }
        }
        setGraph(graph.clone());
    };

    const onAddNotebook = () => {
        const name = window.prompt("Please enter the name of the notebook you would like to add.");
        const nb = { name, idUser: userId, dateCreated: new Date() };

        axios.post('/api/notebooks/new', nb).then((response) => {
            console.log(response);
            
            notebooks.push(new Notebook(response.data.id, nb.name));
            setNotebooks(notebooks);

            alert(`Notebook '${nb.name}' created.`);
        });
    }

    return (
        <div id={styles.noteBox}>
            <div id={styles.infobox} style={{ width: NOTEBOX_WIDTH }} ref={infobox}>
                <div id={styles.searchBar} className={styles.configs}>
                    <label id={styles.searchLabel} htmlFor="searchInput">Search:&nbsp;</label>
                    <input 
                        type="text" 
                        list='noteOptions'
                        id={styles.searchInput} 
                        placeholder="by title, text"
                        onChange={searchInputChange}
                        ref={searchInput}
                    />
                    <datalist id='noteOptions'>
                        {graph.getVertices()?.map((note, index) => (
                            <option value={note.title} key={index}>
                                {note.title}
                            </option>
                        ))}
                    </datalist>
                    {/* <div id={styles.filter}>
                        <img src={filterIcon} alt="filter" />
                    </div> */}
                    <div id={styles.unpin} onClick={unpin}>
                        <img src={unpinSrc} alt="unpin" />
                    </div>
                </div>
                <CustomSelect
                    items={notebooks}
                    onSelect={onSelectNotebook}
                    onDeleteClick={onDeleteNotebook}
                    onAddClick={onAddNotebook}
                    defaultValues={customSelectValues}
                />
                <div id={styles.noteContainer} className="list-group list-group-flush" ref={listGroupFlush}>
                    <div 
                        id={styles.noNotes} 
                        className={areSearchResults ? styles.searchResults : styles.noSearchResults}
                        ref={noNotes}
                    >
                        No notes found. 
                    </div>

                    {userOrder.concat().reduce((prev, orderObj, i, arr) => {
                        const comp = 
                            (<NoteBoxNote 
                                key={i}
                                note={graph.getVertex(orderObj.index)}
                                index={i}
                                ref={(el) => {if (el) noteBoxNoteRefs.current.add(el)}}
                                selected={selected}
                                onSelect={onSelectNote}
                                onSelectDrag={onSelectDrag}
                                onSelectDrop={onSelectDrop}
                                onDelete={onDeleteNote}
                            />);

                        if (orderObj.id < 0) { // places newly created notes at beginning of array, 
                            arr.splice(i, 1); // maintaining O(n)
                            arr.unshift(comp);
                        } else {
                            arr[i] = comp;
                        }

                        return arr;
                    }, [])}
                </div>
            </div>
            <div id={styles.pin} onClick={pin} ref={pinIcon}>
                <span> Notes </span>
                <img src={pinSrc} alt="pin" />
            </div>
            <div id={styles.reorderingNoteContainer}>
                {!!reorderingNoteProps && <NoteBoxNote
                    ref={reorderingNoteRef}
                    note={reorderingNoteProps.note}
                    index={reorderingNoteProps.index}
                    selected={selected}
                    dragging={true}
                    style={reorderingNotePoints.dragPoint}
                />}
                {!!reorderingNoteProps && <ReorderingLine 
                    absoluteCoordinates={reorderingNotePoints.snapPoint}
                />}
            </div>
        </div>
    );
}

export default NoteBox;