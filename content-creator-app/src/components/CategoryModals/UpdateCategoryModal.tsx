import React, { useState, useEffect } from 'react';
import { Category } from '../../types';

interface UpdateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (category: Category) => void;
  category: Category;
}

const UpdateCategoryModal: React.FC<UpdateCategoryModalProps> = ({ isOpen, onClose, onSubmit, category: initialCategory }) => {
  const [category, setCategory] = useState<Category>(initialCategory);

  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-text-light dark:text-text-dark">Update Category</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(category);
        }}>
          <div className="space-y-4">
            <div>
              <label 
                htmlFor="type"
                className="block text-sm font-medium text-text-light dark:text-text-dark mb-2"
              >
                Type
              </label>
              <input
                id="type"
                type="text"
                value={category.type}
                onChange={(e) => setCategory({ ...category, type: e.target.value })}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark rounded-md focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-light focus:z-10 sm:text-sm"
                placeholder="Enter category type"
                required
              />
            </div>

            <div>
              <label 
                htmlFor="label"
                className="block text-sm font-medium text-text-light dark:text-text-dark mb-2"
              >
                Label
              </label>
              <input
                id="label"
                type="text"
                value={category.label}
                onChange={(e) => setCategory({ ...category, label: e.target.value })}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark rounded-md focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-light focus:z-10 sm:text-sm"
                placeholder="Enter category label"
                required
              />
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

export default UpdateCategoryModal;
