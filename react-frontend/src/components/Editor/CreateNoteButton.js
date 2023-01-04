import { Link, useLocation } from 'react-router-dom';
import styles from '../../styles/Editor/AddNoteButton.module.css';

const CreateNoteButton = ({ onClick }) => {

    const location = useLocation();

    const clicked = (e) => {
        onClick?.(e, location.pathname);
    };

    return (
        <Link 
            to='/editor' 
            id={styles.add} 
            className={location.pathname === '/editor' ? styles.brownIcon : styles.whiteIcon} 
            onClick={clicked}
        />
    );
}

export default CreateNoteButton;