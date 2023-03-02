import { useState, useRef, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { positionAfter, positionBefore } from './scripts/utility/customOrderingAsStrings';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './styles/App.module.css';
import Login from './components/LoginComponents/Login.js';
import CreateAccount from './components/LoginComponents/CreateAccount.js';
import ForgotPassword from './components/LoginComponents/ForgotPassword';
import Header from './components/Header';
import NoteBoxLayout from './components/NoteBox/NoteBoxLayout';
import Graph from './scripts/graph/graph';
import loadJournal from "./scripts/graph/loadJournal.js";
import Editor from './components/Editor/Editor';
import CreateNoteButton from './components/Editor/CreateNoteButton';
import Account from './components/Account';
import JournalWall from './components/JournalWall/JournalWall';
import Loading from './components/LoginComponents/Loading';
import Note from './scripts/notes/note';
import './styles/universalStyles.css';
import { LoginProvider } from './components/LoginProvider';

const NO_NOTES_POSITION_BEGIN = 'O';

const App = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [user, setUser] = useState(null);
    const [graph, setGraph] = useState(new Graph());
    const [userOrder, setUserOrder] = useState([]);
    const [notebooks, setNotebooks] = useState([]);
    const [selected, setSelected] = useState({}); // format: { note: ___, index: ___ }
    const headerRef = useRef(null);

    const [loading, setLoading] = useState(false);

    const [newNoteId, setNewNoteId] = useState(-1);

    useEffect(() => {
        if (user?.id) {
            loadJournal(user.id, (g, nbs, userOrder) => {
                setGraph(g);
                setUserOrder(userOrder);

                nbs.unshift({ name: 'All Notebooks' });
                setNotebooks(nbs);

                setSelected({ note: g.getVertex(0), index: 0 });
                setLoading(false);
            });
        }
    }, [user]);

    const createNoteClick = (e, prevRoutePath) => {
        // Determines new ordering value of the new note
        const newPosition = userOrder.length !== 0 ? 
              positionAfter(userOrder[userOrder.length - 1]?.order) 
            : NO_NOTES_POSITION_BEGIN;

        /* Resets the new note id decrementing count to -1 if clicked away from editor,
         * as the Editor deletes all unsaved notes when unmounting for efficiency. */ 
        const newId = (prevRoutePath !== '/editor') ? -1 : newNoteId;
        const newNote = new Note(newId, '', '', '', null, true, new Date(), newPosition);

        graph.addVertex(newNote);
        setGraph(graph.clone());

        userOrder.push({ id: newId, graphIndex: graph.size() - 1, order: newPosition });
        setUserOrder(userOrder.concat());

        setNewNoteId(newId - 1); // Decrements new id count
        setSelected({ note: newNote, index: graph.size() - 1 });
    }

    const onLogout = () => {
        setUser(null);
        setUsername('');
        setPassword('');
    }

    const onHeaderMount = (navigate) => {
        // If no notes logging in, navigate to Editor, which will create a new note under such conditions
        if (graph.size() === 0) navigate('/editor');
    }

    if (loading) {
        return (
            <Loading 
                status={loading.status ?? ' '} 
                linkProps={{ text: loading.linkText, onClick: () => setLoading(false)}}
            />
        )
    }

    return (
        <div className={styles.fullSize}>
            {!user?.id ? (
                <BrowserRouter>
                    <Routes>
                        <Route path="*" element={
                            <Login 
                                usernameValue={username}
                                passwordValue={password}
                                onUsernameChange={(e) => setUsername(e.target.value)}
                                onPasswordChange={(e) => setPassword(e.target.value)}
                                onLoadingUser={() => setLoading({ status: 'Loading...' })} 
                                onValidUser={(user) => setUser(user)} 
                                onLoginError={(message) => setLoading({ status: message, linkText: 'Retry' })} 
                            />
                        } />
                        <Route path="createAccount/*" element={<CreateAccount />} />
                        <Route path="forgotPassword/*" element={<ForgotPassword />} />
                    </Routes>
                </BrowserRouter> 
            ) : (
                <BrowserRouter >
                    <Header 
                        ref={headerRef} 
                        username={user.username} 
                        onMount={onHeaderMount}
                        onLogoClick={onLogout} 
                    />
                    <LoginProvider
                        graph={graph}
                        setGraph={setGraph}
                        userOrder={userOrder} 
                        setUserOrder={setUserOrder}
                        selected={selected}
                        setSelected={setSelected}
                        notebooks={notebooks}
                        setNotebooks={setNotebooks}
                        userId={user.id}
                    >
                        <Routes>
                            <Route path="/" element={
                                <NoteBoxLayout headerRef={headerRef}>
                                    <JournalWall/>
                                </NoteBoxLayout>
                            } />
                            <Route path="/editor" element={
                                <NoteBoxLayout headerRef={headerRef}>
                                    <Editor
                                        onMount={() => {if (graph.size() === 0) createNoteClick()}}
                                        newNoteId={newNoteId}
                                    />
                                </NoteBoxLayout>
                            } />
                            <Route path="/account" element={
                                <Account 
                                    name={user.name}
                                    username={user.username}
                                    email={user.email}
                                    dateCreated={user.dateCreated}
                                    noteCount={graph.size()}
                                    notebookCount={notebooks.length - 1}
                                />
                            } />
                        </Routes>
                        <CreateNoteButton onClick={createNoteClick}/>
                    </LoginProvider>
                </BrowserRouter>
            )}
        </div>
        
    );
}

export default App;