export const isInvalid = {
    'email': (value) => !/^[\w.]+@\w+\.\w+$/.test(value) ? "Please enter a valid email." : null,
    'name': (value) => !/^[a-zA-Z ]+$/.test(value) ? "Please enter a valid name." : null,
    'usn': (value) => !/^[a-zA-Z0-9@-_$]+$/.test(value) ? "Please enter a valid username." : null,
    'pwd': (value) => !(value.length >= 8 && value.length <= 15)
        ? "Please enter a password with 8-15 characters." : null,
    'repwd': (value, pwdVal) => (pwdVal !== value) ? "Passwords do not match." : null,
    'reminder': (value) => !(value.length > 0 && value.length <= 45) ? 
        "Reminder must be 45 characters or shorter" : null,
};