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
					This site is an online journal for following trains of thought throughout dated memoirs,
					providing notes further ability to connect to any others. A notebook 
					and pencil are an amazing way to process or record thoughts, but sometimes a re-considering 
					or snow-balling idea, scattered throughout date ordered thoughts, can be difficult to follow 
					amidst non-related ideas. Therefore, this site provides an 
					additional web-layout for notes, on top of chronological order, for following trains of thought 
					throughout a journal.
				</p>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={props.onHide}>Close</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default AboutModal;