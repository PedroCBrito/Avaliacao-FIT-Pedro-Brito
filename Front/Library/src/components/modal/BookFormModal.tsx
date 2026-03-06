import { useState, useCallback, useEffect } from 'react';
import { z } from 'zod';
import Modal from './Modal';
import FormField from '../ui/FormField';
import ModalButton from './ModalButton';
import ImageUpload from '../ui/ImageUpload';
import { bookSchema, type BookInput } from '../../schemas/book.schemas';
import { toInputDate } from '../../lib/dateUtils';

const INPUT_BASE =
    'bg-white w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition    h-12';

const EMPTY_FORM: BookInput = {
    title: '',
    author: '',
    published_date: '',
    book_description: '',
    book_img: '',
};

interface AddBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: BookInput) => Promise<unknown>;
    initialData?: BookInput;
}

function normalizeInitialData(data?: BookInput): BookInput {
    if (!data) return EMPTY_FORM;
    return {
        ...data,
        published_date: data.published_date ? toInputDate(data.published_date) : '',
    };
}

function BookFormModal({ isOpen, onClose, onSubmit, initialData }: AddBookModalProps) {
    const [form, setForm] = useState<BookInput>(() => normalizeInitialData(initialData));
    const [errors, setErrors] = useState<Partial<Record<keyof BookInput, string>>>({});
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.book_img ?? null);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [dateInputType, setDateInputType] = useState<'text' | 'date'>(
        initialData?.published_date ? 'date' : 'text'
    );

    const isFormComplete =
        form.title.trim() !== '' &&
        form.author.trim() !== '' &&
        form.published_date.trim() !== '' &&
        form.book_description.trim() !== '' &&
        form.book_img !== '';

    const resetForm = useCallback(() => {
        setForm(normalizeInitialData(initialData));
        setErrors({});
        setImagePreview(initialData?.book_img ?? null);
        setDateInputType(initialData?.published_date ? 'date' : 'text');
    }, [initialData]);

    useEffect(() => {
        if (isOpen) resetForm();
    }, [isOpen, resetForm]);

    const handleClose = useCallback(() => {
        resetForm();
        onClose();
    }, [onClose, resetForm]);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const field = e.target.name as keyof BookInput;
            const { value } = e.target;
            setForm((prev) => ({ ...prev, [field]: value }));
            setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
        },
        []
    );

    const handleImageChange = (base64: string) => {
        setImagePreview(base64);
        setForm((prev) => ({ ...prev, book_img: base64 }));
        if (errors.book_img) setErrors((prev) => ({ ...prev, book_img: undefined }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = bookSchema.safeParse(form);
        if (!result.success) {
            const fieldErrors: Partial<Record<keyof BookInput, string>> = {};
            result.error.issues.forEach((issue) => {
                const key = issue.path[0] as keyof BookInput;
                if (!fieldErrors[key]) fieldErrors[key] = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setSubmitError(null);
        setSubmitting(true);
        try {
            await onSubmit(result.data);
            handleClose();
        } catch (err) {
            if (err instanceof z.ZodError) {
                setErrors({ title: 'Erro de validação. Verifique os campos.' });
            } else {
                setSubmitError(
                    err instanceof Error ? err.message : 'Ocorreu um erro inesperado. Tente novamente.'
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={initialData ? 'Editar Livro' : 'Novo Livro'}>
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                <div className="flex flex-col sm:flex-row gap-5">
                    <div className="flex flex-col gap-4 flex-[2]">
                        <FormField error={errors.title}>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="Título"
                                className={INPUT_BASE}
                            />
                        </FormField>

                        <FormField error={errors.author}>
                            <input
                                type="text"
                                name="author"
                                value={form.author}
                                onChange={handleChange}
                                placeholder="Autor"
                                className={INPUT_BASE}
                            />
                        </FormField>

                        <FormField error={errors.published_date}>
                            <input
                                type={dateInputType}
                                name="published_date"
                                value={form.published_date}
                                onChange={handleChange}
                                onFocus={() => setDateInputType('date')}
                                onBlur={() => { if (!form.published_date) setDateInputType('text'); }}
                                placeholder="Data de publicação"
                                className={INPUT_BASE}
                            />
                        </FormField>
                    </div>

                    <ImageUpload
                        preview={imagePreview}
                        onChange={handleImageChange}
                        error={errors.book_img}
                    />
                </div>

                <FormField error={errors.book_description}>
                    <textarea
                        name="book_description"
                        value={form.book_description}
                        onChange={handleChange}
                        placeholder="Descrição"
                        rows={4}
                        className={`${INPUT_BASE} h-50`}
                    />
                </FormField>

                {submitError && (
                    <p className="text-sm text-red-500 text-center -mt-2">{submitError}</p>
                )}

                <div className="flex justify-center gap-6 pt-1">
                    <ModalButton
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                        disabled={submitting}
                    >
                        Cancelar
                    </ModalButton>
                    <ModalButton type="submit" variant="primary" disabled={submitting || !isFormComplete}>
                        {submitting ? 'Salvando...' : 'Salvar'}
                    </ModalButton>
                </div>
            </form>
        </Modal>
    );
}

export default BookFormModal;
