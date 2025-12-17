import React, { useState } from 'react';
import Button from '../components/Button';

const ErrorTest: React.FC = () => {
	const [shouldError, setShouldError] = useState(false);

	if (shouldError) {
		throw new Error('This is a test error triggered by the user!');
	}

	return (
		<div className="max-w-2xl mx-auto py-12 px-4 text-center">
			<h1 className="text-3xl font-bold text-gray-900 mb-6">
				Error Test Page
			</h1>
			<p className="text-gray-600 mb-8">
				Click the button below to trigger a React rendering error. This
				will be caught by the Error Boundary.
			</p>
			<div className="flex justify-center">
				<Button onClick={() => setShouldError(true)} variant="danger">
					Trigger Error
				</Button>
			</div>
		</div>
	);
};

export default ErrorTest;
