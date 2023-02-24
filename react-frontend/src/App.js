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
import { UserOrderProvider } from './components/UserOrderContext';

const NO_NOTES_ORDER_BEGIN = 'O';

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
    const [filters, setFilters] = useState({});

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

    const addNoteClick = (e, prevRoutePath) => {
        const newPosition = userOrder.length !== 0 ? 
              positionAfter(userOrder[userOrder.length - 1]?.order) 
            : NO_NOTES_ORDER_BEGIN;
        const newId = (prevRoutePath === '/editor') ? newNoteId : -1;
        const newNote = new Note(newId, '', '', '', null, true, new Date(), newPosition);
        graph.addVertex(newNote);
        setGraph(graph.clone());

        userOrder.push({ id: newId, graphIndex: graph.size() - 1, order: newPosition });
        setUserOrder(userOrder.concat());

        setNewNoteId(newId - 1); // State val loads after
        setSelected({ note: newNote, index: graph.size() - 1 });
    }

    const onNotebookSelect = (nb) => {
        setFilters(prev => {
            if (nb.id) {
                return { ...prev, notebook: nb.id };
            } else {
                const { notebook, ...rest } = prev; 
                return rest;
            }
        });
    }

    const onLogout = () => {
        setUser(null);
        setUsername('');
        setPassword('');
    }

    // If no notes logging in, navigate to Editor, which will create a new note under such conditions
    const onHeaderMount = (navigate) => {
        if (graph.size() === 0) navigate('/editor');
    }

    if (loading) {
        return (
            <Loading 
                status={loading.status ?? ' '} 
                linkText={loading.linkText ?? ' '}
                onLinkClick={() => setLoading(false)}
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
                        onLogoClick={onLogout} 
                        onMount={onHeaderMount}
                    />
                    <UserOrderProvider userOrder={userOrder} setUserOrder={setUserOrder}>
                        <Routes>
                            <Route path="/" element={
                                <NoteBoxLayout 
                                    userId={user.id}
                                    graphState={[graph, setGraph]} 
                                    notebooksState={[notebooks, setNotebooks]}
                                    selectedState={[selected, setSelected]}
                                    onNotebookSelect={onNotebookSelect}
                                    headerRef={headerRef}
                                >
                                    <JournalWall
                                        graph={graph}
                                        selectedState={[selected, setSelected]}
                                        filters={filters}
                                    />
                                </NoteBoxLayout>
                            } />
                            <Route path="/editor" element={
                                <NoteBoxLayout 
                                    userId={user.id}
                                    graphState={[graph, setGraph]}
                                    notebooksState={[notebooks, setNotebooks]}
                                    selectedState={[selected, setSelected]}
                                    onNotebookSelect={onNotebookSelect}
                                    headerRef={headerRef}
                                >
                                    <Editor 
                                        userId={user.id}
                                        selectedState={[selected, setSelected]}
                                        graphState={[graph, setGraph]}
                                        notebooksState={[notebooks, setNotebooks]}
                                        newNoteId={newNoteId}
                                        onMount={() => {if (graph.size() === 0) addNoteClick()}}
                                    />
                                </NoteBoxLayout>
                            } />
                            <Route path="/account" element={
                                <Account 
                                    user={user}
                                    noteCount={graph.size()}
                                    notebookCount={notebooks.length - 1}
                                />
                            } />
                        </Routes>
                        <CreateNoteButton onClick={addNoteClick}/>
                    </UserOrderProvider>
                </BrowserRouter>
            )}
        </div>
        
    );
}

export default App;