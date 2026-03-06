import { useState, useCallback } from 'react';
import { z } from 'zod';
import Modal from './ui/Modal';
import FormField from './ui/FormField';
import ModalButton from './ui/ModalButton';
import ImageUpload from './ui/ImageUpload';
import { bookSchema, type BookInput } from '../schemas/book.schemas';

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
}

function AddBookModal({ isOpen, onClose, onSubmit }: AddBookModalProps) {
    const [form, setForm] = useState<BookInput>(EMPTY_FORM);
    const [errors, setErrors] = useState<Partial<Record<keyof BookInput, string>>>({});
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [dateInputType, setDateInputType] = useState<'text' | 'date'>('text');

    const isFormComplete =
        form.title.trim() !== '' &&
        form.author.trim() !== '' &&
        form.published_date.trim() !== '' &&
        form.book_description.trim() !== '' &&
        form.book_img !== '';

    const handleClose = useCallback(() => {
        setForm(EMPTY_FORM);
        setErrors({});
        setImagePreview(null);
        setDateInputType('text');
        onClose();
    }, [onClose]);

    const handleChange =
        (field: keyof BookInput) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setForm((prev) => ({ ...prev, [field]: e.target.value }));
            if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
        };

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

        setSubmitting(true);
        try {
            await onSubmit(result.data);
            handleClose();
        } catch (err) {
            if (err instanceof z.ZodError) {
                setErrors({ title: 'Erro de validação. Verifique os campos.' });
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Novo Livro">
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                <div className="flex gap-5">
                    <div className="flex flex-col gap-4 flex-[2]">
                        <FormField error={errors.title}>
                            <input
                                type="text"
                                value={form.title}
                                onChange={handleChange('title')}
                                placeholder="Título"
                                className={INPUT_BASE}
                            />
                        </FormField>

                        <FormField error={errors.author}>
                            <input
                                type="text"
                                value={form.author}
                                onChange={handleChange('author')}
                                placeholder="Autor"
                                className={INPUT_BASE}
                            />
                        </FormField>

                        <FormField error={errors.published_date}>
                            <input
                                type={dateInputType}
                                value={form.published_date}
                                onChange={handleChange('published_date')}
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
                        value={form.book_description}
                        onChange={handleChange('book_description')}
                        placeholder="Descrição"
                        rows={4}
                        className={`${INPUT_BASE} h-50`}
                    />
                </FormField>

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

export default AddBookModal;
