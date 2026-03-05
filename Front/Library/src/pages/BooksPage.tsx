import BooksContainer from '../components/BooksContainer';
import BooksHeader from '../components/BooksHeader';

function BooksPage() {
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="container mx-auto p-6">
                <BooksHeader />

                <BooksContainer />
            </div>
        </div>
    );
}

export default BooksPage;
