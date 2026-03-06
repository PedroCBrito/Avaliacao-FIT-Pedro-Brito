import { useRef } from 'react';
import pictureIcon from '../../assets/picture_png_icon.png';

interface ImageUploadProps {
    preview: string | null;
    onChange: (base64: string) => void;
    error?: string;
}

function ImageUpload({ preview, onChange, error }: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => onChange(reader.result as string);
        reader.readAsDataURL(file);
    };

    return (
        <div className="flex flex-col gap-2 flex-[1]">
            <div
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                className="flex flex-1 flex-col items-center bg-white justify-center rounded-lg border-2 border-transparent hover:border-gray-300 focus:ring-2 focus:ring-gray-300 cursor-pointer transition min-h-[170px] p-2"
            >
                {preview ? (
                    <img
                        src={preview}
                        alt="Preview da capa"
                        className="w-full h-full object-cover rounded-md max-h-[185px]"
                    />
                ) : (
                    <>
                        <img
                            src={pictureIcon}
                            alt=""
                            className="w-20 h-20 opacity-80"
                        />
                        <p className="text-xs text-gray-400 text-center mt-2">
                            Escolher Imagem
                        </p>
                    </>
                )}
            </div>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload de imagem da capa"
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}

export default ImageUpload;
