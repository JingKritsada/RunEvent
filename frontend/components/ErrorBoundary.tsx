import React, { Component, ErrorInfo, ReactNode } from 'react';
import Button from './Button';

interface Props {
	children: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
		error: null,
	};

	public static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('Uncaught error:', error, errorInfo);
	}

	public handleReset = () => {
		this.setState({ hasError: false, error: null });
		window.location.href = '/';
	};

	public render() {
		if (this.state.hasError) {
			return (
				<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
					<h1 className="text-4xl font-bold text-red-600 mb-4">
						Oops! Something went wrong.
					</h1>
					<p className="text-gray-600 mb-8 max-w-md">
						{this.state.error?.message ||
							'An unexpected error occurred.'}
					</p>
					<Button onClick={this.handleReset}>Return to Home</Button>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
