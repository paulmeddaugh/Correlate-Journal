import { useEffect, useRef, useState } from 'react';
import { useUnmount, binarySearch, binaryInsert } from '../../scripts/utility/utility';
import styles from '../../styles/Editor/Editor.module.css';
import axios from 'axios';
import Note from '../../scripts/notes/note.js';
import Notebook from '../../scripts/notes/notebook';
import EditorConnection from './EditorConnection';
import AddConnection from './AddConnection';

const automaticallySave = false;

const notebookIcon = require("../../resources/notebook.jfif");

const Editor = ({ selectedState: [{ note, index }, setSelected], userId, onMount,
	graphState: [graph, setGraph], notebooksState: [notebooks, setNotebooks]}) => {

	const [noteInEditor, setNoteInEditor] = useState(new Note());
	const [noteInEditorIndex, setNoteInEditorIndex] = useState(-1);

	const [notebookName, setNotebookName] = useState('');
	const [connections, setConnections] = useState([]);

	const [initialGraphValues, setInitialGraphValues] = useState({ loadedSize: false, highestId: 0 });

	const dataListRef = useRef(null);
	const titleRef = useRef(null);
	const textRef = useRef(null);

	useEffect(() => { // Stores initial graph values for retrieving live connecting notes algorithm
		// Skips component first mounting
		if (initialGraphValues.loadedSize === false && graph.size() === 0) {
			setInitialGraphValues({ loadedSize: true, highestId: 0 });

		// Initializes values
		} else if (typeof initialGraphValues.loadedSize === 'boolean') {
			
			const index = graph.getVertex(graph.size() - 1)?.id === -1 
				? graph.size() - 1 // Add Note button clicked, which just added a new note before mounting
				: graph.size(); // Navigated otherwise

			setInitialGraphValues({ 
				loadedSize: index, 
				highestId: (index === 0) ? 0 : graph.getVertex(index - 1).id,
			});

		// Updates loadedSize when notes are removed from graph
		} else if (initialGraphValues.loadedSize !== 0 && 
			graph.getVertex(initialGraphValues.loadedSize - 1)?.id !== initialGraphValues.highestId) {

			let size = initialGraphValues.loadedSize;
			while (graph.getVertex(size - 1)?.id !== initialGraphValues.highestId && size >= 0) {
				size -= 1;
			}
			setInitialGraphValues({ loadedSize: size, highestId: initialGraphValues.highestId });
		}
	}, [graph]);

	useEffect(() => { // Updates editor values when a different note is selected
		if (note) {
			setNoteInEditor(new Note(
				note?.id ? note.id : null,
				note?.title ? note.title : '',
				note?.text ? note.text : '',
				note?.quotes ? note.quotes : '',
				note?.idNotebook ? note.idNotebook : -1,
				note?.main ? note.main : false,
				note?.dateCreated ? note.dateCreated : null,
			));
			setNoteInEditorIndex(index);
			setNotebookName(getNotebookName(note?.idNotebook) ?? '');
			setConnections(graph.getVertexNeighbors(index)); // Format - [ { v: { id: _ } weight: _ }, etc. ]
		}
	}, [note, index, dataListRef]);

	useUnmount(() => { // Prompts user to save note if has been edited
		if (note?.id && noteInEditor?.id && graph.indexOf(noteInEditor) !== -1) updateOnBackFront();
	}, [note]);

	useUnmount(() => { // Removes any unsaved and unedited notes
		if (initialGraphValues.loadedSize === false) return;

		const notes = graph.getVertices().splice(initialGraphValues.loadedSize);
		for (let i = notes.length - 1; i >= 0; i--) {
			if (note.id < 0 && note.title === '' && note.text === '' && note.quotes === '') {
				graph.removeVertex(initialGraphValues.loadedSize + i);
			}
		}
		setGraph(graph.clone());
	}, []);

	useEffect(() => {
		onMount?.();
		titleRef.current.focus();
	}, []);

	const updateOnBackFront = (e) => {

		// Determines notebook id if existant
		let { id: notebookId } = notebooks.find((nb) => nb.name === notebookName) || { id: null };

		const hasChanged = JSON.stringify(graph.getVertex(noteInEditorIndex)) !==
			JSON.stringify({ ...noteInEditor, idNotebook: notebookId ?? null });
			console.log(JSON.stringify(graph.getVertex(noteInEditorIndex)));
			console.log(JSON.stringify({ ...noteInEditor, idNotebook: notebookId }));
			console.log(hasChanged);

		if (hasChanged && !e) {

			// // Connections
			// const prevConns = graph.getVertexNeighbors(unsavedNote);
			// const [newConns, removeConns] = getAddedAndRemovedConnections(prevConns);
			// updateConnectionsOnFront(unsavedNote.id, newConns, removeConns);

			if (!automaticallySave && !window.confirm(`Would you like to save note '${noteInEditor.title}'?`)) {
				const note = graph.getVertex(noteInEditorIndex);
				note.title = note.title.slice(1); // Removes '﻿' character that indicates unsaved

				graph.updateVertex(note);
				setGraph(graph.clone());
				return false;
			}

		} else if (!hasChanged && !e) { // No changes made and different note selected
			return false;
		}

		if (notebookName === '') {
			window.alert("A notebook must be selected.");
			return false;
		}

		let alertMessage = '';

		createNotebookIfNotExists({ id: notebookId, name: notebookName })
			.then((notebook) => {
				if (notebook.id !== notebookId) {
					alertMessage = `Notebook '${notebookName}' created.`;
					notebookId = notebook.id;
				}
				updateAddNote();
			})
			.catch(() => {
				return false;
			});

		function updateAddNote () {

			const title = String(noteInEditor.title);
			let updatingNote = { 
				...noteInEditor, 
				title: (title[0] === '﻿') ? title.slice(1) : title,
				idNotebook: Number(notebookId),
			};

			if (note?.id < 0) { // Adding a note

				updatingNote.idUser = userId; // Add to backend first to get new note 'id'
				console.log('noteforbackend:', updatingNote);
				axios.post('/api/notes/new', updatingNote).then((response) => {

					console.log(response); // Add note to frontend
					let idUser;
					({ idUser, ...updatingNote } = { ...updatingNote, id: response.data.id });
					console.log('noteForFrontend', updatingNote);

					graph.removeVertex(graph.indexOf(noteInEditor));
					graph.addVertex(updatingNote);
					
					// Add connections to back and front
					const connectionIds = connections.map((conn) => conn.v.id);
					addConnectionsOnBackend(updatingNote.id, connectionIds, userId);

					for (let conn of connections) { 
						graph.addEdge(updatingNote, conn.v);
					}
					setGraph(graph.clone());

					// Only updates state if button clicked (not if other note selected)
					if (e) {
						console.log(updatingNote);
						setNoteInEditor(updatingNote);
						setSelected({ note: updatingNote, index: index });
					}

					alertMessage += ((alertMessage) ? '\n' : '') + `Note '${updatingNote.title}' created.`;
					alert(alertMessage);
				});

			// Updating a note
			} else {
				// On frontend (note)
				if (e) {
					setNoteInEditor(updatingNote); // Only updates if button clicked (not other note selected)
					setSelected({ note: updatingNote, index: index });
				}
				graph.updateVertex(updatingNote);

				// On backend (note)
				updatingNote.idUser = userId;
				axios.put('/api/notes/' + updatingNote.id + '/update', updatingNote).then((response) => {
					console.log(response);
				});
				delete updatingNote.idUser;

				// Gets the connections that were added and removed
				const prevConns = graph.getVertexNeighbors(updatingNote);
				const [newConns, removeConns] = getAddedAndRemovedConnections(prevConns);

				// On frontend (note's connections)
				updateConnectionsOnFront(updatingNote.id, newConns, removeConns);

				// On backend (note's connections)
				if (newConns.length !== 0) {
					addConnectionsOnBackend(updatingNote.id, newConns, userId);
				}
				if (removeConns.length !== 0) {
					const idNote2Str = String(removeConns).split(',');
					axios.delete(`/api/connections/delete?idUser=${userId}&idNote1=${updatingNote.id}&idNote2=${idNote2Str}`)
						.then((response) => {
							console.log(response);
					});
				}

				alertMessage += ((alertMessage) ? '\n' : '') + `Note '${updatingNote.title}' updated.`;
				alert(alertMessage);
			}
		}
	};

	/**
	 * An asynchronous function that creates a new notebook on front and backend if the passed in 
	 * notebook does not exist.
	 * 
	 * @param {Notebook} notebook The notebook to create if not in the notebooks array.
	 */
	const createNotebookIfNotExists = async (notebook) => {
		return new Promise((resolve, reject) => {

			const [ exists, ] = (notebook.id) ? binarySearch(notebooks, notebook.id, 1) : [];

			if (!exists) {
				if (!window.confirm("Create notebook '" + notebookName + "'?")) {
					reject();
				} else { // Creates the new Notebook

					Object.assign(notebook, { // Notebook object to send
						idUser: userId, 
						dateCreated: new Date(),
					});
						
					axios.post('/api/notebooks/new', notebook).then((response) => {
						console.log(response);
						
						notebook.id = response.data.id;
						notebooks.push(new Notebook(response.data.id, notebookName));
						setNotebooks(notebooks);

						resolve(notebook);
					});
				}
			} else {
				resolve(notebook);
			}
		})
	}

	const updateConnectionsOnFront = (noteId, newConns, removeConns) => {
		for (let newConn of newConns) { // Adds new connections
			graph.addEdge({ id: noteId }, { id: newConn });
		}
		for (let removeConn of removeConns) { // Deletes connections
			graph.removeEdge({ id: noteId }, { id: removeConn });
		}
		setGraph(graph.clone());
	}
	
	// Determines connections to add and remove: O(n)
	const getAddedAndRemovedConnections = (prevConns) => {
		const newConns = [], removeConns = [];
		let connIndex = 0, prevIndex = 0; // Iterates 0 upwards
		while (prevConns[prevIndex] || connections[connIndex]) {

			const prevVal = (prevConns[prevIndex]?.v.id) ? // Assigns MAX_VALUE if 
				prevConns[prevIndex].v.id : Number.MAX_VALUE; // prevConns are iterated

			// Connection id's added that are lower than next previous connection id
			while (connections[connIndex]?.v.id < prevVal) {
				newConns.push(connections[connIndex].v.id);
				connIndex++;
			}

			// Previous connection not found in updated connection list
			if (connections[connIndex]?.v.id !== prevConns[prevIndex]?.v.id) {
				removeConns.push(prevConns[prevIndex].v.id);
			} else if (connections[connIndex]?.v.id === prevConns[prevIndex]?.v.id) {
				connIndex++;
			}
			prevIndex++;
		}

		return [newConns, removeConns];
	}

	/**
	 * Binary searches for the name of a notebook from its id: O(log n)
	 * 
	 * @param {*} id The value of the 'id' property of the notebook to find.
	 * @returns null if notebook not found.
	 */
	const getNotebookName = (id) => {
		if (typeof id !== 'number' || id === 0) return null;
		const nbName = binarySearch(notebooks, id, 1)[0].name;
		return nbName ? nbName : null;
	}

	const onAddConnection = (noteId, noteTitle) => {
		console.log(binaryInsert(connections, { id: Number(noteId) }));
        setConnections(connections.concat());
	};

	const addConnectionsOnBackend = (idNote1, idNote2, idUser) => {

		if (typeof idNote1 !== 'number' || !idNote2?.length || typeof idUser !== 'number') return false;

		const headers = { headers: { 'Content-Length': 0 }};
		const idNote2Str = String(idNote2).split(',');
		axios.post(`/api/connections/new?idUser=${idUser}&idNote1=${idNote1}&idNote2=${idNote2Str}`, {}, headers)
			.then((response) => {
				console.log(response);
		});
	};

	const onRemoveConnection = (note) => {
		const index = binarySearch(connections, note.id, 0, 'v.id')[1];
		connections.splice(index, 1);
		setConnections(connections.concat());
	};

	const getConnectingNote = (id) => { // O(log n) or O(m)

		let note = false;

		if (id < 0) {
			// Determines note index: O(1) if negative (an unsaved new note)
			// console.log('index', initialGraphValues.loadedSize - 1 + Math.abs(id));
			note = graph.getVertex(initialGraphValues.loadedSize - 1 + Math.abs(id));
			// console.log('negative index', note);
			// console.log('the negative index', initialGraphValues.loadedSize - 1 + Math.abs(id));
		} else if (id <= initialGraphValues.highestId) {
			// Binary searches for the note: O(log initial-n)
			let vertices = graph.getVertices();
			vertices.length = initialGraphValues.loadedSize;
			note = binarySearch(vertices, id)[0];
			//console.log('binary sort', note);
		} else {
			// Note is newly created and searches within new note indices: O(m)
			// console.log('initialGraphValues.loadedSize', initialGraphValues.loadedSize);
			// console.log('graphSize', graph.size());
			for (let i = initialGraphValues.loadedSize, size = graph.size(); i < size; i++) {
				const n = graph.getVertex(i);
				if (Number(n.id) === Number(id)) {
					note = n;
				}
			}
			// console.log('in new notes', note);
		}
		
		return (note !== false && note !== []) ? note : null;
	}

	const selectAllText = (e) => {
		e.target.select();
		e.target.setSelectionRange(0, e.target.value.length); // For mobile safari
	};

	const onTitleKeyDown = (e) => {
		if (e.key === 'Enter') {
			textRef.current.focus(); 
			e.preventDefault();
		}
	}

	const onTextKeyDown = (e) => {
		if (e.key === 'Backspace' && e.target.value === '') {
			titleRef.current.focus();
			e.preventDefault();
		}
	}

	const onInputChange = (e) => {

		let updated = {};
		({ // Changes appropriate input state
			[styles.notebook]: () => setNotebookName(e.target.value),
			[styles.title]: () => {
				setNoteInEditor({ ...noteInEditor, title: e.target.value });
				updated = { title: e.target.value };
			},
			[styles.text]: () => {
				setNoteInEditor({ ...noteInEditor, text: e.target.value });
				updated = { text: e.target.value };
			},
			[styles.quotes]: () => {
				setNoteInEditor({ ...noteInEditor, quotes: e.target.value });
				updated = { quotes: e.target.value };
			},
		})[e.target.id]();

		// Determines notebookName was changed if empty, checks live value
		const nbName = (Object.keys(updated).length === 0 ? e.target.value : notebookName);
		let { id: notebookId } = notebooks.find((nb) => nb.name === nbName) || {};

		const hasChanged = JSON.stringify(graph.getVertex(noteInEditorIndex)) !==
			JSON.stringify(Object.assign({ ...noteInEditor, idNotebook: notebookId ?? null }, updated));

		// console.log(JSON.stringify(graph.getVertex(noteInEditorIndex)));
		// console.log(JSON.stringify({ ...noteInEditor, idNotebook: notebookId ?? null }));
		// console.log(hasChanged);

		if (hasChanged) {
			const note = graph.getVertex(noteInEditorIndex);
			if (note.title[0] !== '﻿') {
				note.title = '﻿' + note.title;
				graph.updateVertex(note);
				setGraph(graph.clone());
				setTimeout(() => e.target.focus(), 5);
			}
		}
	}

	const noteListWithoutConnections = () => { // O(log n * c)

		const noteList = graph.getVertices();
        if (!connections) return noteList;

        for (let conn of connections) {
            const index = binarySearch(noteList, { id: conn.id })[1];
            noteList.splice(index, 1);
        }

        return noteList;
    }

	function mainToggle (e) {
		setNoteInEditor({ ...noteInEditor, main: (e.target.id === 'mainRadio') ? true : false });
	};

    return (
        <form className={styles.form}>
			<div className={styles.flexRow}>
				<img id={styles.notebookIcon} src={notebookIcon} alt="" />
				<input 
					type="text" 
					list="notebookOptions" 
					id={styles.notebook} 
					className={styles.editorTextInputs} 
					placeholder="Notebook"
					value={notebookName}
					onChange={onInputChange}
				/>
				<datalist id="notebookOptions" ref={dataListRef}>
					{notebooks?.map((nb, index) => (
						nb.name !== 'All Notebooks' ? (
							<option value={nb.name} key={index}>{nb.name}</option>
						) : null
					))}
				</datalist>
			</div>

			<div className={styles.editorAndConnections}>
				<div id={styles.editor} className={noteInEditor?.main === false ? styles.editorStickyColor : styles.editorMainColor}>
					<input 
						type="text" 
						id={styles.title} 
						className={styles.editorTextInputs} 
						placeholder="Title" 
						value={noteInEditor.title ?? ''}
						onChange={onInputChange}
						onKeyDown={onTitleKeyDown}
						onFocus={(e) => {if (noteInEditor.title === 'Untitled') selectAllText(e)}}
						ref={titleRef}
					/>
					<textarea 
						id={styles.text} 
						className={styles.editorTextInputs} 
						placeholder="" 
						value={noteInEditor.text ?? ''}
						onChange={onInputChange}
						onKeyDown={onTextKeyDown}
						onFocus={(e) => {if (noteInEditor.text === '-') selectAllText(e)}}
						ref={textRef}
					/>
					<textarea 
						id={styles.quotes} 
						className={styles.editorTextInputs} 
						placeholder="Quotes" 
						value={noteInEditor.quotes ?? ''}
						onChange={onInputChange}
					/>
					<div className={styles.radioRow}>
						<input 
							type="radio"
							className="btn-check" 
							name="options-outlined" 
							id="stickyRadio" 
							autoComplete="off" 
							checked={!noteInEditor.main} 
							onChange={mainToggle} 
						/>
						<label className="btn" id={styles.stickyButton} htmlFor="stickyRadio">Sticky Note</label>

						<input 
							type="radio" 
							className="btn-check" 
							name="options-outlined" 
							id="mainRadio" 
							autoComplete="off" 
							checked={noteInEditor.main} 
							onChange={mainToggle} 
						/>
						<label className="btn" id={styles.mainButton} htmlFor="mainRadio">Main Note</label>
					</div>
				</div>

				<div id={styles.connectionsRow}>
					{connections?.map((connectingNote, i) => (
						!!connectingNote && <EditorConnection 
							note={getConnectingNote(connectingNote?.v.id)} 
							onRemove={onRemoveConnection}
							key={i}
						/>
					))}
					<AddConnection 
						currentNoteId={note?.id}
						noteList={graph.getVertices()}
						onAddConnection={onAddConnection}
					/>
				</div>
			</div>

			<input 
				type="button" 
				id={styles.addUpdate}
				value={note?.id < 0 ? "Add Note" : "Update Note"} 
				onClick={updateOnBackFront}
			/>
        </form>
    )
};
export default Editor;