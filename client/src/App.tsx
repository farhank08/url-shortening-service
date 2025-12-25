import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import './App.css';

function App() {
	return (
		<div id="app">
			<Routes>
				<Route element={<Layout />}>
					<Route
						path="/"
						element={<LandingPage />}
					/>
				</Route>
			</Routes>
		</div>
	);
}

export default App;
