# thoughtweb
Let's say you have a journal/notebook with 20 entries or notes in it. These thoughts also have some common ideas being evaluated/expounded upon that you wished would be easier to follow throughout, so you rip the pages out, tack them to a wall, and tie strings between the pages that relate so you could follow the trains of thought more clearly; this site is an online journal/note organizer that utilizes connecting with other entries to aid seeing the processes of thoughts in overview and using advantages from technology (unlimited space, searching, accessable anywhere online).</br>

Live site: http://thoughtweb.space</br>
Quick access - Username: <b>admin</b>, Password: <b>password</b></br>

Trello board: https://trello.com/b/IUqaznxv/correlate-thoughts

### Data Structures And Algorithm Efficiency
The frontend loads user note and connections data from a RESTful backend API into a graph for storing on the frontend, as well as a simple array for the user's notebooks. </br>
</br>
It's efficiency relies primarily on binary inserting and searching, typically hitting O(log n) time complexity. An algorithm to highlight, however, is in the Editor component, which determines the connections added and removed to a note from its previously saved list in O(n) time, is found in [Editor.js](react-frontend/src/components/Editor/Editor.js#L311-L336).

### Running The Project
The backend development server can be started by opening the project in Eclipse and clicking the green play button with a red toolbox in the bottom right.