import { useState, useEffect } from 'react';
import { useTheme } from '../utils';
import { ContentItemResponse, User, ExplorerData } from '../types';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateContentModal from './ContentModals/CreateContentModal';
import UpdateContentModal from './ContentModals/UpdateContentModal';
import DeleteContentModal from './ContentModals/DeleteContentModal';
import DetailsContentModal from './ContentModals/DetailsContentModal';

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

      // Fetch explorer data
      const explorerResponse = await axios.get<ExplorerData>('http://localhost:3000/api/explorer');
      setExplorerData(explorerResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
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
      fetchData();
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
      fetchData();
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
      fetchData();
    } catch (error) {
      console.error('Error deleting content:', error);
    }
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

      <main className="container mx-auto px-4 py-8 flex-grow">
        {isAuthenticated && user && (
          <div className="flex justify-between mb-6">
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
            <button
              onClick={handleCreateContent}
              className="p-2 rounded-md bg-green-500 text-white shadow-md hover:bg-green-600 transition-colors duration-200"
            >
              Crear Nuevo Contenido
            </button>
          </div>
        )}

        <div className="grid gap-6">
          {explorerData?.contents.map((content) => (
            <div
              key={content._id}
              className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md"
            >
              <h2 className="text-xl font-bold mb-2">{content.title}</h2>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleViewDetails(content)}
                  className="p-2 rounded-md bg-blue-500 text-white shadow-md hover:bg-blue-600 transition-colors duration-200"
                >
                  Ver Detalles
                </button>
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
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Updated Modal components */}
      <CreateContentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        themes={explorerData?.themes || []}
        categories={explorerData?.categories || []}
      />
      <UpdateContentModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        content={selectedContent}
        onSubmit={handleUpdateSubmit}
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

      <footer className="bg-primary-light dark:bg-primary-dark p-4 mt-auto">
        <div className="container mx-auto text-center text-white">
          <p>&copy; 2023 Explorador de Contenido. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default ContentExplorer;
