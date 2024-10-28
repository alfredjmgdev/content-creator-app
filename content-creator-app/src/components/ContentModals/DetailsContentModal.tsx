import { ContentItem, ContentItemResponse, ExplorerData } from '../../types';

interface DetailsContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: ContentItemResponse | null;
  explorerData: ExplorerData | null;
}

function DetailsContentModal({ isOpen, onClose, content, explorerData }: DetailsContentModalProps) {
  if (!isOpen || !content || !explorerData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-text-light dark:text-text-dark">Detalles del Contenido</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-text-light dark:text-text-dark mb-2">Título</h3>
            <p className="text-text-light dark:text-text-dark">{content.title}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-text-light dark:text-text-dark mb-2">Temas</h3>
            <ul className="list-disc pl-4 text-text-light dark:text-text-dark">
              {content.themesIds.map(theme => (
                <li key={theme._id}>{theme.name}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-text-light dark:text-text-dark mb-2">Categorías</h3>
            {content.values.map(value => (
              <div key={value._id} className="mb-2">
                <span className="font-medium text-text-light dark:text-text-dark">
                  {value.categoryId.label}: 
                </span>
                <span className="text-text-light dark:text-text-dark"> {value.value}</span>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-sm font-medium text-text-light dark:text-text-dark mb-2">Fecha de Creación</h3>
            <p className="text-text-light dark:text-text-dark">
              {new Date(content.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-md text-text-light dark:text-text-dark bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailsContentModal;
