import { useState, useEffect } from 'react';
import { useTheme } from '../utils';
import { ContentItem, ContentTheme, User, Category } from '../types';
import { useNavigate } from 'react-router-dom';
import mockUsers from '../data/mockUsers.json';
import axios from 'axios';

interface ContentCounts {
  [key: string]: number;
}

function ContentExplorer(): JSX.Element {
  const [contentCounts, setContentCounts] = useState<ContentCounts>({});
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [themes, setThemes] = useState<ContentTheme[]>([]);

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

        // Fetch themes and categories
        // const [themesResponse, categoriesResponse] = await Promise.all([
        //   axios.get<ContentTheme[]>('http://localhost:3000/api/themes'),
        //   axios.get<Category[]>('http://localhost:3000/api/categories')
        // ]);
        
        // setThemes(themesResponse.data);
        // setCategories(categoriesResponse.data);

        // Fetch contents
        const contentsResponse = await axios.get<ContentItem[]>('http://localhost:3000/api/contents');
        setContents(contentsResponse.data);
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

      <footer className="bg-primary-light dark:bg-primary-dark p-4 mt-auto">
        <div className="container mx-auto text-center text-white">
          <p>&copy; 2023 Explorador de Contenido. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default ContentExplorer;
