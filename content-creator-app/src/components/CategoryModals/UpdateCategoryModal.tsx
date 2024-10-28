import React from 'react';
import { Category } from '../../types';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

interface UpdateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (category: Category) => void;
  category: Category;
}

const validationSchema = Yup.object({
  type: Yup.string()
    .required('Type is required')
    .min(2, 'Type must be at least 2 characters')
    .max(50, 'Type must be less than 50 characters'),
  label: Yup.string()
    .required('Label is required')
    .min(2, 'Label must be at least 2 characters')
    .max(50, 'Label must be less than 50 characters'),
});

const UpdateCategoryModal: React.FC<UpdateCategoryModalProps> = ({ isOpen, onClose, onSubmit, category: initialCategory }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-text-light dark:text-text-dark">Update Category</h2>
        <Formik
          initialValues={initialCategory}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            onSubmit(values);
          }}
          enableReinitialize
        >
          {({ errors, touched }) => (
            <Form className="space-y-4">
              <div>
                <label 
                  htmlFor="type"
                  className="block text-sm font-medium text-text-light dark:text-text-dark mb-2"
                >
                  Type
                </label>
                <Field
                  id="type"
                  name="type"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark rounded-md focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-light focus:z-10 sm:text-sm"
                  placeholder="Enter category type"
                />
                {errors.type && touched.type && (
                  <div className="text-red-500 text-sm mt-1">{errors.type}</div>
                )}
              </div>

              <div>
                <label 
                  htmlFor="label"
                  className="block text-sm font-medium text-text-light dark:text-text-dark mb-2"
                >
                  Label
                </label>
                <Field
                  id="label"
                  name="label"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark rounded-md focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-light focus:z-10 sm:text-sm"
                  placeholder="Enter category label"
                />
                {errors.label && touched.label && (
                  <div className="text-red-500 text-sm mt-1">{errors.label}</div>
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

export default UpdateCategoryModal;
