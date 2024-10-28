import { ContentItemResponse } from '../../types';

interface DeleteContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: ContentItemResponse | null;
  onSubmit: () => void;
}

function DeleteContentModal({ isOpen, onClose, content, onSubmit }: DeleteContentModalProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  if (!isOpen || !content) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-text-light dark:text-text-dark">Eliminar Contenido</h2>
        <p className="mb-6 text-text-light dark:text-text-dark">
          ¿Estás seguro que deseas eliminar "{content.title}"? Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-md text-text-light dark:text-text-dark bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteContentModal;
