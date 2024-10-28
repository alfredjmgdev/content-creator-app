import { useState, useEffect } from 'react';
import { ThemeResponse, CategoryResponse } from '../../types';

interface CreateContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string, themesIds: string[], values: { categoryId: string; value: string; }[] }) => void;
  themes: ThemeResponse[]; 
  categories: CategoryResponse[]; 
}

function CreateContentModal({ isOpen, onClose, onSubmit, themes, categories }: CreateContentModalProps) {
  const [title, setTitle] = useState('');
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [categoryValues, setCategoryValues] = useState<{ categoryId: string; value: string; }[]>([]);
  const [themesState, setThemes] = useState<ThemeResponse[]>(themes);
  const [categoriesState, setCategories] = useState<CategoryResponse[]>(categories);

  useEffect(() => {
    if (isOpen) {
      setThemes(themes);
      setCategories(categories);
    } else {
      setTitle('');
      setSelectedThemes([]);
      setCategoryValues([]);
    }
  }, [isOpen, themes, categories]);

  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setSelectedThemes([]);
      setCategoryValues([]);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      themesIds: selectedThemes,
      values: categoryValues
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-text-light dark:text-text-dark">Crear Nuevo Contenido</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label 
                htmlFor="title"
                className="block text-sm font-medium text-text-light dark:text-text-dark mb-2"
              >
                Título
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark rounded-md focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-light focus:z-10 sm:text-sm"
                placeholder="Ingrese el título"
                required
              />
            </div>

            <div>
              <label htmlFor="themes" className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                Temas
              </label>
              <select
                id="themes"
                multiple
                value={selectedThemes}
                onChange={(e) => setSelectedThemes(Array.from(e.target.selectedOptions, option => option.value))}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark rounded-md focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-light focus:z-10 sm:text-sm"
              >
                {themesState.map((theme) => (
                  <option key={theme._id} value={theme._id}>
                    {theme.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                Valores
              </label>
              <button
                type="button"
                onClick={() => setCategoryValues(prev => [...prev, { categoryId: '', value: '' }])}
                className="mb-2 px-3 py-1 text-sm rounded-md text-white bg-green-500 hover:bg-green-600"
              >
                Agregar Valor
              </button>
              
              {categoryValues.map((value, index) => (
                <div key={index} className="flex flex-wrap gap-2 mb-2">
                  <select
                    value={value.categoryId}
                    onChange={(e) => {
                      setCategoryValues(prev => {
                        const newValues = [...prev];
                        newValues[index].categoryId = e.target.value;
                        return newValues;
                      });
                    }}
                    className="flex-1 min-w-[150px] px-3 py-2 border border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark rounded-md"
                  >
                    {categoriesState.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={value.value}
                    onChange={(e) => {
                      setCategoryValues(prev => {
                        const newValues = [...prev];
                        newValues[index].value = e.target.value;
                        return newValues;
                      });
                    }}
                    className="flex-1 min-w-[150px] px-3 py-2 border border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark rounded-md"
                    placeholder="Valor"
                  />
                  <button
                    type="button"
                    onClick={() => setCategoryValues(prev => prev.filter((_, i) => i !== index))}
                    className="px-3 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
          
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
        </form>
      </div>
    </div>
  );
}

export default CreateContentModal;
