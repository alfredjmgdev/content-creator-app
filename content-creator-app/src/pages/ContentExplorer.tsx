import { useState, useEffect } from 'react';
import { useTheme } from '../utils';
import { ContentItemResponse, User, ExplorerData } from '../types';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DeleteContentModal from '../components/ContentModals/DeleteContentModal';
import DetailsContentModal from '../components/ContentModals/DetailsContentModal';
import CreateContentModal from '../components/ContentModals/CreateContentModal';
import UpdateContentModal from '../components/ContentModals/UpdateContentModal';
import { io, Socket } from 'socket.io-client';

function ContentExplorer(): JSX.Element {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [explorerData, setExplorerData] = useState<ExplorerData | null>(null);
  const [selectedContent, setSelectedContent] = useState<ContentItemResponse | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Update the helper functions at the beginning of the component
  const isAdmin = user?.type === 'admin';
  const isCreatorOrAdmin = user?.type === 'creator' || user?.type === 'admin';

  // Add this new helper function
  const canManageContent = (content: ContentItemResponse) => {
    console.log('======================')
    console.log(user)
    console.log(content.userId)
    console.log('======================')
    if (!user) return false;
    if (user.type === 'admin') return true;
    if (user.type === 'creator') {
      return content.userId._id === user._id;
    }
    return false;
  };

  const fetchData = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        // Fetch user data if authenticated
        const userResponse = await axios.get<User>('http://localhost:3000/api/users/me', {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setIsAuthenticated(true);
        setUser(userResponse.data);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Initial data fetch
  const fetchExplorerData = async () => {
    try {
      const response = await axios.get<ExplorerData>('http://localhost:3000/api/explorer');
      setExplorerData(response.data);
    } catch (error) {
      console.error('Error fetching explorer data:', error);
    }
  };

  // Socket connection setup
  useEffect(() => {
    console.log('Setting up WebSocket connection...');
    const newSocket = io('http://localhost:3000', {
      transports: ['websocket'],
      autoConnect: true
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket', newSocket.id);
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    newSocket.on('contentUpdated', (updatedData: ExplorerData) => {
      console.log('Received updated content:', updatedData);
      setExplorerData(updatedData);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Disconnected from WebSocket:', reason);
    });

    // Store socket in state
    setSocket(newSocket);

    // Initial data fetches
    fetchData();
    fetchExplorerData();

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
    setIsDropdownOpen(false);
  };

  const handleCreateContent = () => {
    setIsCreateModalOpen(true);
  };

  const handleUpdateContent = (content: ContentItemResponse) => {
    setSelectedContent(content);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteContent = (content: ContentItemResponse) => {
    setSelectedContent(content);
    setIsDeleteModalOpen(true);
  };

  const handleViewDetails = (content: ContentItemResponse) => {
    setSelectedContent(content);
    setIsDetailsModalOpen(true);
  };

  const handleCreateSubmit = async (data: { title: string, themesIds: string[], values: { categoryId: string; value: string; }[] }) => {
    try {
      const authToken = localStorage.getItem('authToken');
      await axios.post(
        'http://localhost:3000/api/contents',
        data,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setIsCreateModalOpen(false);
      window.location.reload();
      // No need to fetch data, the socket will handle the update
    } catch (error) {
      console.error('Error creating content:', error);
    }
  };

  const handleUpdateSubmit = async (data: { title: string, themesIds: string[], values: { categoryId: string; value: string; }[] }) => {
    if (!selectedContent) return;
    try {
      const authToken = localStorage.getItem('authToken');
      await axios.put(
        `http://localhost:3000/api/contents/${selectedContent._id}`,
        data,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setIsUpdateModalOpen(false);
      window.location.reload();
      // No need to fetch data, the socket will handle the update
    } catch (error) {
      console.error('Error updating content:', error);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedContent) return;
    try {
      const authToken = localStorage.getItem('authToken');
      await axios.delete(
        `http://localhost:3000/api/contents/${selectedContent._id}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setIsDeleteModalOpen(false);
      window.location.reload();
      // No need to fetch data, the socket will handle the update
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  // Add these new state variables after the other useState declarations
  const [titleFilter, setTitleFilter] = useState('');
  const [themeFilter, setThemeFilter] = useState('');

  // Add new state for category filters
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

  // Update the filtering function to include categories
  const filteredContents = explorerData?.contents.filter(content => {
    const titleMatch = content.title.toLowerCase().includes(titleFilter.toLowerCase());
    const themeMatch = content.themesIds.some(theme => 
      theme.name.toLowerCase().includes(themeFilter.toLowerCase())
    );
    
    // If no categories are selected, don't filter by categories
    const categoryMatch = selectedCategories.size === 0 || 
      content.values.some(value => selectedCategories.has(value.categoryId._id));
    
    return titleMatch && themeMatch && categoryMatch;
  });

  // Add handler for category checkbox changes
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Add this function to calculate category counts
  const getCategoryCounts = () => {
    const counts: { [key: string]: number } = {};
    
    explorerData?.contents.forEach(content => {
      content.values.forEach(value => {
        const categoryId = value.categoryId._id;
        counts[categoryId] = (counts[categoryId] || 0) + 1;
      });
    });
    
    return counts;
  };

  const categoryCounts = getCategoryCounts();

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <header className="bg-primary-light dark:bg-primary-dark p-4">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <h1 className="text-2xl font-bold text-white">Content Creator App </h1>
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

      <main className="container mx-auto px-4 py-8 flex-grow">
        {isAuthenticated && user && (
          <div className="flex justify-between mb-6">
            {isAdmin && (
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/categories')}
                  className="p-2 rounded-md bg-purple-500 text-white shadow-md hover:bg-purple-600 transition-colors duration-200"
                >
                  Categorías
                </button>
                <button
                  onClick={() => navigate('/themes')}
                  className="p-2 rounded-md bg-indigo-500 text-white shadow-md hover:bg-indigo-600 transition-colors duration-200"
                >
                  Temas
                </button>
              </div>
            )}
            {isCreatorOrAdmin && (
              <button
                onClick={handleCreateContent}
                className="p-2 rounded-md bg-green-500 text-white shadow-md hover:bg-green-600 transition-colors duration-200"
              >
                Crear Nuevo Contenido
              </button>
            )}
          </div>
        )}

        {/* Add category counters section above filters */}
        <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-300 dark:border-gray-600">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Contenido por categorías:
          </h3>
          <div className="flex flex-wrap gap-3">
            {explorerData?.categories.map((category) => (
              <div 
                key={category._id}
                className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-1"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {category.label}:
                </span>
                <span className="ml-2 text-sm font-bold text-blue-600 dark:text-blue-400">
                  {categoryCounts[category._id] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Update the filter section to include category checkboxes */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Filtrar por título..."
                value={titleFilter}
                onChange={(e) => setTitleFilter(e.target.value)}
                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Filtrar por tema..."
                value={themeFilter}
                onChange={(e) => setThemeFilter(e.target.value)}
                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Add category filter section */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-300 dark:border-gray-600">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filtrar por categorías:
            </h3>
            <div className="flex flex-wrap gap-4">
              {explorerData?.categories.map((category) => (
                <label 
                  key={category._id}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.has(category._id)}
                    onChange={() => handleCategoryChange(category._id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {category.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 my-8"></div>

        {/* Content grid */}
        <div className="grid gap-6">
          {filteredContents?.map((content) => (
            <div
              key={content._id}
              className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md"
            >
              <div className="flex gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">{content.title}</h2>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>Creado por: {content.userId.username}</p>
                    <p>Fecha: {new Date(content.createdAt).toLocaleDateString()}</p>
                  </div>
                  
                  {/* Themes section */}
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Temas:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {content.themesIds.map((theme) => (
                        <div key={theme._id} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
                          <img 
                            src={theme.coverImage} 
                            alt={theme.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="text-sm">{theme.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add Categories section */}
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Categorías:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {content.values.map((value) => (
                        <div key={value._id} className="bg-blue-100 dark:bg-blue-900 rounded-lg p-2">
                          <span className="text-sm font-medium text-blue-800 dark:text-blue-100">
                            {value.categoryId.label}:
                          </span>
                          <span className="text-sm ml-1 text-blue-600 dark:text-blue-200">
                            {value.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                {isAuthenticated && (
                  <button
                    onClick={() => handleViewDetails(content)}
                    className="p-2 rounded-md bg-blue-500 text-white shadow-md hover:bg-blue-600 transition-colors duration-200"
                  >
                    Ver Detalles
                  </button>
                )}
                {canManageContent(content) && (
                  <>
                    <button
                      onClick={() => handleUpdateContent(content)}
                      className="p-2 rounded-md bg-yellow-500 text-white shadow-md hover:bg-yellow-600 transition-colors duration-200"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteContent(content)}
                      className="p-2 rounded-md bg-red-500 text-white shadow-md hover:bg-red-600 transition-colors duration-200"
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal components */}
      <CreateContentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        explorerData={explorerData}
      />
      <DeleteContentModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        content={selectedContent}
        onSubmit={handleDeleteSubmit}
      />
      <DetailsContentModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        content={selectedContent}
        explorerData={explorerData}
      />
      <UpdateContentModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSubmit={handleUpdateSubmit}
        explorerData={explorerData}
        content={selectedContent}
      />
      <footer className="bg-primary-light dark:bg-primary-dark p-4 mt-auto">
        <div className="container mx-auto text-center text-white">
          <p>&copy; 2023 Explorador de Contenido. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default ContentExplorer;
