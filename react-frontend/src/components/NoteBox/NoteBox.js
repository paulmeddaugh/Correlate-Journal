import { useEffect, useRef, useState } from 'react';
import styles from '../../styles/NoteBox/NoteBox.module.css';
import NoteBoxNote from './NoteBoxNote';
import CustomSelect from './CustomSelect';
import { binarySearch } from '../../scripts/utility/utility';
import axios from 'axios';

const pinSrc = require("../../resources/unpinIcon.jpg");
const unpinSrc = require("../../resources/unpinIcon2.png");
const filterIcon = require("../../resources/filterIcon.png");

const NoteBox = ({ graphState: [graph, setGraph], notebooksState: [notebooks, setNotebooks], 
    selectedState: [selected, setSelected], onNotebookSelect }) => {

    const [areSearchResults, setSearchResults] = useState(true);
    const [customSelectValues, setCustomSelectValue] = useState({
        innerHTML: 'All Notebooks',
        'data-id': null,
    });

    const infobox = useRef(null);
    const listGroupFlush = useRef(null);
    const searchInput = useRef(null);
    const noNotes = useRef(null);

    const pinIcon = useRef(null);

    useEffect(() => {
        setSearchResults(graph.getVertices()?.length === 0 ? false : true);
    }, [graph]);

    const unpin = () => {
        infobox.current.style.width = '0px';
        pinIcon.current.style.display = 'block'; // makes visible

        setTimeout(() => { // Allows transition effect first
            infobox.current.style.position = 'absolute';
            infobox.current.style.right = '100%';
        }, 1000);
    };

    const pin = () => {
        infobox.current.style.width = '300px';
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

    const onSelectNote = (note, index) => {
        setSelected({ note: note, index: index });
    };

    const onDeleteNote = (note, index) => {
        // Delete from backend
        if (note.id >= 0) axios.delete('/api/notes/' + note.id + '/delete').then((response) => {
            console.log(response);
        });

        // Delete on frontend: O(1)
        graph.removeVertex(index);
        setGraph(graph.clone());

        // Resets selected note if deleted
        if (note.id === selected.note.id) {
			const i = (selected.index - 1 >= 0) ? selected.index - 1 : -1;
            const n = graph.getVertex(i);
			setSelected({ note: n, index: i });
		}
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

    return (
        <div id={styles.leftBox}>
            <div id={styles.infobox} ref={infobox}>
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

                    {graph.getVertices()?.reduce((prev, note, i, arr) => {
                        const comp = 
                            (<NoteBoxNote 
                                note={note} 
                                key={i}
                                index={i}
                                selected={selected}
                                onSelect={onSelectNote}
                                onDelete={onDeleteNote}
                            />);

                        if (note.id < 0) { // places newly created notes at beginning of array, 
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
        </div>
    );
}

export default NoteBox;