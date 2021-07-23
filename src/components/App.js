import './App.module.scss';
import Styles from './App.module.scss';
import Header from './Header';
import AddFixture from './AddFixture';
import ActiveFixtures from './ActiveFixtures';
import { showSettings } from '../atoms';
import { useSetRecoilState } from 'recoil';

function App() {
	const toggleSettings = useSetRecoilState(showSettings);
	return (
		<div>
			<Header />
			<div className={Styles.body} onClick={() => { toggleSettings(false); }}>
				<AddFixture />
				<ActiveFixtures />
			</div>
		</div>
	);
}

export default App;