import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, Timestamp, onSnapshot } from 'firebase/firestore';
import { db } from '../utils/FirebaseConfig';

// Definir la interfaz para los comentarios
interface Comment {
  id?: string;
  comentario: string;
  fecha: Date | Timestamp;
  libro: string;
}

// Definir la interfaz para el contexto
interface CommentsContextType {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  addComment: (comment: Omit<Comment, 'id' | 'fecha'>) => Promise<void>;
  updateComment: (id: string, updatedComment: Partial<Omit<Comment, 'id'>>) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  getCommentsByBook: (bookId: string) => Comment[];
  refreshComments: () => Promise<void>;
}

// Crear el contexto
export const CommentsContext = createContext<CommentsContextType | undefined>(undefined);

// Props para el proveedor del contexto
interface CommentsProviderProps {
  children: ReactNode;
}

export const CommentsProvider: React.FC<CommentsProviderProps> = ({ children }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar comentarios al montar el componente
  useEffect(() => {
    const commentsCollection = collection(db, 'comentarios');
    const unsubscribe = onSnapshot(
      query(commentsCollection, orderBy('fecha', 'desc')),
      (querySnapshot) => {
        const commentsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          fecha: doc.data().fecha.toDate()
        } as Comment));
        
        setComments(commentsData);
        setLoading(false);
      },
      (err) => {
        console.error("Error obteniendo comentarios:", err);
        setError("Error al cargar comentarios");
        setLoading(false);
      }
    );

    // Limpiar el listener cuando se desmonte el componente
    return () => unsubscribe();
  }, []);

  // Actualizar manualmente los comentarios (útil después de operaciones CRUD)
  const refreshComments = async (): Promise<void> => {
    setLoading(true);
    try {
      const commentsCollection = collection(db, 'comentarios');
      const commentsSnapshot = await getDocs(
        query(commentsCollection, orderBy('fecha', 'desc'))
      );
      
      const commentsData = commentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        fecha: doc.data().fecha.toDate()
      } as Comment));
      
      setComments(commentsData);
      setError(null);
    } catch (err) {
      console.error("Error al actualizar comentarios:", err);
      setError("Error al actualizar comentarios");
    } finally {
      setLoading(false);
    }
  };

  // Añadir un nuevo comentario
  const addComment = async (comment: Omit<Comment, 'id' | 'fecha'>): Promise<void> => {
    try {
      const commentsCollection = collection(db, 'comentarios');
      await addDoc(commentsCollection, {
        ...comment,
        fecha: Timestamp.now()
      });
      await refreshComments();
    } catch (err) {
      console.error("Error al añadir comentario:", err);
      setError("Error al añadir comentario");
      throw err;
    }
  };

  // Actualizar un comentario existente
  const updateComment = async (id: string, updatedComment: Partial<Omit<Comment, 'id'>>): Promise<void> => {
    try {
      const commentDoc = doc(db, 'comentarios', id);
      await updateDoc(commentDoc, updatedComment);
      await refreshComments();
    } catch (err) {
      console.error(`Error al actualizar comentario con ID ${id}:`, err);
      setError(`Error al actualizar comentario con ID ${id}`);
      throw err;
    }
  };

  // Eliminar un comentario
  const deleteComment = async (id: string): Promise<void> => {
    try {
      const commentDoc = doc(db, 'comentarios', id);
      await deleteDoc(commentDoc);
      await refreshComments();
    } catch (err) {
      console.error(`Error al eliminar comentario con ID ${id}:`, err);
      setError(`Error al eliminar comentario con ID ${id}`);
      throw err;
    }
  };

  // Obtener comentarios por libro
  const getCommentsByBook = (bookId: string): Comment[] => {
    return comments.filter(comment => comment.libro === bookId);
  };

  return (
    <CommentsContext.Provider
      value={{
        comments,
        loading,
        error,
        addComment,
        updateComment,
        deleteComment,
        getCommentsByBook,
        refreshComments
      }}
    >
      {children}
    </CommentsContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useComments = (): CommentsContextType => {
  const context = useContext(CommentsContext);
  if (context === undefined) {
    throw new Error('useComments debe usarse dentro de un CommentsProvider');
  }
  return context;
};