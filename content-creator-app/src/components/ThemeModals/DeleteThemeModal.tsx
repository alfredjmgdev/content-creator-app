import React from 'react';
import { ContentTheme } from '../../types';

interface DeleteThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  theme: ContentTheme;
}

const DeleteThemeModal: React.FC<DeleteThemeModalProps> = ({ isOpen, onClose, onConfirm, theme }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-text-light dark:text-text-dark">Delete Theme</h2>
        <p className="mb-6 text-text-light dark:text-text-dark">
          Are you sure you want to delete the theme "{theme.name}"? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-md text-text-light dark:text-text-dark bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteThemeModal;
