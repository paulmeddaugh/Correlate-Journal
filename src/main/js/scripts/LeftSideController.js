import { checkIfNoteProps } from './utility/errorHandling.js';

// --------------------------------------------------------------------------------------------
// Functions for loading notes and notebooks into the info-box-component
// --------------------------------------------------------------------------------------------

let active = null;

export function loadInfoBox(infoBox, notes, notebooks, customConfirm) {
    //customConfirm("hi", "What comes on your screen must come off", (confirmed) => console.log(confirmed));
    addNotebooksToInfoBox(infoBox, notebooks);
    addNotesToInfoBox(infoBox, notes);
}

/**
 * Adds the notebooks to the options of the notebook selector.
 * 
 * @param {InfoBox} infoBox The infoBox to add the notebooks to its notebook selector.
 * @param {*} notebooks The array of {@link Notebook} objects to add.
 */
 export function addNotebooksToInfoBox (infoBox, notebooks) {
  for (let notebook of notebooks) {
    addNotebookToInfoBox(infoBox, notebook);
  }
}

/**
 * Adds a notebook to the options of the notebook selector in the info side box.
 * 
 * @param {InfoBox} infoBox The infoBox to add the notebooks to its notebook selector.
 * @param {Notebook} notebook The notebook to add.
 */
export function addNotebookToInfoBox(infoBox, notebook) {

  let div = document.createElement('div');
  div.innerHTML = notebook.name;
  div.setAttribute('data-idNotebook', notebook.id);
  div.classList.add('nbOption');

  div.addEventListener("click", () => { // Selecting a notebook
    infoBox.shadowRoot.getElementById('option').innerHTML = div.innerHTML;
    infoBox.shadowRoot.getElementById('option')
      .setAttribute('data-idNotebook', div.getAttribute('data-idNotebook'));
    infoBox.shadowRoot.getElementById('nbOptions').style.display = 'none';
  });

  let remove = document.createElement('div');
  remove.classList.add('removeNb');
  remove.addEventListener("click", () => { // Removing a notebook

    if (!window.confirm("Are you sure you want to delete notebook '" + notebook.name + "' and all of its notes?")) {
      return;
    }

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
          let result = xhr.responseText;
          alert(result);
          console.log(result);
      }
    }

    xhr.open("POST", "../php/removeNotebook.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send('idNotebook=' + notebook.id);
  });

  if (notebook.name != 'All Notebooks') div.appendChild(remove);
  infoBox.shadowRoot.getElementById('nbOptions').appendChild(div);
}

export function addNotesToInfoBox (infoBox, notes) {
  for (let note of notes) {
    addNoteToInfoBox(infoBox, note, false);
  }
}

/**
 * 
 * @param {InfoBox} infoBox 
 * @param {Note} note 
 * @param {boolean} first 
 */
export function addNoteToInfoBox (infoBox, note, first) {
    checkIfNoteProps({ note });

    // Entire note display area
    let a = document.createElement('A');
    a.classList.add('list-group-item', 'list-group-item-action', 'flex-column', 'align-items-start');
    a.setAttribute('data-idNotebook', note.idNotebook); // stores the notebook id in the note container
    if (first) (active = a).classList.add('active');
    
    // Title and date div
    let div = document.createElement('div');
    div.classList.add('d-flex', 'w-30', 'justify-content-between');

    let title = document.createElement('h5');
    title.classList.add('mb-1');
    title.id = 'title';
    title.innerHTML = note.title;

    let date = document.createElement('small');
    date.innerHTML = new Date(note.dateCreated).toLocaleDateString('en-us', { month:"short", day:"numeric"});
    div.appendChild(title);
    div.appendChild(date);

    // note content
    let p = document.createElement('p');
    p.classList.add('mb-1');
    p.innerHTML = note.text;

    // remove note icon
    let removeDiv = document.createElement('div');
    removeDiv.classList.add('removeNote');
    removeDiv.addEventListener("click", () => {

      if (!window.confirm("Are you sure you want to delete note titled '" + note.title + "'?")) {
        return;
      }
  
      let xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let result = xhr.responseText;
            alert(result);
            console.log(result);
        }
      }
  
      xhr.open("POST", "../php/removeNote.php", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send('idNote=' + note.id);
    });

    a.appendChild(div);
    a.appendChild(p);
    if (note.id != null) a.appendChild(removeDiv);

    a.addEventListener("click", e => {
      if (active) {
        active.classList.remove('active');
        active.children[2]?.classList.remove('removeNoteEntry');
      }
      (active = e.currentTarget).classList.add('active');
      active.children[2]?.classList.add('removeNoteEntry');
    });

    infoBox.shadowRoot.children[0].children[2].appendChild(a);

    // Adds the note as an option in the search bar
    let option = document.createElement('option');
    option.value = option.innerHTML = note.title;
    infoBox.shadowRoot.getElementById('noteOptions').appendChild(option);
}

/**
 * Adds "click" listeners to the displaying note containers in the specified infoBox.
 * 
 * @param {InfoBox} infoBox The infoBox to add listeners to its displayed notes.
 * @param {function} listener A function passed a parameter of the index of the note container from the
 * top to the bottom.
 */
export function addNotesClickListenersToInfoBox(infoBox, listener) {
  const notesInBox = infoBox.shadowRoot.getElementById('infobox').children[2].children;

  for (let i = 1; i < notesInBox.length; i++) {
    notesInBox[i].addEventListener("click", (e) => {
      listener(i - 1);
    });
  }
}

/**
 * Adds a listener for when a value is selected in the notebook dropdown in the specified infoBox.
 * 
 * @param {InfoBox} infoBox The infoBox to add the listener to.
 * @param {function} listener A function passed a parameter of the value that the notebook dropdown 
 * was changed to.
 */
export function selectNotebookListener (infoBox, listener) {
  infoBox.shadowRoot.getElementById('notebook').addEventListener("change", (e) => {
    listener(e.currentTarget.value);
  });
}