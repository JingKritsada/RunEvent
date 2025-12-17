import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './layout/Layout';
import Home from './pages/Home';
import Register from './pages/Register';
import Profile from './pages/Profile';
import RunStatus from './pages/RunStatus';
import NotFound from './pages/NotFound';

// Using HashRouter as per prompt constraints regarding URL manipulation
const App: React.FC = () => {
	return (
		<AuthProvider>
			<ThemeProvider>
				<Router>
					<Layout>
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/register" element={<Register />} />
							<Route path="/run-status" element={<RunStatus />} />
							<Route path="/profile" element={<Profile />} />
							<Route path="*" element={<NotFound />} />
						</Routes>
					</Layout>
				</Router>
			</ThemeProvider>
		</AuthProvider>
	);
};

export default App;
