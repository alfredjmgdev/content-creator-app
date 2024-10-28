import { useState } from 'react';
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
  const [title, setTitle] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [currentCategory, setCurrentCategory] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [values, setValues] = useState<{ categoryId: string; value: string; }[]>([]);

  if (!isOpen || !explorerData) return null;

  const handleAddValue = () => {
    if (currentCategory && currentValue) {
      setValues(prev => [...prev, { categoryId: currentCategory, value: currentValue }]);
      setCurrentCategory('');
      setCurrentValue('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      themesIds: [selectedTheme],
      values,
    });
    setTitle('');
    setSelectedTheme('');
    setValues([]);
  };

  // Get categories from selected theme
  const selectedCategories = explorerData.themes
    .find(theme => theme._id === selectedTheme)
    ?.categoriesIds || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-text-light dark:text-text-dark">Crear Nuevo Contenido</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="title"
              className="block text-sm font-medium text-text-light dark:text-text-dark mb-2"
            >
              Título:
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark rounded-md focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-light focus:z-10 sm:text-sm"
              required
            />
          </div>

          <div>
            <label 
              htmlFor="theme"
              className="block text-sm font-medium text-text-light dark:text-text-dark mb-2"
            >
              Tema:
            </label>
            <select
              id="theme"
              value={selectedTheme}
              onChange={(e) => {
                const newThemeId = e.target.value;
                setSelectedTheme(newThemeId);
                setValues([]);
              }}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark rounded-md focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-light focus:z-10 sm:text-sm"
              required
            >
              <option value="">Seleccionar tema</option>
              {explorerData.themes.map(theme => (
                <option 
                  key={theme._id} 
                  value={theme._id}
                >
                  {theme.name}
                </option>
              ))}
            </select>
          </div>

          {selectedTheme && (
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
                    {selectedCategories.map(category => (
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
                      const category = selectedCategories.find(cat => cat._id === value.categoryId);
                      return (
                        <div 
                          key={index}
                          className="flex justify-between items-center py-2 px-3 bg-white dark:bg-gray-800 rounded-md shadow-sm"
                        >
                          <span className="font-medium text-text-light dark:text-text-dark">
                            {category?.label}:
                          </span>
                          <span className="text-text-light dark:text-text-dark">
                            {value.value}
                          </span>
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
        </form>
      </div>
    </div>
  );
}

export default CreateContentModal;
