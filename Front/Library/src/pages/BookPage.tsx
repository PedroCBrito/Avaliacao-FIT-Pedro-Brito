import { useParams, Link } from 'react-router-dom';

function BookPage() {
    const { id } = useParams<{ id: string }>();

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="container mx-auto p-6">
                <nav className="flex items-center justify-between pb-4 mb-6">
                    <h1 className="font-bold text-4xl text-gray-900">Livro</h1>
                    <Link
                        to="/books"
                        className="inline-block rounded-md text-xl cursor-pointer px-4 py-2 font-medium"
                    >
                        Voltar
                    </Link>
                </nav>
                <p className="text-gray-500">ID: {id}</p>
            </div>
        </div>
    );
}

export default BookPage;
