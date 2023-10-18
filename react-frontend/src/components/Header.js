import { forwardRef, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/Header.module.css';
import AboutModal from './AboutModal';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { BOOTSTRAP_SM_BREAKPOINT } from '../constants/constants';

const Header = ({ username, onLogoClick, onMount }, ref) => {

    const [showAboutModel, setShowAboutModel] = useState(false);

    // for hamburger styling purposes, this state adds a css module class also when collapsed
    const [isCollapsed, setCollapsed] = useState(parseInt(window.innerWidth) < BOOTSTRAP_SM_BREAKPOINT ? false : true);

    const navigate = useNavigate();

    useEffect(() => {
        onMount?.(navigate);
    }, []);
    
    useEffect(() => {
        function handleWindowResize (e) {
            const isSmScreen = parseInt(window.innerWidth) < BOOTSTRAP_SM_BREAKPOINT;
            if (isSmScreen && isCollapsed) {
                setCollapsed(false);
            } else if (!isSmScreen && !isCollapsed) {
                setCollapsed(true);
            }
        };
        window.addEventListener("resize", handleWindowResize);
    
        return () => {
            window.removeEventListener("resize", handleWindowResize);
        }
    }, [isCollapsed, setCollapsed]);

    const handleAboutClick = (e) => setShowAboutModel(true);

    return (
        <div id='header' ref={ref}>
            <Navbar expand="sm" className={styles.headerColor}>
                <Container fluid={true} className='bd-navbar'>
                    <Navbar.Brand href="#" className={`${styles.brandLink} flex1`} onClick={onLogoClick}>thoughtweb</Navbar.Brand>
                    <Navbar.Toggle 
                        aria-controls="basic-navbar-nav" 
                        className={`${styles['navbar-toggler']} ${!isCollapsed ? styles.collapsed : ''}`} 
                        onClick={(e) => setCollapsed(oldVal => !oldVal)}
                    >
                        <span className={`${styles['toggler-icon']} ${styles['top-bar']}`}></span>
                        <span className={`${styles['toggler-icon']} ${styles['middle-bar']}`}></span>
                        <span className={`${styles['toggler-icon']} ${styles['bottom-bar']}`}></span>
                    </Navbar.Toggle>
                    <Navbar.Collapse id="basic-navbar-nav" className='flex-grow-0 btn-outline-light'>
                        <Nav>
                            <Link to="/editor">
                                <Button
                                    variant='outline-light'
                                    className="border-0 me-md-2"
                                    id={styles.editor}
                                > 
                                    Editor 
                                </Button>
                            </Link>
                            <Link to="/">
                                <Button
                                    variant='outline-light' 
                                    className="border-0 me-md-2"
                                    id={styles.journalWall}
                                >
                                    Thought Wall 
                                </Button>
                            </Link>
                            <Button
                                variant='outline-light'
                                className="border-0"
                                onClick={handleAboutClick}
                            >
                                About
                            </Button>
                        </Nav>
                    </Navbar.Collapse>
                    {isCollapsed &&
                        <div className={`flex-row ml-md-auto flex1 text-center text-sm-end`}>
                            <Link to="account" className={`${styles.accountLink}`}>Account: {username}</Link>
                        </div>
                    }
                </Container>
            </Navbar>
            <AboutModal
                show={showAboutModel}
                onHide={() => setShowAboutModel(false)}
            />
        </div>
    );
}

export default forwardRef(Header);