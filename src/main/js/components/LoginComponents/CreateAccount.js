import styles from '../../styles/LoginComponentStyles/CreateAccount.module.css'; // Import css modules stylesheet as styles
import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';
import axios from 'axios';

const CREATE_USER_API_URL = '/api/users/newUser';

const CreateAccount = () => {

    const [emailInvalid, setEmailInvalid] = useState(false);
    const [nameInvalid, setNameInvalid] = useState(false);
    const [usernameInvalid, setUsernameInvalid] = useState(false);
    const [passwordInvalid, setPasswordInvalid] = useState(false);
    const [rePasswordInvalid, setRePasswordInvalid] = useState(false);
    const [reminderInvalid, setReminderInvalid] = useState(false);

    const passwordRef = useRef(null); // for checking rePassword
    const formRef = useRef(null); // for checking all inputs on submit

    const setInvalidStateMap = {
        'email': setEmailInvalid,
        'name': setNameInvalid,
        'usn': setUsernameInvalid,
        'pwd': setPasswordInvalid,
        'repwd': setRePasswordInvalid,
        'reminder': setReminderInvalid,
    }

    const checkInvalidMap = {
        'email': (value) => !/^[\w.]+@\w+\.\w+$/.test(value) ? "Please enter a valid email." : null,
        'name': (value) => !/^[a-zA-Z ]+$/.test(value) ? "Please enter a valid name." : null,
        'usn': (value) => !/^[a-zA-Z0-9@-_$]+$/.test(value) ? "Please enter a valid username." : null,
        'pwd': (value) => !(value.length >= 8 && value.length <= 15)
            ? "Please enter a password with 8-15 characters." : null,
        'repwd': (value) => !(passwordRef.current.value === value) ? "Passwords do not match." : null,
        'reminder': (value) => !(value.length > 0 && value.length <= 45) ? 
            "Reminder must be 45 characters or shorter" : null,
    };

    const checkInput = (e) => {
        const error = (e.target.value !== '') ? checkInvalidMap[e.target.name](e.target.value) : null;
        if (error !== null) {
            setInvalidStateMap[e.target.name](true);
        } else {
            setInvalidStateMap[e.target.name](false);
            e.target.removeAttribute('border');
        }
    };

    const checkAllInputs = () => {

        const user = {};

        const valid = Array.prototype.every.call(formRef.current.elements, (element) => {
            const invalid = element.type !== 'button' ? checkInvalidMap[element.name](element.value) : false 
            if (invalid) {
                setInvalidStateMap[element.name](true);
            } else {
                user[element.name] = element.value;
            }
            return !invalid;
        });

        if (!valid) {
            alert("Inputs are not yet valid.");
            return false;
        } else {
            axios.post(CREATE_USER_API_URL, {
                email: user['email'],
                username: user['usn'],
                password: user['pwd'],
                reminder: user['reminder'],
                name: user['name']
            }).then((response) => {
                alert(JSON.stringify(response.data));
            });
        }
    }

    return (
        <div className={styles.body}>
            <div>
                <form ref={formRef}>{/*onSubmit={chkEmpty}*/}
                    
                    <h1 className={styles.pageTitle}> Create Account </h1>

                    <div className={styles.inputRow}>
                        <label 
                            className={styles.label + (emailInvalid ? " " + styles.labelRed : '')}
                            htmlFor="email"> Email:&nbsp; 
                        </label>
                        <input 
                            type="text" 
                            name="email" 
                            className={emailInvalid ? " " + styles.textInputRed : null}
                            id="email" 
                            size="30" 
                            onBlur={checkInput}
                        />
                    </div>
                    <div className={styles.inputRow}>
                        <label 
                            className={styles.label + (nameInvalid ? " " + styles.labelRed : '')} 
                            htmlFor="name"> Your Name:&nbsp; 
                        </label>
                        <input 
                            type="text" 
                            name="name" 
                            className={nameInvalid ? styles.textInputRed : null}
                            id="name" 
                            size="30" 
                            onBlur={checkInput}
                        />
                    </div>
                    <div className={styles.inputRow}>
                        <label 
                            className={styles.label + (usernameInvalid ? " " + styles.labelRed : '')} 
                            htmlFor="usn"> Username:&nbsp; 
                        </label>
                        <input 
                            type="text" 
                            name="usn" 
                            className={usernameInvalid ? styles.textInputRed : null}
                            id="usn" 
                            size="30" 
                            onBlur={checkInput}
                        />
                    </div>
                    <div className={styles.inputRow}>
                        <label 
                            className={styles.label + (passwordInvalid ? " " + styles.labelRed : '')} 
                            htmlFor="pwd"> Password:&nbsp; 
                        </label>
                        <input 
                            type="password" 
                            name="pwd" 
                            className={passwordInvalid ? styles.textInputRed : null}
                            id="pwd" 
                            size="30" 
                            ref={passwordRef}
                            onBlur={checkInput}
                        />
                    </div>
                    <div className={styles.inputRow}>
                        <label 
                            className={styles.label + (rePasswordInvalid ? " " + styles.labelRed : '')} 
                            htmlFor="repwd"> Re-enter password:&nbsp; 
                        </label>
                        <input 
                            type="password" 
                            name="repwd" 
                            className={rePasswordInvalid ? styles.textInputRed : null}
                            id="repwd" 
                            size="30" 
                            onBlur={checkInput}
                        />
                    </div>
                    <div className={styles.inputRow}> 
                        <label 
                            className={styles.label + (reminderInvalid ? " " + styles.labelRed : '')} 
                            htmlFor="reminder"> Reminder:&nbsp; 
                        </label>
                        <input 
                            type="text" 
                            name="reminder" 
                            className={reminderInvalid ? styles.textInputRed : null}
                            id="reminder" 
                            size="30" 
                            onBlur={checkInput}
                        />
                    </div>
                    <input 
                        type="button" 
                        className={styles.button}
                        id="crtAcc" 
                        name="Enter" 
                        value="Create"
                        onClick={checkAllInputs}
                    />
                </form>
                <Link className={styles.link} to="/">Login</Link>&nbsp;
                <Link className={styles.link} to="/forgotPassword">Forgot Password</Link>
            </div>
        </div>
    )
}

export default CreateAccount;