import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ExplorerData } from '../../types';

interface CreateContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { 
    title: string;
    themesIds: string[];
    values: { categoryId: string; value: string; }[];
  }) => void;
  explorerData: ExplorerData | null;
}

function CreateContentModal({ isOpen, onClose, onSubmit, explorerData }: CreateContentModalProps) {
  const [values, setValues] = useState<{ categoryId: string; value: string; }[]>([]);
  const [currentCategory, setCurrentCategory] = useState('');
  const [currentValue, setCurrentValue] = useState('');

  if (!isOpen || !explorerData) return null;

  const validationSchema = Yup.object({
    title: Yup.string()
      .required('El título es requerido')
      .min(3, 'El título debe tener al menos 3 caracteres'),
    themesIds: Yup.string()
      .required('Debe seleccionar un tema'),
  });

  const handleAddValue = () => {
    if (currentCategory && currentValue) {
      setValues(prev => [...prev, { categoryId: currentCategory, value: currentValue }]);
      setCurrentCategory('');
      setCurrentValue('');
    }
  };

  const handleRemoveValue = (index: number) => {
    setValues(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-text-light dark:text-text-dark">Crear Nuevo Contenido</h2>
        
        <Formik
          initialValues={{
            title: '',
            themesIds: '',
          }}
          validationSchema={validationSchema}
          onSubmit={(formValues, { resetForm }) => {
            onSubmit({
              title: formValues.title,
              themesIds: [formValues.themesIds],
              values,
            });
            resetForm();
            setValues([]);
          }}
        >
          {({ values: formValues, setFieldValue }) => (
            <Form className="space-y-4">
              <div>
                <label 
                  htmlFor="title"
                  className="block text-sm font-medium text-text-light dark:text-text-dark mb-2"
                >
                  Título:
                </label>
                <Field
                  id="title"
                  name="title"
                  type="text"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark rounded-md focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-light focus:z-10 sm:text-sm"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="mt-1 text-sm text-red-600 dark:text-red-400"
                />
              </div>

              <div>
                <label 
                  htmlFor="themesIds"
                  className="block text-sm font-medium text-text-light dark:text-text-dark mb-2"
                >
                  Tema:
                </label>
                <Field
                  as="select"
                  id="themesIds"
                  name="themesIds"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark rounded-md focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-light focus:z-10 sm:text-sm"
                >
                  <option value="">Seleccionar tema</option>
                  {explorerData.themes.map(theme => (
                    <option key={theme._id} value={theme._id}>
                      {theme.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="themesIds"
                  component="div"
                  className="mt-1 text-sm text-red-600 dark:text-red-400"
                />
              </div>

              {formValues.themesIds && (
                <div>
                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <label 
                        htmlFor="category"
                        className="block text-sm font-medium text-text-light dark:text-text-dark mb-1"
                      >
                        Categoría:
                      </label>
                      <select
                        id="category"
                        value={currentCategory}
                        onChange={(e) => setCurrentCategory(e.target.value)}
                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark rounded-md focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-light focus:z-10 sm:text-sm"
                      >
                        <option value="">Seleccionar categoría</option>
                        {explorerData.themes
                          .find(theme => theme._id === formValues.themesIds)
                          ?.categoriesIds.map(category => (
                            <option 
                              key={category._id} 
                              value={category._id}
                            >
                              {category.label}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label 
                        htmlFor="value"
                        className="block text-sm font-medium text-text-light dark:text-text-dark mb-1"
                      >
                        Valor:
                      </label>
                      <input
                        id="value"
                        type="text"
                        value={currentValue}
                        onChange={(e) => setCurrentValue(e.target.value)}
                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark rounded-md focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-light focus:z-10 sm:text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddValue}
                      className="px-4 py-2 text-sm font-medium rounded-md text-white bg-primary-light dark:bg-primary-dark hover:bg-primary-dark dark:hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light dark:focus:ring-primary-dark"
                    >
                      Agregar
                    </button>
                  </div>

                  {values.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-text-light dark:text-text-dark mb-2">
                        Valores agregados:
                      </h3>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4 space-y-2">
                        {values.map((value, index) => {
                          const category = explorerData.themes
                            .find(theme => theme._id === formValues.themesIds)
                            ?.categoriesIds.find(cat => cat._id === value.categoryId);
                          return (
                            <div 
                              key={index}
                              className="flex justify-between items-center py-2 px-3 bg-white dark:bg-gray-800 rounded-md shadow-sm"
                            >
                              <span className="font-medium text-text-light dark:text-text-dark">
                                {category?.label}:
                              </span>
                              <div className="flex items-center gap-3">
                                <span className="text-text-light dark:text-text-dark">
                                  {value.value}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveValue(index)}
                                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
                                  title="Eliminar"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium rounded-md text-text-light dark:text-text-dark bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium rounded-md text-white bg-primary-light dark:bg-primary-dark hover:bg-primary-dark dark:hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light dark:focus:ring-primary-dark"
                >
                  Crear
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default CreateContentModal;
