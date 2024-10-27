import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => (
	<div>
		<h1  className="text-red-500">Home Page</h1>
		<Link to="/users/42">Go to User 42 Page</Link>
	</div>
);

export default HomePage;