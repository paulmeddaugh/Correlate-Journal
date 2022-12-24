import axios from 'axios';
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/LoginComponentStyles/Login.module.css'; // Import css modules stylesheet as styles

const Login = ({ onValidUser, onLoadingUser, onLoginError }) => {

    const [username, setUsername] = useState('AtLongLast');
    const [password, setPassword] = useState('Thoughts');
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);

    const validateForm = (e) => {
        
        // Builds error message if error
        let error = null, focusRef = null;
        if (username === "") {
            error = "Please enter your username.";
            focusRef = usernameRef;
        }
        if (password === "") {
            error = (error) ? 
                error.substring(0, error.length - 1) + " and password." : "Please enter your password.";
            if (!focusRef) focusRef = passwordRef;
        }

        if (error) {
            alert(error);
            focusRef.current.focus();
            e.preventDefault();
        } else {
            onLoadingUser();

            axios.get(`/api/users?username=${username}&password=${password}`).then(response => {
                console.log(response.data._embedded.userList[0]);
                onValidUser(response.data._embedded.userList[0]);
            }).catch((error) => {
                if (String(error.response.data).startsWith('Proxy error')) {
                    onLoginError();
                } else {
                    alert(error.response.data);
                }
                
            });
        }
    }

    return (
        <div className={styles.flexCenter + " " + styles.body}>
            <div className={styles.title}>Correlate Journal</div>
            <div id={styles.journal}></div>
            <div>
                <form className={styles.form}>
                    <div className={styles.inputRow}>
                        <label 
                            className={styles.label + " " + styles.textAlignCenter}
                        > 
                            &nbsp;Journal Belongs To:&nbsp; 
                        </label><br />
                        <input 
                            type="text" 
                            id="Username" 
                            className={styles.textAlignCenter}
                            placeholder="Username"
                            ref={usernameRef}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} 
                        />
                    </div>
                    <div className={styles.inputRow}>
                        <label 
                            className={styles.label + " " + styles.textAlignCenter}
                        > 
                            &nbsp;Password:&nbsp; 
                        </label><br />
                        <input 
                            type="password" 
                            id="Password" 
                            className={styles.textAlignCenter}
                            placeholder="Password"
                            ref={passwordRef} 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => {if (e.key === 'Enter') validateForm(e)}}
                        />
                    </div>
                    <div className={styles.submitContainer}>
                        <input 
                            type="button" 
                            id="login" 
                            value="Login"
                            onClick={validateForm}
                        />
                    </div>
                </form>
                <div className={styles.linksContainer}>
					<Link className={styles.link} to="createAccount">Create Account</Link>
                    <Link className={styles.link}  to="forgotPassword">Forgot Password</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;