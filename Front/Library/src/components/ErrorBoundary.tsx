import { Component, type ReactNode, type ErrorInfo } from 'react';

interface State {
    hasError: boolean;
    message: string;
}

class ErrorBoundary extends Component<{ children: ReactNode }, State> {
    state: State = { hasError: false, message: '' };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, message: error.message };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('Render error caught by boundary:', error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Algo deu errado</h1>
                    <p className="text-gray-600 mb-6">{this.state.message}</p>
                    <button
                        type="button"
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        onClick={() => this.setState({ hasError: false, message: '' })}
                    >
                        Tentar novamente
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
