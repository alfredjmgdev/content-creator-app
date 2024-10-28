import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../utils';
import { useNavigate } from 'react-router-dom';
import { NewCategoryModal } from '../components/ContentModals';
import { Category } from '../types'
import CreateCategoryModal from '../components/CategoryModals/CreateCategoryModal';
import UpdateCategoryModal from '../components/CategoryModals/UpdateCategoryModal';
import DeleteCategoryModal from '../components/CategoryModals/DeleteCategoryModal';

const ContentCategoriesView: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:3000/api/categories', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCategories(response.data);
        setError(null);
      } catch (err) {
        if (axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)) {
          navigate('/');
          return;
        }
        setError('Failed to fetch categories');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [navigate]); // Add navigate to dependencies

  const handleCreateCategory = async (newCategory: Omit<Category, '_id'>) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post('http://localhost:3000/api/categories', newCategory, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCategories([...categories, response.data]);
      setIsCreateModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Failed to create category');
    }
  };

  const handleUpdateCategory = async (updatedCategory: Category) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(`http://localhost:3000/api/categories/${updatedCategory._id}`, updatedCategory, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCategories(categories.map(c => c._id === updatedCategory._id ? response.data : c));
      setIsUpdateModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Failed to update category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:3000/api/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCategories(categories.filter(category => category._id !== id));
      setIsDeleteModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
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
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 rounded-md bg-green-500 text-white shadow-md hover:bg-green-600 transition-colors duration-200"
            >
              New Category
            </button>
          </div>

          {loading ? (
            <div className="text-center py-4">Loading categories...</div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : (
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
                    <tr key={category._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">{category._id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">{category.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">{category.label}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                        <button
                          onClick={() => {
                            setSelectedCategory(category);
                            setIsUpdateModalOpen(true);
                          }}
                          className="px-2 py-1 mr-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCategory(category);
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
          <p>&copy; 2023 Content Categories. All rights reserved.</p>
        </div>
      </footer>

      <NewCategoryModal
        isOpen={isNewCategoryModalOpen}
        onClose={() => setIsNewCategoryModalOpen(false)}
        title="Create New Category"
      />
      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCategory}
      />
      {selectedCategory && (
        <>
          <UpdateCategoryModal
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            onSubmit={handleUpdateCategory}
            category={selectedCategory}
          />
          <DeleteCategoryModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={() => handleDeleteCategory(selectedCategory._id)}
            category={selectedCategory}
          />
        </>
      )}
    </div>
  );
};

export default ContentCategoriesView;
