import styles from '../styles/Account.module.css';

const background = require('../resources/accountBackground2.jpg')

const Account = ({ user, graphValues }) => {
    return (
        <div className={styles.main}>
            <img id={styles.background} src={background} alt={'background'}/>
            <div className={styles.info}>
                <div>Name: <b>{user.name ?? '-'}</b></div>
                <div>Username: <b>{user.username}</b></div>
                <div>Email: <b>{user.email ?? '-'}</b></div>
                <div>Date Created: <b>{new Date(user.dateCreated)
                        .toLocaleDateString('en-us', { month:"short", day:"numeric", year: "numeric"})}</b></div>
                <div>Number of Notebooks: <b>{graphValues.notebookCount}</b></div>
                <div>Number of Notes: <b>{graphValues.noteCount}</b></div>
            </div>
        </div>
    )
}

export default Account;