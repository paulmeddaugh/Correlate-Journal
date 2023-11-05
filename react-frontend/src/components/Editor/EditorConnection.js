import styles from '../../styles/Editor/EditorConnection.module.css';

const EditorConnection = ({ note, onRemove, className, lineClassName, ...props }) => {

    return (
        <div className={`${className} d-flex position-relative ${styles.container}`} {...props}>
            <div className={`${lineClassName} ${styles.line}`} />
            <div className={styles.noteContainer + (!note.main ? ' ' + styles.stickyNote : '')}>
                <div className={styles.title}>{note.title}</div>
                <div className={styles.text}>{note.text}</div>
                <div className={styles.removeConnection} onClick={() => onRemove ? onRemove(note) : null}/>
            </div>
        </div>
    );
}

export default EditorConnection;