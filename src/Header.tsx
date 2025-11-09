import styles from "./Header.module.css";
import LogoSvg from "./logo.svg";

const Header = () => {
	return (
		<div className="p-5 mx-auto text-center">
			<LogoSvg className={styles.logo} />
			<h1>Application Portal</h1>
		</div>
	);
};

export default Header;
