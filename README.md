# thoughtweb
Thoughts and personal revelations are typically big impactors of our daily and overall lives, and, while some find a simple pen and notebook amazingly helpful to keep track of or process thoughts ordered chronologically, the ideas that shape our worlds don't always occur so linearly. Therefore, this website allows thoughts and entries to further be organized by their ideas, on top of chronological ordering, through adding the capability for entries to also tie string to any others or even just have sticky notes. The site presents each entry chronologically with connections around, and provides further organization with notebooks, custom ordering, and "Main" or "Sticky" note types. It uses a React.js-Bootstrap frontend with a Java Spring Boot-MySQL database backend, and runs the React generated static build on the Spring backend server.</br>

Live site: http://thoughtweb.space</br>
Quick access - Username: <b>admin</b>, Password: <b>password</b></br>

Trello board: https://trello.com/b/IUqaznxv/correlate-thoughts

### Data Structures And Algorithm Efficiency
The frontend loads the user's note and note connections data from the RESTful API into a graph on the front-end, and user notebooks into a simple array. </br>
</br>
It's efficiency relies primarily on binary inserting and searching to typically hit O(log n) time complexity. An algorithm to highlight, however, is in the Editor component, which must determine a note's id among a list of all notes including multiple new notes unsaved to the backend. It determines unsaved notes in O(1), newly saved notes in O(m), where m is the number of all unsaved and newly saved notes, and O(log initial-n), where n is the initial loaded list size, found in [Editor.js](react-frontend/src/components/Editor/Editor.js) around line 330. Another algorithm, which determines a note's added and removed connections from a previous versioned list in O(n) time is also found in [Editor.js](react-frontend/src/components/Editor/Editor.js) around line 268.