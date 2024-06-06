# thoughtweb

### Introduction
Let's say you have a notebook with 20 notes in it, and these notes have some re-occuring ideas being evaluated that you wished would be easier to follow, so you rip the pages out, tack them to a wall, and tie strings between the pages so you could follow the trains of thought more clearly; this site is an online journal/note organizer that utilizes connections with other entries to overview the courses of thoughts, using the advantages that technology brings (accessablity, unlimited note space, simple organization and searching) to find more insight.</br>

This project utilizes graph data structures to load and connect notes, and an algorithm to highlight is found in [Editor.js](react-frontend/src/components/Editor/Editor.js#L311-L336), which determines the connections added and removed to a note from its previous list in O(n) time.

### Links
Live: http://thoughtweb.space</br>
Quick access account - Username: <b>demo</b> | Password: <b>password</b></br>

Trello board: https://trello.com/b/IUqaznxv/correlate-thoughts

### Running The Project
The backend development server can be started by simply running the project in eclipse.

To use the actual production database in development:
- Install the railway CLI and copy the path to its runnable file (.exe in windows).
- Login to the railway CLI in a terminal by typing `railway login`.
- Go to the local project's directory in your terminal and link the thoughtweb railway project to it with the CLI, typing `railway link`
- Find the green play button with a red toolbox (the External tools runner) in Eclipse and click the down arrow beside it, then "External tools configurations..." Paste the path to the railway runnable in the "Location" input, click "Apply", and then "Run".
- If a dependency is added or removed, the VM arguments of the external tools runner must also be updated to keep using the production database. To do this, clean and install the project with maven, then click the down arrow beside the regular green play runner -> Run configurations... -> "Show Command Line" button at the bottom -> Copy & Close -> "Close" button. Then click the down arrow beside the green play button with toolbox -> External tools configurations... -> Replace all content in the "Arguments" input with "run " + the copied content