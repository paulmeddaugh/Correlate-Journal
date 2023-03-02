import styles from '../styles/Account.module.css';

const background = require('../resources/accountBackground2.jpg')

const Account = ({ name, username, email, dateCreated, noteCount, notebookCount }) => {
    return (
        <div className={styles.main}>
            <img id={styles.background} src={background} alt={'background'}/>
            <div className={styles.info}>
                <div>Name: <b>{name ?? '-'}</b></div>
                <div>Username: <b>{username}</b></div>
                <div>Email: <b>{email ?? '-'}</b></div>
                <div>Date Created: <b>{new Date(dateCreated)
                        ?.toLocaleDateString('en-us', { month:"short", day:"numeric", year: "numeric"})}</b></div>
                <div>Number of Notebooks: <b>{notebookCount}</b></div>
                <div>Number of Notes: <b>{noteCount}</b></div>
            </div>
        </div>
    )
}

export default Account;