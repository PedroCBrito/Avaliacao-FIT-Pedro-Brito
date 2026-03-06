import { createBrowserRouter, Navigate } from 'react-router-dom';
import BooksPage from './pages/BooksPage';
import BookPage from './pages/BookPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/books" replace />,
    },
    {
        path: '',
        element: <Navigate to="/books" replace />,
    },

    {
        path: '/books',
        element: <BooksPage />,
    },
    {
        path: '/book/:id',
        element: <BookPage />,
    },
]);
