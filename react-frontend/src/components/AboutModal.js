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
					This site is an online journal for following trains of thought throughout date-ordered memoirs,
					providing pages further ability to tie string to any other. A notebook 
					and pencil are an amazing way to process or record thoughts, but sometimes a re-considering 
					or snow-balling idea, scattered throughout date-ordered thoughts, can be difficult to follow 
					amidst non-related ideas. Therefore, this site provides an additional web-layout for notes, 
					on top of chronological order, for following trains of thought throughout a journal.<br/>
					<br/>
					<div className='textCenter'>GitHub repository <a href='https://github.com/paulmeddaugh/thoughtweb'>here</a>.</div>
					<div className='textCenter'>Trello Board <a href='https://trello.com/b/IUqaznxv/thoughtweb'>here</a>.</div>
				</p>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={props.onHide}>Close</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default AboutModal;