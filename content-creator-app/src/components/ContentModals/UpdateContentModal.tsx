import { useEffect } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { ExplorerData, ContentItemResponse } from '../../types';

interface UpdateContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { 
    title: string;
    themesIds: string[];
    values: { categoryId: string; value: string; }[];
  }) => void;
  explorerData: ExplorerData | null;
  content: ContentItemResponse | null;
}

// Add validation schema
const UpdateContentSchema = Yup.object().shape({
  title: Yup.string()
    .required('El título es requerido')
    .min(3, 'El título debe tener al menos 3 caracteres'),
  themesIds: Yup.array()
    .of(Yup.string())
    .min(1, 'Debe seleccionar un tema')
    .required('El tema es requerido'),
  values: Yup.array().of(
    Yup.object().shape({
      categoryId: Yup.string().required('La categoría es requerida'),
      value: Yup.string().required('El valor es requerido'),
    })
  ),
});

function UpdateContentModal({ isOpen, onClose, onSubmit, explorerData, content }: UpdateContentModalProps) {
  if (!isOpen || !explorerData || !content) return null;

  const initialValues = {
    title: content.title,
    themesIds: [content.themesIds[0]._id],
    values: content.values.map(v => ({
      categoryId: v.categoryId._id,
      value: v.value
    })),
    currentCategory: '',
    currentValue: '',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-text-light dark:text-text-dark">Actualizar Contenido</h2>
        
        <Formik
          initialValues={initialValues}
          validationSchema={UpdateContentSchema}
          onSubmit={(values) => {
            onSubmit({
              title: values.title,
              themesIds: values.themesIds,
              values: values.values,
            });
          }}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                  Título:
                </label>
                <Field
                  id="title"
                  name="title"
                  type="text"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark rounded-md focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-light focus:z-10 sm:text-sm"
                />
                {errors.title && touched.title && (
                  <div className="text-red-500 text-sm mt-1">{errors.title}</div>
                )}
              </div>

              <div>
                <label htmlFor="themesIds[0]" className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                  Tema:
                </label>
                <Field
                  as="select"
                  name="themesIds[0]"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark rounded-md focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-light focus:z-10 sm:text-sm"
                >
                  <option value="">Seleccionar tema</option>
                  {explorerData.themes.map(theme => (
                    <option key={theme._id} value={theme._id}>{theme.name}</option>
                  ))}
                </Field>
                {errors.themesIds && touched.themesIds && (
                  <div className="text-red-500 text-sm mt-1">{errors.themesIds}</div>
                )}
              </div>

              <FieldArray name="values">
                {({ push, remove }) => (
                  <div>
                    <div className="flex gap-4 items-end">
                      <div className="flex-1">
                        <Field
                          as="select"
                          name="currentCategory"
                          className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark rounded-md focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-light focus:z-10 sm:text-sm"
                        >
                          <option value="">Seleccionar categoría</option>
                          {explorerData.themes
                            .find(theme => theme._id === values.themesIds[0])
                            ?.categoriesIds.map(category => (
                              <option key={category._id} value={category._id}>{category.label}</option>
                            ))}
                        </Field>
                      </div>
                      <div className="flex-1">
                        <Field
                          name="currentValue"
                          type="text"
                          className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark rounded-md focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-light focus:z-10 sm:text-sm"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (values.currentCategory && values.currentValue) {
                            push({
                              categoryId: values.currentCategory,
                              value: values.currentValue,
                            });
                            setFieldValue('currentCategory', '');
                            setFieldValue('currentValue', '');
                          }
                        }}
                        className="px-4 py-2 text-sm font-medium rounded-md text-white bg-primary-light dark:bg-primary-dark hover:bg-primary-dark dark:hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light dark:focus:ring-primary-dark"
                      >
                        Agregar
                      </button>
                    </div>

                    {/* Display values */}
                    {values.values.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-text-light dark:text-text-dark mb-2">
                          Valores agregados:
                        </h3>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4 space-y-2">
                          {values.values.map((value, index) => (
                            <div key={index} className="flex justify-between items-center py-2 px-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                              <span className="font-medium text-text-light dark:text-text-dark">
                                {explorerData.themes
                                  .find(theme => theme._id === values.themesIds[0])
                                  ?.categoriesIds.find(cat => cat._id === value.categoryId)?.label}:
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-text-light dark:text-text-dark">{value.value}</span>
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </FieldArray>

              {/* Buttons */}
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
                  Actualizar
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default UpdateContentModal;
