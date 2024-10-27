import React from 'react';
import { useParams } from 'react-router-dom';

interface Params {
	id: string;
}

const UserPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();

	return (
		<div>
			<h1>User Page</h1>
			<p>ID: {id}</p>
		</div>
	);
};

export default UserPage;