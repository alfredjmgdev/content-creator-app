import React, { useState } from 'react';
import contentThemesData from '../data/contentThemes.json';
import contentCategories from '../data/contentCategories.json';
import { useTheme } from '../utils';
import { useNavigate } from 'react-router-dom';
import { NewThemeModal } from '../components/ContentModals';
import { ContentTheme } from '../types';

const ContentThemesView: React.FC = () => {
  const [themes, setThemes] = useState<ContentTheme[]>(contentThemesData);
  const [editingTheme, setEditingTheme] = useState<ContentTheme | null>(null);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isNewThemeModalOpen, setIsNewThemeModalOpen] = useState(false);

  const handleCreateTheme = () => {
    const newTheme: ContentTheme = {
      id: String(Math.max(...themes.map(t => Number(t.id))) + 1),
      name: '',
      description: '',
      categoriesIds: [],
      coverImage: ''
    };
    setEditingTheme(newTheme);
  };

  const handleUpdateTheme = (id: string) => {
    const themeToEdit = themes.find(theme => theme.id === id);
    if (themeToEdit) {
      setEditingTheme({ ...themeToEdit });
    }
  };

  const handleDeleteTheme = (id: string) => {
    if (window.confirm('Are you sure you want to delete this theme?')) {
      setThemes(themes.filter(theme => theme.id !== id));
    }
  };

  const handleSaveTheme = () => {
    if (editingTheme) {
      if (themes.find(t => t.id === editingTheme.id)) {
        // Update existing theme
        setThemes(themes.map(t => t.id === editingTheme.id ? editingTheme : t));
      } else {
        // Create new theme
        setThemes([...themes, editingTheme]);
      }
      setEditingTheme(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingTheme(null);
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
              onClick={() => setIsNewThemeModalOpen(true)}
              className="px-4 py-2 rounded-md bg-green-500 text-white shadow-md hover:bg-green-600 transition-colors duration-200"
            >
              New Theme
            </button>
          </div>
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
                  <tr key={theme.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">{theme.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                      <img src={theme.coverImage} alt={theme.name} className="w-10 h-10 rounded-full" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">{theme.name}</td>
                    <td className="px-6 py-4 text-sm text-text-light dark:text-text-dark">{theme.description}</td>
                    <td className="px-6 py-4 text-sm text-text-light dark:text-text-dark">
                      {theme.categoriesIds.map(id => contentCategories.find(cat => cat.id === id)?.label).join(', ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                      <button
                        onClick={() => handleUpdateTheme(theme.id)}
                        className="px-2 py-1 mr-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDeleteTheme(theme.id)}
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
        </div>
      </main>

      <footer className="bg-primary-light dark:bg-primary-dark p-4 mt-auto">
        <div className="container mx-auto text-center text-white">
          <p>&copy; 2023 Content Themes. All rights reserved.</p>
        </div>
      </footer>

      <NewThemeModal
        isOpen={isNewThemeModalOpen}
        onClose={() => setIsNewThemeModalOpen(false)}
        title="Create New Theme"
      />
    </div>
  );
};

export default ContentThemesView;
