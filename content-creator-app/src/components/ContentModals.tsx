import React, { useState, useEffect } from 'react';
import contentCategories from '../data/contentCategories.json';
import contentThemes from '../data/contentThemes.json';
import { ContentItem, ContentTheme, Category } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-primary-dark">{title}</h2>
        {children}
      </div>
    </div>
  );
};

interface NewContentModalProps extends ModalProps {
  contentItem?: ContentItem;
  onSave: (content: ContentItem) => void;
  themes: ContentTheme[];
  categories: Category[];
}

export const NewContentModal: React.FC<NewContentModalProps> = ({ contentItem, onSave, themes, categories, ...props }) => {
  const [formData, setFormData] = useState<ContentItem>(
    contentItem || {
      id: '',
      title: '',
      themesIds: [],
      values: [],
      createdAt: '',
      userId: ''
    }
  );

  const [allowedCategories, setAllowedCategories] = useState<string[]>([]);

  useEffect(() => {
    const selectedThemes = themes.filter(theme => formData.themesIds.includes(theme._id));
    const allowedCategoryIds = new Set<string>();
    selectedThemes.forEach(theme => {
      theme.categoriesIds.forEach(category => allowedCategoryIds.add(category._id));
    });
    const newAllowedCategories = Array.from(allowedCategoryIds);
    setAllowedCategories(newAllowedCategories);

    setFormData(prev => ({
      ...prev,
      values: prev.values.filter(value => newAllowedCategories.includes(value.categoryId))
    }));
  }, [formData.themesIds, themes]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, themesIds: selectedOptions }));
  };

  const handleValueChange = (index: number, field: 'categoryId' | 'value', value: string) => {
    setFormData(prev => {
      const newValues = [...prev.values];
      if (field === 'categoryId') {
        if (allowedCategories.includes(value) || value === '') {
          newValues[index] = { ...newValues[index], [field]: value };
        }
      } else {
        newValues[index] = { ...newValues[index], [field]: value };
      }
      return { ...prev, values: newValues };
    });
  };

  const addValue = () => {
    setFormData(prev => ({
      ...prev,
      values: [...prev.values, { categoryId: '', value: '' }],
    }));
  };

  const removeValue = (index: number) => {
    setFormData(prev => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    props.onClose();
  };

  return (
    <Modal {...props}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark focus:z-10 sm:text-sm"
            placeholder="Enter title"
          />
        </div>
        <div>
          <label htmlFor="theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Theme</label>
          <select
            id="theme"
            name="themesIds"
            multiple
            value={formData.themesIds}
            onChange={handleThemeChange}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark focus:z-10 sm:text-sm"
          >
            {themes.map(theme => (
              <option key={theme._id} value={theme._id}>{theme.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Values</label>
          {formData.values.map((value, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <select
                value={value.categoryId}
                onChange={(e) => handleValueChange(index, 'categoryId', e.target.value)}
                className="appearance-none rounded-md relative block w-1/3 px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark focus:z-10 sm:text-sm"
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option 
                    key={category._id} 
                    value={category._id}
                    disabled={!allowedCategories.includes(category._id)}
                  >
                    {category.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={value.value}
                onChange={(e) => handleValueChange(index, 'value', e.target.value)}
                className="appearance-none rounded-md relative block w-2/3 px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark focus:z-10 sm:text-sm"
                placeholder="Enter value"
              />
              <button
                type="button"
                onClick={() => removeValue(index)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addValue}
            className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Add Value
          </button>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={props.onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const NewThemeModal: React.FC<ModalProps> = (props) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const allCategoryIds = contentCategories.map(category => category.id);
  const allSelected = selectedCategories.length === allCategoryIds.length;

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleToggleAll = () => {
    setSelectedCategories(allSelected ? [] : allCategoryIds);
  };

  return (
    <Modal {...props}>
      <form className="space-y-4">
        <div>
          <label htmlFor="name" className="sr-only">Name</label>
          <input type="text" id="name" name="name" className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark focus:z-10 sm:text-sm" placeholder="Name" />
        </div>
        <div>
          <label htmlFor="description" className="sr-only">Description</label>
          <textarea id="description" name="description" rows={3} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark focus:z-10 sm:text-sm" placeholder="Description"></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categories</label>
          <div className="space-y-2">
            {contentCategories.map(category => (
              <div key={category.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`category-${category.id}`} className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                  {category.label}
                </label>
              </div>
            ))}
          </div>
          <div className="mt-2">
            <button
              type="button"
              onClick={handleToggleAll}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {allSelected ? "Deselect All" : "Select All"}
            </button>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={props.onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Create
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const NewCategoryModal: React.FC<ModalProps> = (props) => (
  <Modal {...props}>
    <form className="space-y-4">
      <div>
        <label htmlFor="type" className="sr-only">Type</label>
        <input type="text" id="type" name="type" className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark focus:z-10 sm:text-sm" placeholder="Type" />
      </div>
      <div>
        <label htmlFor="label" className="sr-only">Label</label>
        <input type="text" id="label" name="label" className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark focus:z-10 sm:text-sm" placeholder="Label" />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={props.onClose}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Create
        </button>
      </div>
    </form>
  </Modal>
);

interface DeleteConfirmationModalProps extends ModalProps {
  onConfirm: () => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ onConfirm, ...props }) => (
  <Modal {...props}>
    <p className="mb-4">Are you sure you want to delete this content?</p>
    <div className="flex justify-end space-x-2">
      <button
        onClick={props.onClose}
        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={() => {
          onConfirm();
          props.onClose();
        }}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Delete
      </button>
    </div>
  </Modal>
);

interface ContentDetailsModalProps extends ModalProps {
  content: ContentItem;
  themes: ContentTheme[];
  categories: Category[];
}

export const ContentDetailsModal: React.FC<ContentDetailsModalProps> = ({ content, themes, categories, ...props }) => {
  const contentThemes = themes.filter(theme => content.themesIds.includes(theme._id));

  return (
    <Modal {...props}>
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-primary-light dark:text-primary-dark">{content.title}</h3>
        <div>
          <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300">Temas:</h4>
          <ul className="list-disc list-inside text-text-light dark:text-text-dark">
            {contentThemes.map(theme => (
              <li key={theme._id}>{theme.name}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300">Categorías y Valores:</h4>
          <ul className="list-disc list-inside text-text-light dark:text-text-dark">
            {content.values.map((value, index) => {
              const category = categories.find(cat => cat._id === value.categoryId);
              return (
                <li key={index}>
                  <span className="font-medium">{category?.label}:</span> {value.value}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={props.onClose}
          className="px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded hover:opacity-80 transition-opacity"
        >
          Cerrar
        </button>
      </div>
    </Modal>
  );
};
