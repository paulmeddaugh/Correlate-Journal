import styles from '../../styles/LoginComponentStyles/ForgotPassword.module.css';
import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {

    const [username, setUsername] = useState('');
    const [reminder, setReminder] = useState('');

    const usernameRef = useRef(null);

    const validateForm = (e) => {
        
        if (username === "") {
            alert("Please enter your username.");
            usernameRef.current.focus();
            return;
        }

        axios.get(`/api/users?username=${username}`).then(response => {
            console.log(response.data._embedded.userList[0]);
            setReminder(response.data._embedded.userList[0].reminder);
        }).catch((error) => {
            alert(error.response.data);
        });
    }

    return (
        <div className={styles.body}>
            <main>
                <div className={styles.pageTitle}> Recover Account </div>

                <form>

                    <div className={styles.inputRow}>
                        <label htmlFor="usn">Username:&nbsp;</label>
                        <input 
                            type="text" 
                            id="usn" 
                            name="username" 
                            value={username}
                            ref={usernameRef}
                            onChange={(e) => setUsername(e.target.value)}
                            //onblur="chkUSN()" 
                            size="30" 
                        />
                    </div>
                
                    <input 
                        id={styles.submit}
                        type="button" 
                        className='button'
                        name="Enter" 
                        value="Get Reminder"
                        onClick={validateForm}
                    />

                    <div className={styles.recoveredPwdHeader}> Your Reminder: </div>
                    <div id={styles.pwdLoc}>{reminder}</div>

                </form>
                <br/>
                <Link className={styles.link} to="/">Login</Link>&nbsp;
                <Link className={styles.link} to="/createAccount">Create Account</Link>
            </main>
        </div>
    )
}

export default ForgotPassword;