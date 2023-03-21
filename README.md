# thoughtweb
Thoughts and beliefs are typically big impactors of our daily and overall lives, and some find a journal amazingly helpful to keep track of or process thoughts. These entries are typically ordered by date, but the ideas that shape our worlds don't always become so linearly. Therefore, this website allows thoughts and entries to be organized by idea through adding capability of entries to have connections to any other or even just to have sticky notes from a chronological-based order. The site originally presents each entry chronologically with connections around them, and provides further organization with notebooks, "Main" and "Sticky" note types, and custom ordering. It uses a ReactJS-Bootstrap frontend with a Java Spring Boot-MySQL database backend, and runs the React generated static build on the Spring backend server.</br>

Live site: http://thoughtweb.space</br>
Quick access - Username: <b>admin</b>, Password: <b>password</b></br>

Trello board: https://trello.com/b/IUqaznxv/correlate-thoughts

### Data Structures And Algorithm Efficiency
The frontend loads user note and connections data from the RESTful API into a graph for storing on the front-end, and a simple array for the user's notebooks. </br>
</br>
It's efficiency relies primarily on binary inserting and searching to typically hit O(log n) time complexity. An algorithm to highlight, however, is in the Editor component, which determines a note's id among a list of notes saved and unsaved to the backend. It determines unsaved notes in O(1), newly saved notes in O(m), where m is the number of all the new notes saved and unsaved, and O(log initial-n), where n is the initial loaded list size, found in [Editor.js](react-frontend/src/components/Editor/Editor.js) around line 330. Another algorithm, which determines a note's added and removed connections from a previous versioned list in O(n) time is also found in [Editor.js](react-frontend/src/components/Editor/Editor.js) around line 268.