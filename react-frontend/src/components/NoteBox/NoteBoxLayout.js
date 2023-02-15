import { useEffect, useRef, useState } from "react";
import siteStyles from '../../styles/App.module.css';
import NoteBox from "./NoteBox";
import CustomConfirm from "../CustomConfirm";

const NOTEBOX_UNPIN_MIN_WIDTH = 450;

const NoteBoxLayout = ({ userId, graphState, userOrderState, notebooksState, children, selectedState, headerRef, 
    onNotebookSelect }) => {

    // A state for an object that holds 'title', 'message', and 'callback' properties,
    // displaying a model what invokes the callback with the confirm results when set
    const [confirmObj, setConfirmObj] = useState({});

    const bodyRef = useRef(null);

    const customConfirm = (title, message, callback) => {
        setConfirmObj({ title: title, message: message, callback: callback });
    }

    useEffect(() => {
        const resize = () => {
            // Manually sets the height of 'main' to 100% - header
            if (headerRef.current !== null && bodyRef.current !== null) {
                bodyRef.current.style.height = parseInt(window.getComputedStyle(document.body).height) 
                - parseInt(window.getComputedStyle(headerRef.current).height) + 'px';
            }
        };
        resize();
        window.addEventListener("resize", resize);
    }, []);

    return (
        <div className={siteStyles.body} ref={bodyRef} >
            
            <div className={siteStyles.main}>
                <NoteBox 
                    userId={userId}
                    graphState={graphState} 
                    userOrderState={userOrderState}
                    notebooksState={notebooksState} 
                    selectedState={selectedState} 
                    onNotebookSelect={onNotebookSelect}
                    pinned={window.innerWidth < NOTEBOX_UNPIN_MIN_WIDTH ? false : true}
                />
                <div id={siteStyles.content}>
                    {children}
                    {/* <canvas id={siteStyles.background}></canvas> */}
                </div>
            </div>

            <CustomConfirm 
                confirmObj={confirmObj} 
                setConfirmObj={setConfirmObj}
            />
        </div>
    )
}

export default NoteBoxLayout;