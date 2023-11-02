import styles from '../styles/Account.module.css';

const background = require('../resources/accountBackground2.jpg')

const Account = ({ name, username, email, dateCreated, noteCount, notebookCount }) => {

    dateCreated = new Date(dateCreated)?.toLocaleDateString('en-us', { month:"short", day:"numeric", year: "numeric"});

    return (
        <div className={styles.main}>
            <img id={styles.background} src={background} alt={'background'}/>
            <form className={styles.info}>
                {/* <div>Name: <b>{name ?? '-'}</b></div>
                <div>Username: <b>{username}</b></div>
                <div>Email: <b>{email ?? '-'}</b></div>
                <div>Date Created: <b>{new Date(dateCreated)
                        ?.toLocaleDateString('en-us', { month:"short", day:"numeric", year: "numeric"})}</b></div>
                <div>Number of Notebooks: <b>{notebookCount}</b></div>
                <div>Number of Notes: <b>{noteCount}</b></div> */}
                <div className={styles['row']}>
                    <label>Name:&nbsp;</label>
                    <b>{name ?? '-'}</b>
                </div>
                <div className={styles['row']}>
                    <label>Username:&nbsp;</label>
                    <b>{username}</b>
                </div>
                <div className={styles['row']}>
                    <label>Email:&nbsp;</label>
                    <b>{email ?? '-'}</b>
                </div>
                <div className={styles['read-only-row']}>
                    <label>Date Created:&nbsp;</label>
                    <b>{dateCreated}</b>
                </div>
                <div className={styles['read-only-row']}>
                    <label>Number of Notebooks:&nbsp;</label>
                    <b>{notebookCount}</b>
                </div>
                <div className={styles['read-only-row']}>
                    <label>Number of Notes:&nbsp;</label>
                    <b>{noteCount}</b>
                </div>
            </form>
        </div>
    )
}

export default Account;