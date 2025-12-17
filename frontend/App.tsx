import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './layout/Layout';
import Home from './pages/Home';
import Register from './pages/Register';
import Profile from './pages/Profile';
import RunStatus from './pages/RunStatus';
import NotFound from './pages/NotFound';
import ErrorTest from './pages/ErrorTest';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
	return (
		<AuthProvider>
			<Router>
				<ErrorBoundary>
					<Layout>
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/register" element={<Register />} />
							<Route path="/run-status" element={<RunStatus />} />
							<Route path="/profile" element={<Profile />} />
							<Route path="/error-test" element={<ErrorTest />} />
							<Route path="*" element={<NotFound />} />
						</Routes>
					</Layout>
				</ErrorBoundary>
			</Router>
		</AuthProvider>
	);
};

export default App;
