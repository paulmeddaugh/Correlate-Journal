import styles from '../../styles/LoginComponentStyles/ForgotPassword.module.css';
import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';
import { sendResetPasswordEmailRequest } from '../../axios/axios';
import { invalidInputMessage } from '../../scripts/forms/validate';
import Notification from '../global/Notification';

const ForgotPassword = () => {

    const [email, setEmail] = useState('');
    const [notification, setNotification] = useState(null);

    const emailRef = useRef(null);

    const validateForm = async (e) => {

        e.preventDefault();
        
        const invalidMessage = invalidInputMessage['email'](email);
        if (invalidMessage) {
            alert(invalidMessage);
            emailRef.current.focus();
            return;
        }

        let res = null;
        try {
            res = await sendResetPasswordEmailRequest(email);
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
                <h2 className={styles.pageTitle}> Forgot Password </h2>
                <form onSubmit={validateForm}>

                    <div className={styles.inputRow}>
                        <label htmlFor="usn">Email:&nbsp;</label>
                        <input 
                            type="text" 
                            id="email" 
                            name="email" 
                            value={email}
                            ref={emailRef}
                            onChange={(e) => setEmail(e.target.value)}
                            size="30" 
                        />
                    </div>
                    <div className={styles.linkInformation}>
                        A link to reset your password will be sent to your email and remain active for 24 hours.
                    </div>
                    {notification && <Notification type={notification.type} className={styles.notification} onClose={() => setNotification(null)}>
                        {notification.text}
                    </Notification>}
                    <input 
                        id={styles.submit}
                        type="submit" 
                        className='button'
                        name="Enter" 
                        value="Reset Password"
                    />
                </form>
                <br/>
                <Link className={styles.link} to="/">Login</Link>&nbsp;
                <Link className={styles.link} to="/createAccount">Create Account</Link>
            </main>
        </div>
    )
}

export default ForgotPassword;