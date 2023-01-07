import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Header.module.css';
import appStyles from '../styles/App.module.css';

const siteIcon = require('../resources/siteIcon.png');

const Header = ({ username, onLogoClick }, ref) => {

    return (
        <div id="header" ref={ref}>
            <nav className={"navbar navbar-expand-lg navbar-light " + styles.headerColor}>
                <div className="container-fluid flex-column flex-md-row bd-navbar">
                <a 
                    className={`navbar-brand ${styles.brandLink}`} 
                    href="#" onClick={onLogoClick}
                > 
                    thoughtweb
                </a>
                    <div className={`navbar-nav-scroll ${styles.centerContainer}`}>
                        <div>
                            <Link to="/editor">
                                <button 
                                    className="btn btn-outline-light border-0 me-2 " 
                                    type="button" 
                                    id={styles.editor}
                                > 
                                    Editor 
                                </button>
                            </Link>
                            <Link to="/">
                                <button 
                                    className="btn btn-outline-light border-0 me-2" 
                                    type="button" 
                                    id={styles.journalWall}
                                >
                                    Entry Wall 
                                </button>
                            </Link>
                        </div>
                    </div>
                    <ul className={`navbar-nav flex-row ml-md-auto d-md-flex flex1`}>
                        <div className="flex1"></div>
                        <Link to="account" className={styles.accountLink}>Account: {username}</Link>
                    </ul>
                </div>
            </nav>
        </div>
    );
}

export default forwardRef(Header);