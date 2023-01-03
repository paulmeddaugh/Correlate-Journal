import { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './logo.svg';
import styles from './styles/App.module.css';
import Login from './components/LoginComponents/Login.js';
import CreateAccount from './components/LoginComponents/CreateAccount.js';
import ForgotPassword from './components/LoginComponents/ForgotPassword';
import Header from './components/Header';
import NoteBoxLayout from './components/NoteBox/NoteBoxLayout';
import Graph from './scripts/graph/graph';
import loadJournal from "./scripts/graph/loadJournal.js";
import Editor from './components/Editor/Editor';
import AddNoteButton from './components/Editor/AddNoteButton';
import Account from './components/Account';
import JournalWall from './components/JournalWall/JournalWall';
import Loading from './components/LoginComponents/Loading';
import Note from './scripts/notes/note';

const App = () => {

    const [user, setUser] = useState(null);
    const [graph, setGraph] = useState(new Graph());
    const [notebooks, setNotebooks] = useState([]);
    const [selected, setSelected] = useState({}); // format: { note: ___, index: ___ }
    const headerRef = useRef(null);

    const [loading, setLoading] = useState(false);

    const [newNoteId, setNewNoteId] = useState(-1);
    const [filters, setFilters] = useState({});

    useEffect(() => {
        if (user?.id) {
            loadJournal(user.id, (g, nbs) => {
                setGraph(g);
                console.log(g);

                nbs.unshift({ name: 'All Notebooks' });
                setNotebooks(nbs);

                setSelected({ note: g.getVertex(0), index: 0 });
                setLoading(false);
            });
        }
    }, [user]);

    const addNoteClick = (e, prevRoutePath) => {
        const newNote = new Note((prevRoutePath === '/editor') ? newNoteId : -1, '', '', '', null, true, new Date());
        graph.addVertex(newNote);
        setGraph(graph.clone());
        setNewNoteId((prev) => (prevRoutePath === '/editor') ? prev - 1 : -2);
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
                                onValidUser={(user) => setUser(user)} 
                                onLoadingUser={() => setLoading({ status: 'Loading...' })} 
                                onLoginError={(message) => setLoading({ status: message, linkText: 'Retry' })} 
                            />
                        } />
                        <Route path="createAccount/*" element={<CreateAccount />} />
                        <Route path="forgotPassword/*" element={<ForgotPassword />} />
                    </Routes>
                </BrowserRouter> 
            ) : (
                <BrowserRouter>
                    <Header ref={headerRef} username={user.username} onLogoClick={() => setUser(null)} />
                    <Routes>
                        <Route path="/editor" element={
                            <NoteBoxLayout 
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
                                />
                            </NoteBoxLayout>
                        } />
                        <Route path="/" element={
                            <NoteBoxLayout 
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
                        <Route path="account" element={
                            <Account 
                                user={user} 
                                graphValues={{ noteCount: graph.size(), notebookCount: notebooks.length - 1 }} 
                            />
                        } />
                    </Routes>
                    <AddNoteButton onClick={addNoteClick}/>
                </BrowserRouter>
            )}
        </div>
        
    );
}

export default App;