import styles from '../../styles/LoginComponentStyles/ForgotPassword.module.css';
import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {

    const [username, setUsername] = useState('');
    const [reminder, setReminder] = useState('');
    const [password, setPassword] = useState('');

    const usernameRef = useRef(null);
    const reminderRef = useRef(null);

    const validateForm = (e) => {
        
        // Builds error message if error
        let error = null, focusRef = null;
        if (username === "") {
            error = "Please enter your username.";
            focusRef = usernameRef;
        }
        if (reminder === "") {
            error = (error) ? 
                error.substring(0, error.length - 1) + " and reminder." : "Please enter your reminder.";
            if (!focusRef) focusRef = reminderRef;
        }

        if (error) {
            alert(error);
            focusRef.current.focus();
            e.preventDefault();
        } else {
            axios.get(`/api/users?username=${username}&reminder=${reminder}`).then(response => {
                console.log(response.data._embedded.userList[0]);
                setPassword(response.data._embedded.userList[0].password);
            }).catch((error) => {
                alert(error.response.data);
            });
        }
    }

    return (
        <div className={styles.body}>
            <main>
                <div className={styles.pageTitle}> Recover Password </div>

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
                
                    <div className={styles.inputRow}>
                        <label htmlFor="reminder">Reminder:&nbsp;</label>
                        <input 
                            title="" 
                            type="text" 
                            id="reminder" 
                            name="reminder" 
                            value={reminder}
                            ref={reminderRef}
                            onChange={(e) => setReminder(e.target.value)}
                            //onBlur="chkRemind()" 
                            size="30" 
                        />
                    </div>
                
                    <input 
                        type="button" 
                        className={styles.button}
                        name="Enter" 
                        value="Recover Password"
                        onClick={validateForm}
                    />

                    <div className={styles.recoveredPwdHeader}> Your Password: </div>
                    <div id={styles.pwdLoc}>{password}</div>

                </form>
                <br/>
                <Link className={styles.link} to="/">Login</Link>&nbsp;
                <Link className={styles.link} to="/createAccount">Create Account</Link>
            </main>
        </div>
    )
}

export default ForgotPassword;