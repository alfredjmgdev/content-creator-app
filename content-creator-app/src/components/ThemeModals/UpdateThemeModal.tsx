import React, { useState, useEffect } from 'react';
import { ContentTheme, Category } from '../../types';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

interface UpdateThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (theme: ContentTheme) => void;
  theme: ContentTheme;
  categories: Category[];
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be less than 50 characters'),
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  coverImage: Yup.string()
    .url('Must be a valid URL')
    .required('Cover image URL is required'),
  categoriesIds: Yup.array()
    .min(1, 'Select at least one category')
    .required('Categories are required'),
});

const UpdateThemeModal: React.FC<UpdateThemeModalProps> = ({ isOpen, onClose, onSubmit, theme: initialTheme, categories }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-text-light dark:text-text-dark">Update Theme</h2>
        <Formik
          initialValues={initialTheme}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form className="space-y-4">
              <div>
                <label 
                  htmlFor="name"
                  className="block text-sm font-medium text-text-light dark:text-text-dark mb-2"
                >
                  Name
                </label>
                <Field
                  id="name"
                  name="name"
                  type="text"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark rounded-md focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-light focus:z-10 sm:text-sm"
                  placeholder="Enter theme name"
                />
                {touched.name && errors.name && (
                  <div className="text-red-500 text-sm mt-1">{errors.name}</div>
                )}
              </div>

              <div>
                <label 
                  htmlFor="description"
                  className="block text-sm font-medium text-text-light dark:text-text-dark mb-2"
                >
                  Description
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  rows={4}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark rounded-md focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-light focus:z-10 sm:text-sm"
                  placeholder="Enter theme description"
                />
                {touched.description && errors.description && (
                  <div className="text-red-500 text-sm mt-1">{errors.description}</div>
                )}
              </div>

              <div>
                <label 
                  htmlFor="coverImage"
                  className="block text-sm font-medium text-text-light dark:text-text-dark mb-2"
                >
                  Cover Image URL
                </label>
                <Field
                  id="coverImage"
                  name="coverImage"
                  type="text"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark rounded-md focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-light focus:z-10 sm:text-sm"
                  placeholder="Enter cover image URL"
                />
                {touched.coverImage && errors.coverImage && (
                  <div className="text-red-500 text-sm mt-1">{errors.coverImage}</div>
                )}
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
                        checked={values.categoriesIds.some(cat => cat._id === category._id)}
                        onChange={() => {
                          const isSelected = values.categoriesIds.some(cat => cat._id === category._id);
                          const newCategories = isSelected
                            ? values.categoriesIds.filter(cat => cat._id !== category._id)
                            : [...values.categoriesIds, category];
                          setFieldValue('categoriesIds', newCategories);
                        }}
                        className="h-4 w-4 text-primary-light dark:text-primary-dark border-gray-300 dark:border-gray-600 rounded focus:ring-primary-light dark:focus:ring-primary-dark"
                      />
                      <span className="text-sm text-text-light dark:text-text-dark">
                        {category.label}
                      </span>
                    </label>
                  ))}
                </div>
                {touched.categoriesIds && errors.categoriesIds && (
                  <div className="text-red-500 text-sm mt-1">
                    {typeof errors.categoriesIds === 'string' ? errors.categoriesIds : 'Please select at least one category'}
                  </div>
                )}
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
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UpdateThemeModal;
