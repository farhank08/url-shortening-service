import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
	return (
		<header>
			<Link
				className={styles.logo}
				to={'/'}
			>
				Url Shortener
			</Link>
		</header>
	);
};
export default Header;
