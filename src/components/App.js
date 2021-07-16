import './App.module.scss';
import Styles from './App.module.scss';
import Header from './Header';
import AddFixture from './AddFixture';
import ActiveFixtures from './ActiveFixtures';

function App() {
	return (
		<div>
			<Header />
			<div className={Styles.body}>
				<AddFixture />
				<ActiveFixtures />
			</div>
		</div>
	);
}

export default App;