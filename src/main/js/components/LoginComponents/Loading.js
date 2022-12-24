import appStyles from '../../styles/App.module.css';
import styles from '../../styles/LoginComponentStyles/Loading.module.css';

const Loading = ({ status, linkText, onLinkClick }) => {
    return (
        <div className={appStyles.fullSize + ' ' + styles.container}>
            <div className={styles.loadingIcon} />
            <div className={styles.text}>{status}</div>
            <div className={styles.link} onClick={onLinkClick}>{linkText}</div>
        </div>
    );
}
export default Loading;