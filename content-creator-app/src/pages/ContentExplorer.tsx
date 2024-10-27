import { useState, useEffect } from 'react';
import { useTheme } from '../utils';
import sampleContent from '../data/sampleContent.json';
import contentCategories from '../data/contentCategories.json';
import contentThemes from '../data/contentThemes.json';
import { NewContentModal, DeleteConfirmationModal, ContentDetailsModal } from '../components/ContentModals';
import { ContentItem, ContentTheme, User } from '../types';
import { useNavigate } from 'react-router-dom';
import mockUsers from '../data/mockUsers.json';
import axios from 'axios';

interface ContentCounts {
  [key: string]: number;
}

function ContentExplorer() {
  const [contentCounts, setContentCounts] = useState<ContentCounts>({});
  const [nameSearch, setNameSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [themeSearch, setThemeSearch] = useState('');
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const { isDarkMode, toggleTheme } = useTheme();
  const [isNewContentModalOpen, setIsNewContentModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [contents, setContents] = useState<ContentItem[]>([]);

  const getUsernameById = (userId: string): string => {
    const user = mockUsers.find(user => user.id === userId);
    return user ? user.username : 'Unknown User';
  };

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const fetchData = async () => {
      try {
        // Fetch user data if authenticated
        if (authToken) {
          const userResponse = await axios.get<User>('http://localhost:3000/api/users/me', {
            headers: { Authorization: `Bearer ${authToken}` }
          });
          setIsAuthenticated(true);
          setUser(userResponse.data);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }

        // Fetch contents
        const contentsResponse = await axios.get<ContentItem[]>('http://localhost:3000/api/contents');
        setContents(contentsResponse.data);
        setFilteredContent(contentsResponse.data);

        // Count content types
        const counts = contentsResponse.data.reduce((acc, item) => {
          item.values.forEach(value => {
            const category = contentCategories.find(cat => cat.id === value.categoryId);
            if (category) {
              acc[category.type] = (acc[category.type] || 0) + 1;
            }
          });
          return acc;
        }, {} as ContentCounts);
        setContentCounts(counts);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (authToken) {
          localStorage.removeItem('authToken');
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter content based on search, category, and theme selection
    const filtered = contents.filter(item => {
      const matchesTitle = item.title.toLowerCase().includes(nameSearch.toLowerCase());
      const matchesCategory = selectedCategories.length === 0 || item.values.some(value =>
        selectedCategories.includes(value.categoryId)
      );
      const matchesTheme = themeSearch === '' || contentThemes.some(theme =>
        item.themesIds.includes(theme.id) && theme.name.toLowerCase().includes(themeSearch.toLowerCase())
      );
      return matchesTitle && matchesCategory && matchesTheme;
    });
    setFilteredContent(filtered);
  }, [nameSearch, selectedCategories, themeSearch, contents]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSelectAllCategories = () => {
    setSelectedCategories(
      selectedCategories.length === contentCategories.length
        ? []
        : contentCategories.map(category => category.id)
    );
  };

  const handleCreateContent = (newContent: ContentItem) => {
    console.log('Creating new content:', newContent);
    setFilteredContent(prevContent => [...prevContent, { 
      ...newContent, 
      id: Date.now().toString(), 
      createdAt: new Date().toISOString(),
      userId: 'currentUserId' // Add this line (replace 'currentUserId' with actual user ID when implemented)
    }]);
  };

  const handleUpdateContent = (updatedContent: ContentItem) => {
    console.log('Updating content:', updatedContent);
    setFilteredContent(prevContent =>
      prevContent.map(item => (item.id === updatedContent.id ? updatedContent : item))
    );
  };

  const handleDeleteContent = (contentId: string) => {
    console.log('Deleting content:', contentId);
    setFilteredContent(prevContent => prevContent.filter(item => item.id !== contentId));
    setIsDeleteModalOpen(false);
  };

  const handleViewDetails = (content: ContentItem) => {
    setSelectedContent(content);
    setIsDetailsModalOpen(true);
  };

  // Add this function to check user permissions
  const canManageContent = () => {
    return isAuthenticated && user && (user.type === 'creator' || user.type === 'admin');
  };

  const canManageThemesAndCategories = () => {
    return isAuthenticated && user && user.type === 'admin';
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <header className="bg-primary-light dark:bg-primary-dark p-4">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <h1 className="text-2xl font-bold text-white">Explorador de Contenido</h1>
          <div className="flex sm:flex-row flex-col justify-center sm:justify-end sm:space-y-0 gap-[10px]">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="p-2 rounded-md bg-blue-500 text-white shadow-md hover:bg-blue-600 transition-colors duration-200"
                >
                  Hola, {user.username}
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate('/signup')}
                  className="p-2 rounded-md bg-green-500 text-white shadow-md hover:bg-green-600 transition-colors duration-200"
                >
                  Registrarse
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="p-2 rounded-md bg-blue-500 text-white shadow-md hover:bg-blue-600 transition-colors duration-200"
                >
                  Iniciar Sesión
                </button>
              </>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 space-y-8 flex-grow">
        <div className="flex sm:flex-row flex-col justify-center space-x-4 mb-8">
          {contentCategories.map(category => (
            <div key={category.id} className="text-center">
              <p className="text-2xl font-bold text-primary-light dark:text-primary-dark">
                {contentCounts[category.type] || 0}
              </p>
              <p className="text-sm text-text-light dark:text-text-dark text-center">{category.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-light focus:z-10 sm:text-sm"
          />
          <input
            type="text"
            placeholder="Filtrar por tema"
            value={themeSearch}
            onChange={(e) => setThemeSearch(e.target.value)}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-light focus:z-10 sm:text-sm"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleSelectAllCategories}
            className="mb-2 px-3 py-1 text-sm bg-primary-light dark:bg-primary-dark text-white rounded-md hover:opacity-80"
          >
            {selectedCategories.length === contentCategories.length ? 'Deseleccionar todas las categorías' : 'Seleccionar todas las categorías'}
          </button>
          <div className="flex flex-wrap justify-center gap-4">
            {contentCategories.map(category => (
              <label key={category.id} className="flex items-center space-x-2 text-text-light dark:text-text-dark">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                  className="form-checkbox"
                />
                <span>{category.label}</span>
              </label>
            ))}
          </div>
        </div>

        {canManageThemesAndCategories() && (
          <div className="flex justify-start space-x-4 mb-4">
            <button
              onClick={() => navigate('/themes')}
              className="p-2 rounded-md text-yellow-500 hover:text-yellow-600 bg-gray-100 dark:bg-gray-700 transition-colors border-2 border-yellow-500 hover:border-yellow-600"
            >
              Ver Temas
            </button>
            <button
              onClick={() => navigate('/categories')}
              className="p-2 rounded-md text-orange-500 hover:text-orange-600 bg-gray-100 dark:bg-gray-700 transition-colors border-2 border-orange-500 hover:border-orange-600"
            >
              Ver Categorías
            </button>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-primary-light dark:text-primary-dark">Contenido Filtrado</h2>
            {canManageContent() && (
              <button
                onClick={() => setIsNewContentModalOpen(true)}
                className="px-4 py-2 rounded-md bg-green-500 text-white shadow-md hover:bg-green-600 transition-colors duration-200"
              >
                Nuevo Contenido
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContent.length > 0 ? (
              filteredContent.map(item => {
                const themes = item.themesIds
                  .map(id => contentThemes.find(t => t.id === id))
                  .filter((theme): theme is ContentTheme => theme !== undefined);
                return (
                  <div key={item.id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-primary-light dark:text-primary-dark mb-2">{item.title}</h3>
                      <div className="mb-2">
                        <span className="font-medium text-gray-600 dark:text-gray-300">Temas: </span>
                        <span className="text-text-light dark:text-text-dark">
                          {themes.map(theme => (
                            <span key={theme.id} className="inline-flex items-center mr-2">
                              <img src={theme.coverImage} alt={theme.name} className="w-6 h-6 rounded-full mr-1" />
                              {theme.name}
                            </span>
                          ))}
                        </span>
                      </div>
                      <div className="mb-2">
                        <span className="font-medium text-gray-600 dark:text-gray-300">Categorías: </span>
                        <span className="text-text-light dark:text-text-dark">
                          {item.values.map(value =>
                            contentCategories.find(cat => cat.id === value.categoryId)?.label
                          ).join(', ')}
                        </span>
                      </div>
                      <div className="mb-2">
                        <span className="font-medium text-gray-600 dark:text-gray-300">Creado por: </span>
                        <span className="text-text-light dark:text-text-dark">
                          {getUsernameById(item.userId)}
                        </span>
                      </div>
                      <div className="mb-4">
                        <span className="font-medium text-gray-600 dark:text-gray-300">Creado: </span>
                        <span className="text-text-light dark:text-text-dark">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2 justify-center">
                      {isAuthenticated && (
                        <button
                          onClick={() => handleViewDetails(item)}
                          className="px-3 py-1 text-green-500 rounded hover:text-green-600 bg-gray-100 dark:bg-gray-700 transition-colors border-2 border-green-500 hover:border-green-600"
                        >
                          Ver detalles
                        </button>
                      )}
                      {canManageContent() && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedContent(item);
                              setIsNewContentModalOpen(true);
                            }}
                            className="px-3 py-1 text-blue-500 rounded hover:text-blue-600 bg-gray-100 dark:bg-gray-700 transition-colors border-2 border-blue-500 hover:border-blue-600"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => {
                              setSelectedContent(item);
                              setIsDeleteModalOpen(true);
                            }}
                            className="px-3 py-1 text-red-500 rounded hover:text-red-600 bg-gray-100 dark:bg-gray-700 transition-colors border-2 border-red-500 hover:border-red-600"
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-text-light dark:text-text-dark col-span-full text-center">No se encontraron resultados.</p>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-primary-light dark:bg-primary-dark p-4 mt-auto">
        <div className="container mx-auto text-center text-white">
          <p>&copy; 2023 Explorador de Contenido. Todos los derechos reservados.</p>
        </div>
      </footer>

      {canManageContent() && (
        <>
          <NewContentModal
            isOpen={isNewContentModalOpen}
            onClose={() => {
              setIsNewContentModalOpen(false);
              setSelectedContent(null);
            }}
            title={selectedContent ? "Actualizar Contenido" : "Crear Nuevo Contenido"}
            contentItem={selectedContent || undefined}
            onSave={selectedContent ? handleUpdateContent : handleCreateContent}
          />
          <DeleteConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            title="Confirmar Eliminación"
            onConfirm={() => selectedContent && handleDeleteContent(selectedContent.id)}
          />
        </>
      )}
      {selectedContent && (
        <ContentDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          title="Detalles del Contenido"
          content={selectedContent}
        />
      )}
    </div>
  );
}

export default ContentExplorer;
