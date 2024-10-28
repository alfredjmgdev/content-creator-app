import { useState, useEffect } from 'react';
import axios from 'axios';
import { ContentItemResponse, ContentTheme, Category } from '../../types';

interface UpdateContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: ContentItemResponse | null;
  onSubmit: (data: { title: string, themesIds: string[], values: { categoryId: string; value: string; }[] }) => void;
}

function UpdateContentModal({ isOpen, onClose, content, onSubmit }: UpdateContentModalProps) {
  const [title, setTitle] = useState('');
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [categoryValues, setCategoryValues] = useState<{ categoryId: string; value: string; }[]>([]);
  const [themes, setThemes] = useState<ContentTheme[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (content) {
      setTitle(content.title);
      setSelectedThemes(content.themesIds.map(theme => theme._id));
      setCategoryValues(content.values.map(v => ({
        categoryId: v.categoryId._id,
        value: v.value
      })));
    }
  }, [content]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/explorer');
        setThemes(response.data.themes);
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (isOpen) {
      fetchData();
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

  if (!isOpen || !content) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-text-light dark:text-text-dark">Editar Contenido</h2>
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
              />
            </div>
            
            <div>
              <label 
                htmlFor="themes"
                className="block text-sm font-medium text-text-light dark:text-text-dark mb-2"
              >
                Temas
              </label>
              <select
                id="themes"
                multiple
                value={selectedThemes}
                onChange={(e) => setSelectedThemes(Array.from(e.target.selectedOptions, option => option.value))}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark rounded-md focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-light focus:z-10 sm:text-sm"
              >
                {themes.map((theme) => (
                  <option key={theme._id} value={theme._id}>
                    {theme.name}
                  </option>
                ))}
              </select>
            </div>

            {categories.map((category) => (
              <div key={category._id}>
                <label 
                  htmlFor={`category-${category._id}`}
                  className="block text-sm font-medium text-text-light dark:text-text-dark mb-2"
                >
                  {category.label}
                </label>
                <input
                  id={`category-${category._id}`}
                  type="text"
                  value={categoryValues.find(cv => cv.categoryId === category._id)?.value || ''}
                  onChange={(e) => {
                    setCategoryValues(prev => {
                      const newValues = [...prev];
                      const index = newValues.findIndex(cv => cv.categoryId === category._id);
                      if (index >= 0) {
                        newValues[index].value = e.target.value;
                      } else {
                        newValues.push({ categoryId: category._id, value: e.target.value });
                      }
                      return newValues;
                    });
                  }}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark rounded-md focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-light focus:z-10 sm:text-sm"
                />
              </div>
            ))}
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
              Actualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateContentModal;
