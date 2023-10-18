import axios from "axios";
import { checkIfArrays, checkIfNoteProps, checkIfNumbers, checkIfString } from "./utility/errorHandling";

export const createNewUserOnBack = (user) => {
    return axios.post('/api/users/newUser', user);
}

export const getUserFromBack = async (username, password) => {
    checkIfString({ username, password });
    return axios.get(`/api/users?username=${username}&password=${password}`);
}

export const getJournalDataFromBack = async (userId) => {
    checkIfNumbers({ userId });
    return axios.get(`/api/users/${userId}/getJournal`);
}

export const createNoteOnBack = async (note) => {
    checkIfNoteProps({ note });
    return axios.post('/api/notes/new', note);
}

export const updateNoteOnBack = async (note) => {
    checkIfNoteProps({ note });
    return axios.put(`/api/notes/${note.id}/update`, note);
}

export const deleteNoteOnBack = async (id) => {
    checkIfNumbers({ id });
    return axios.delete(`/api/notes/${id}/delete`);
}

export const createNotebookOnBack = async (notebook) => {
    checkIfNumbers({ 'notebook.idUser': notebook.idUser });
    checkIfString({ 'notebook.name': notebook.name }); 
    return axios.post('/api/notebooks/new', notebook);
}

export const deleteNotebookOnBack = async (idNotebook) => {
    checkIfNumbers({ idNotebook });
    return axios.delete(`/api/notebooks/${idNotebook}/delete`);
}

export const addMultipleConnsOnBack = (userId, id1, id2Arr) => {
    checkIfNumbers({ userId, id1 });
    checkIfArrays({ id2Arr });
    const id2sStr = String(id2Arr).split(',');
	return axios.post(`/api/connections/new?idUser=${userId}&idNote1=${id1}&idNote2=${id2sStr}`, {});
}

export const deleteMultipleConnsOnBack = (userId, id1, id2Arr) => {
    checkIfNumbers({ userId, id1 });
    checkIfArrays({ id2Arr });
    const id2sStr = String(id2Arr).split(',');
    return axios.delete(`/api/connections/delete?idUser=${userId}&idNote1=${id1}&idNote2=${id2sStr}`);
}

export const updateOrderOnBack = async (noteId, position) => {
    checkIfNumbers({ noteId });
    checkIfString({ position });
    const headers = { headers: {'Content-Type': 'text/plain'} };
    return axios.put(`/api/notes/${noteId}/updateOrder`, position, headers);
}