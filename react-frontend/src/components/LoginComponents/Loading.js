import appStyles from '../../styles/App.module.css';
import styles from '../../styles/LoginComponentStyles/Loading.module.css';

const iconMap = {
    0: styles.loadingIcon,
    1: styles.closedIcon,
}

const Loading = ({ status, linkProps, icon = 0 }) => {
    return (
        <div className={appStyles.fullSize + ' ' + styles.container}>
            <div className={iconMap[icon]} />
            <div className={styles.text}>{status}</div>
            <div className={styles.link} onClick={linkProps.onClick}>{linkProps.text}</div>
        </div>
    );
}
export default Loading;