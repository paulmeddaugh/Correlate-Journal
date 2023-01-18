import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import styles from '../styles/AboutModel.module.css';

function AboutModal(props) {
	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter" className={styles.title}>
					About <span className={styles.thoughtweb}>thoughtweb</span>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p className={styles.description}>
					This is an online journal for sorting entries or thoughts primarily by idea, utilizing
					connection of entries to each other, different notebooks, and note types. A notebook 
					and pencil are an amazing way to process or record daily thoughts, but when a snowballing 
					or reconsidering idea keeps reoccuring, it can be difficult to follow train of thought on 
					it amidst non-related notes in the constant dated ordering. Therefore, this site seeks
					to address this by providing an additional web-layout for trains of thought in 
					journal entries.
				</p>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={props.onHide}>Close</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default AboutModal;