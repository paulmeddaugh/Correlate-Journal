import styles from '../../styles/Editor/EditorConnection.module.css';

const EditorConnection = ({ note, onRemove }) => {

    return (
        <div className={styles.flex}>
            <div className={styles.line} />
            <div className={styles.noteContainer + (!note.main ? ' ' + styles.stickyNote : '')}>
                <div className={styles.title}>{note.title}</div>
                <div className={styles['display-none']}>{note.text}</div>
                <div className={styles.removeConnection} onClick={() => onRemove ? onRemove(note) : null}/>
            </div>
        </div>
    );
}

export default EditorConnection;