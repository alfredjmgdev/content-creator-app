import React, { useState, useEffect } from 'react';
import { ContentTheme, Category } from '../../types';

interface UpdateThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (theme: ContentTheme) => void;
  theme: ContentTheme;
  categories: Category[];
}

const UpdateThemeModal: React.FC<UpdateThemeModalProps> = ({ isOpen, onClose, onSubmit, theme: initialTheme, categories }) => {
  const [theme, setTheme] = useState<ContentTheme>(initialTheme);

  useEffect(() => {
    setTheme(initialTheme);
  }, [initialTheme]);

  const handleCategoryChange = (category: Category) => {
    const isSelected = theme.categoriesIds.some(cat => cat._id === category._id);
    let newCategories;
    
    if (isSelected) {
      newCategories = theme.categoriesIds.filter(cat => cat._id !== category._id);
    } else {
      newCategories = [...theme.categoriesIds, category];
    }
    
    setTheme({ ...theme, categoriesIds: newCategories });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-text-light dark:text-text-dark">Update Theme</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(theme);
        }}>
          <div className="space-y-4">
            <div>
              <label 
                htmlFor="name"
                className="block text-sm font-medium text-text-light dark:text-text-dark mb-2"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                value={theme.name}
                onChange={(e) => setTheme({ ...theme, name: e.target.value })}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark rounded-md focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark focus:z-10 sm:text-sm"
                placeholder="Enter theme name"
                required
              />
            </div>

            <div>
              <label 
                htmlFor="description"
                className="block text-sm font-medium text-text-light dark:text-text-dark mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                value={theme.description}
                onChange={(e) => setTheme({ ...theme, description: e.target.value })}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark rounded-md focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark focus:z-10 sm:text-sm"
                placeholder="Enter theme description"
                required
                rows={4}
              />
            </div>

            <div>
              <label 
                htmlFor="coverImage"
                className="block text-sm font-medium text-text-light dark:text-text-dark mb-2"
              >
                Cover Image URL
              </label>
              <input
                id="coverImage"
                type="text"
                value={theme.coverImage}
                onChange={(e) => setTheme({ ...theme, coverImage: e.target.value })}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark rounded-md focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark focus:z-10 sm:text-sm"
                placeholder="Enter cover image URL"
              />
            </div>

            <div>
              <label 
                className="block text-sm font-medium text-text-light dark:text-text-dark mb-2"
              >
                Categories
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-3">
                {categories.map(category => (
                  <label
                    key={category._id}
                    className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={theme.categoriesIds.some(cat => cat._id === category._id)}
                      onChange={() => handleCategoryChange(category)}
                      className="h-4 w-4 text-primary-light dark:text-primary-dark border-gray-300 dark:border-gray-600 rounded focus:ring-primary-light dark:focus:ring-primary-dark"
                    />
                    <span className="text-sm text-text-light dark:text-text-dark">
                      {category.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-md text-text-light dark:text-text-dark bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium rounded-md text-white bg-primary-light dark:bg-primary-dark hover:bg-primary-dark dark:hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light dark:focus:ring-primary-dark"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateThemeModal;
