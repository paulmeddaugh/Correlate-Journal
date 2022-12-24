import Note from '../notes/note.js';
import Notebook from '../notes/notebook.js';
import Graph from './graph.js';
import { stringToSQL, stringFromSQL } from '../utility/utility.js';
import axios from 'axios';

/**
 * Loads a user's notes into a graph from the database.
 * 
 * @param {number} idUser The user whose notes to return.
 * @param {function} callback The function to call when the AJAX request returns.
 * @param {number} idNotebook An optional parameter to narrow the notes returned to a notebook.
 */
export default function loadJournal (idUser, callback, idNotebook, asDisplayableNotes) {

    if (!idUser) return;

    axios.get('/api/users/' + idUser + '/getJournal').then((response) => {
        let graph = new Graph(), notebooks = [];

        const nbs = response.data._embedded.collectionModelList[0]._embedded?.notebookList;
        const notes = response.data._embedded.collectionModelList[1]._embedded?.noteList;
        const connections = response.data._embedded.collectionModelList[2]._embedded?.connectionList;

        // Loads user note data into the graph
        if (notes) {
            for (let noteData of notes) {
                let note = new Note(noteData.id, stringFromSQL(noteData.title), 
                    stringFromSQL(noteData.text), stringFromSQL(noteData.quotes), noteData.idNotebook, 
                    !!Number(noteData.main), noteData.dateCreated);

                graph.addVertex(note);
            }
        }

        // Loads note connections into graph
        if (connections) {
            for (let connection of connections) {
                graph.addEdge(graph.getVertex(String(connection.idNote1)), 
                    graph.getVertex(String(connection.idNote2)));
            }
        }

        // Loads notebook data into an array
        if (nbs) {
            for (let nbData of nbs) {
                let notebook = new Notebook(nbData.id, nbData.name);
                notebooks.push(notebook);
            }
        }

        callback?.(graph, notebooks);
    });
}