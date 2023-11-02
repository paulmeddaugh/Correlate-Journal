# thoughtweb

### Introduction
Let's say you have a notebook with 20 notes in it, and these notes have some re-occuring ideas being evaluated that you wished would be easier to follow in how they came to be, so you rip the pages out, tack them to a wall, and tie strings between the pages so you could follow the trains of thought more clearly; this site is an online journal/note organizer that utilizes connections with other entries to overview the courses of thoughts, using the advantages that technology brings (accessablity, unlimited note space, simple organization and searching) to find more insight.</br>

This project utilizes graph data structures to load and connect notes, and an algorithm to highlight is found in [Editor.js](react-frontend/src/components/Editor/Editor.js#L311-L336), which determines the connections added and removed to a note from its previous list in O(n) time.

### Links
Live: http://thoughtweb.space</br>
Quick access - Username: <b>demo</b>, Password: <b>password</b></br>

Trello board: https://trello.com/b/IUqaznxv/correlate-thoughts

### Running The Project
The backend development server can be started by simply running the project in eclipse.

To use the actual production database in development:
- Install the railway CLI and take note of the path it is located in.
- Login to railway using the CLI with `railway login`
- Go to the project's directory in a terminal and type and link to the thoughtweb project in railway, typing `railway link`
- Click the green play button with a red toolbox (the External tools runner). 
- If a dependency is added or removed, the VM args of the external tools runner must be updated. To do this, clean and install with maven, then click the down arrow beside the regular green play runner -> Run configurations... -> "Show Command Line" button at the bottom -> Copy & Close -> "Close" button. Then click the down arrow beside the green play button with toolbox -> External tools configurations... -> replace all content in the "Arguments" input with "run " + the copied content