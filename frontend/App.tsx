import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AlertProvider } from './context/AlertContext';
import Layout from './layout/Layout';
import Home from './pages/Home';
import Register from './pages/Register';
import Profile from './pages/Profile';
import RunStatus from './pages/RunStatus';
import NotFound from './pages/NotFound';
import ErrorTest from './pages/ErrorTest';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import AdminRoute from './components/AdminRoute';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
	return (
		<AlertProvider>
			<AuthProvider>
				<ThemeProvider>
					<Router>
						<ErrorBoundary>
							<Layout>
								<Routes>
									<Route path="/" element={<Home />} />
									<Route
										path="/register"
										element={<Register />}
									/>
									<Route
										path="/run-status"
										element={<RunStatus />}
									/>
									<Route
										path="/profile"
										element={<Profile />}
									/>
									<Route
										path="/error-test"
										element={<ErrorTest />}
									/>

									{/* Admin Routes */}
									<Route element={<AdminRoute />}>
										<Route
											path="/dashboard"
											element={<Dashboard />}
										/>
										<Route
											path="/users"
											element={<UserManagement />}
										/>
									</Route>

									<Route path="*" element={<NotFound />} />
								</Routes>
							</Layout>
						</ErrorBoundary>
					</Router>
				</ThemeProvider>
			</AuthProvider>
		</AlertProvider>
	);
};

export default App;
