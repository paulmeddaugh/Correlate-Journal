import { forwardRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/Header.module.css';
import AboutModal from './AboutModal';

const Header = ({ username, onLogoClick, onMount }, ref) => {

    const [showAboutModel, setShowAboutModel] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        onMount?.(navigate);
    }, []);

    return (
        <div id="header" ref={ref}>
            <nav className={"navbar navbar-expand-lg navbar-light " + styles.headerColor}>
                <div className="container-fluid flex-column flex-sm-row bd-navbar">
                    <div className={styles.leftContainer}>
                        <a 
                            className={`navbar-brand ${styles.brandLink}`} 
                            href="#" onClick={onLogoClick}
                        > 
                            thoughtweb
                        </a>
                    </div>
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
                                    Thought Wall 
                                </button>
                            </Link>
                            <button 
                                className="btn btn-outline-light border-0 me-2" 
                                type="button" 
                                id={styles.about}
                                onClick={(e) => setShowAboutModel(true)}
                            >
                                About 
                            </button>
                        </div>
                    </div>
                    <ul className={`navbar-nav flex-row ml-md-auto d-md-flex flex1`}>
                        <div className="flex1"></div>
                        <Link to="account" className={styles.accountLink}>Account: {username}</Link>
                    </ul>
                </div>
            </nav>
            <AboutModal
                show={showAboutModel}
                onHide={() => setShowAboutModel(false)}
            />
        </div>
    );
}

export default forwardRef(Header);