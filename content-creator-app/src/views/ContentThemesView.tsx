import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../utils';
import { useNavigate } from 'react-router-dom';
import { ContentTheme, Category } from '../types';
import CreateThemeModal from '../components/ThemeModals/CreateThemeModal';
import UpdateThemeModal from '../components/ThemeModals/UpdateThemeModal';
import DeleteThemeModal from '../components/ThemeModals/DeleteThemeModal';

const ContentThemesView: React.FC = () => {
  const [themes, setThemes] = useState<ContentTheme[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ContentTheme | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const [themesResponse, categoriesResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/themes`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/categories`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        ]);
        setThemes(themesResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
          navigate('/');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]); // Add navigate to dependencies

  const handleCreateTheme = async (newTheme: Omit<ContentTheme, '_id'>) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/themes`, newTheme, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setThemes([...themes, response.data]);
      setIsCreateModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Error creating theme:', error);
      alert('Failed to create theme');
    }
  };

  const handleUpdateTheme = async (updatedTheme: ContentTheme) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/themes/${updatedTheme._id}`, updatedTheme, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setThemes(themes.map(t => t._id === updatedTheme._id ? response.data : t));
      setIsUpdateModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Error updating theme:', error);
      alert('Failed to update theme');
    }
  };

  const handleDeleteTheme = async (id: string) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/themes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setThemes(themes.filter(theme => theme._id !== id));
      setIsDeleteModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting theme:', error);
      alert('Failed to delete theme');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <header className="bg-primary-light dark:bg-primary-dark p-4">
        <div className="container mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-md bg-yellow-500 text-white shadow-md hover:bg-yellow-600 transition-colors duration-200"
          >
            Back to Content Explorer
          </button>
          <h1 className="text-2xl font-bold text-white">Content Themes</h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main className="container mx-auto p-4 flex-grow">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-primary-light dark:text-primary-dark">Themes</h2>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 rounded-md bg-green-500 text-white shadow-md hover:bg-green-600 transition-colors duration-200"
            >
              New Theme
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cover Image</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Categories</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {themes.map((theme) => (
                    <tr key={theme._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">{theme._id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                        <img src={theme.coverImage} alt={theme.name} className="w-10 h-10 rounded-full object-cover" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">{theme.name}</td>
                      <td className="px-6 py-4 text-sm text-text-light dark:text-text-dark">{theme.description}</td>
                      <td className="px-6 py-4 text-sm text-text-light dark:text-text-dark">
                        {theme.categoriesIds.map(category => category.label).join(', ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                        <button
                          onClick={() => {
                            setSelectedTheme(theme);
                            setIsUpdateModalOpen(true);
                          }}
                          className="px-2 py-1 mr-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTheme(theme);
                            setIsDeleteModalOpen(true);
                          }}
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-primary-light dark:bg-primary-dark p-4 mt-auto">
        <div className="container mx-auto text-center text-white">
          <p>&copy; 2023 Content Themes. All rights reserved.</p>
        </div>
      </footer>

      <CreateThemeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTheme}
        categories={categories}
      />
      {selectedTheme && (
        <>
          <UpdateThemeModal
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            onSubmit={handleUpdateTheme}
            theme={selectedTheme}
            categories={categories}
          />
          <DeleteThemeModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={() => handleDeleteTheme(selectedTheme._id)}
            theme={selectedTheme}
          />
        </>
      )}
    </div>
  );
};

export default ContentThemesView;
