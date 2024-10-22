import styles from '../../styles/LoginComponentStyles/ChangePassword.module.css';
import { Link, useSearchParams } from 'react-router-dom';
import { useRef, useState } from 'react';
import { updatePassword } from '../../axios/axios';
import { invalidInputMessage } from '../../scripts/forms/validate';
import Notification from '../global/Notification';

const UpdatePassword = () => {

    const [searchParams] = useSearchParams();
    
    const [password, setPassword] = useState('');
    const [notification, setNotification] = useState(null);

    const passwordRef = useRef(null);
    
    const validateForm = async (e) => {
        
        e.preventDefault();
        
        if (!invalidInputMessage['pwd'](password)) {
            alert("Please enter a valid password.");
            passwordRef.current.focus();
            return;
        }

        const token = searchParams.get('token');
        let res = null;
        try {
            res = await updatePassword(token, password);
        } catch (err) {
            res = err?.response || err;
        } finally {
            const notifType = !res?.data?.message ? 'error' : 'success';
            setNotification({ type: notifType, text: notifType === 'success' ? res?.data?.message : (res?.data?.error || res?.data) });
        }
    }

    return (
        <div className={styles.body}>
            <main className={styles.content}>
                <h2 className={styles.pageTitle}> Change Password </h2>
                <form onSubmit={validateForm}>
                    {notification && <Notification type={notification.type} className={styles.notification} onClose={() => setNotification(null)}>
                        {notification.text}
                    </Notification>}
                    <div className={styles.inputRow}>
                        <label htmlFor="usn" className={styles.label}>New Password:&nbsp;</label>
                        <input 
                            type="text" 
                            id="pwd" 
                            name="password" 
                            value={password}
                            ref={passwordRef}
                            onChange={(e) => setPassword(e.target.value)}
                            size="30" 
                        />
                    </div>
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