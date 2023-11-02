import styles from '../../styles/LoginComponentStyles/ChangePassword.module.css';
import { Link, useSearchParams } from 'react-router-dom';
import { useRef, useState } from 'react';
import { updatePassword } from '../../axios/axios';
import { isInvalid } from '../../scripts/forms/validate';
import Notification from '../global/Notification';

const UpdatePassword = () => {

    const [searchParams] = useSearchParams();
    
    const [password, setPassword] = useState('');
    const [notification, setNotification] = useState(null);

    const passwordRef = useRef(null);
    
    const validateForm = async (e) => {
        
        e.preventDefault();
        
        if (!isInvalid['pwd']) {
            alert("Please enter a valid password.");
            passwordRef.current.focus();
            return;
        }
        
        const token = searchParams.get('token');
        const res = await updatePassword(token, password);
        console.log(res);
        const notificationType = !res.data.error ? 'success' : 'error';
        setNotification({ type: notificationType, text: res.data.message });
    }

    return (
        <div className={styles.body}>
            <main>
                <h2 className={styles.pageTitle}> Change Password </h2>
                <form onSubmit={validateForm}>
                    <div className={styles.inputRow}>
                        <label htmlFor="usn">Username:&nbsp;</label>
                        <input 
                            type="text" 
                            id="pwd" 
                            name="password" 
                            value={password}
                            ref={passwordRef}
                            onChange={(e) => setPassword(e.target.value)}
                            // onBlur={isInvalid['pwd']}
                            size="30" 
                        />
                    </div>
                    
                    {notification && <Notification type={notification.type} className={styles.notification} onClose={() => setNotification(null)}>
                        {notification.text}
                    </Notification>}

                    <input 
                        id={styles.submit}
                        type="submit" 
                        className='button'
                        name="Enter" 
                        value="Update Password"
                    />
                </form>
                <br/>
                <Link className={styles.link} to="/">Login</Link>&nbsp;
                <Link className={styles.link} to="/createAccount">Create Account</Link>
            </main>
        </div>
    )
}

export default UpdatePassword;