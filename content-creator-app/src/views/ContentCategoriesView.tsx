import React, { useState } from 'react';
import contentCategories from '../data/contentCategories.json';
import { useTheme } from '../utils';
import { useNavigate } from 'react-router-dom';
import { NewCategoryModal } from '../components/ContentModals';
import { Category } from '../types'

const ContentCategoriesView: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(contentCategories);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);

  const handleCreateCategory = () => {
    const newCategory: Category = {
      id: Date.now().toString(),
      type: '',
      label: ''
    };
    setEditingCategory(newCategory);
  };

  const handleUpdateCategory = (id: string) => {
    const categoryToEdit = categories.find(category => category.id === id);
    if (categoryToEdit) {
      setEditingCategory({ ...categoryToEdit });
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(category => category.id !== id));
    }
  };

  const handleSaveCategory = () => {
    if (editingCategory) {
      if (editingCategory.id === '') {
        // Create new category
        const newId = (Math.max(...categories.map(c => parseInt(c.id))) + 1).toString();
        setCategories([...categories, { ...editingCategory, id: newId }]);
      } else {
        // Update existing category
        setCategories(categories.map(c => c.id === editingCategory.id ? editingCategory : c));
      }
      setEditingCategory(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
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
          <h1 className="text-2xl font-bold text-white">Content Categories</h1>
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
            <h2 className="text-xl font-bold text-primary-light dark:text-primary-dark">Categories</h2>
            <button
              onClick={() => setIsNewCategoryModalOpen(true)}
              className="px-4 py-2 rounded-md bg-green-500 text-white shadow-md hover:bg-green-600 transition-colors duration-200"
            >
              New Category
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Label</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">{category.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">{category.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">{category.label}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                      <button
                        onClick={() => handleUpdateCategory(category.id)}
                        className="px-2 py-1 mr-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
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
          <p>&copy; 2023 Content Categories. All rights reserved.</p>
        </div>
      </footer>

      <NewCategoryModal
        isOpen={isNewCategoryModalOpen}
        onClose={() => setIsNewCategoryModalOpen(false)}
        title="Create New Category"
      />
    </div>
  );
};

export default ContentCategoriesView;
