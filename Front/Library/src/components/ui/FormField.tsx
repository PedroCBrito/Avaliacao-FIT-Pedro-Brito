import React, { useId } from 'react';

interface FormFieldProps {
    error?: string;
    children: React.ReactElement<{ id?: string }>;
}

function FormField({ error, children }: FormFieldProps) {
    const id = useId();

    return (
        <div className="flex flex-col gap-1">
            {React.cloneElement(children, { id })}
            {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
        </div>
    );
}

export default FormField;
