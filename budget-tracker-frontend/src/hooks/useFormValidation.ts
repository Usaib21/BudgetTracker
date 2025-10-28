import { useState, ChangeEvent, FormEvent } from 'react';

// Define validation rules interface
interface ValidationRules<T> {
    isRequired?: boolean | ((formData: T) => boolean);
    custom?: (value: any, formData: T) => string | null;
    labelName?: string;
}

type FormErrors = Record<string, string>;
type FormData = Record<string, any>;

const useFormValidation = <T extends FormData>(
    initialData: T,
    validationRules: Record<string, ValidationRules<T>>,
) => {
    const [formData, setFormData] = useState<T>(initialData);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const validateField = (name: string, value: any): string => {
        const rules = validationRules[name];
        if (!rules) return '';

        // Get isRequired status
        const isRequired =
            typeof rules.isRequired === 'function' ? rules.isRequired(formData) : rules.isRequired;

        const fieldLabel = rules.labelName ?? name.charAt(0).toUpperCase() + name.slice(1);

        // Validate required first
        if (isRequired && (!value || (typeof value === 'string' && value.trim() === ''))) {
            return `${fieldLabel} is required`;
        }

        // Run custom validation
        if (rules.custom) {
            const customError = rules.custom(value, formData); // Pass formData here
            if (customError) return customError;
        }

        return '';
    };
    const validateForm = (): FormErrors => {
        const newErrors: FormErrors = {};
        for (const name in validationRules) {
            const error = validateField(name, formData[name]);
            if (error) newErrors[name] = error;
        }
        return newErrors;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({
            ...prev,
            [name]: validateField(name, value) || '',
        }));
    };

    const handleBlur = (name: string) => {
        setErrors((prev) => ({
            ...prev,
            [name]: validateField(name, formData[name]) || '',
        }));
    };

    const handleCustomChange = (name: string, value: any) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({
            ...prev,
            [name]: validateField(name, value) || '',
        }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        const file = files?.[0];
        setFormData((prev) => ({ ...prev, [name]: file }));
        setErrors((prev) => ({ ...prev, [name]: validateField(name, file) || '' }));
    };

    const handleSubmit = (onSubmit: (data: T) => void) => {
        return (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const formErrors = validateForm();
            setErrors(formErrors);
            setIsSubmitted(true);

            if (Object.keys(formErrors).length === 0) {
                onSubmit(formData);
            }
        };
    };

    return {
        formData,
        errors,
        handleChange,
        handleBlur,
        handleCustomChange,
        handleFileChange,
        handleSubmit,
        isSubmitted,
        setFormData,
    };
};

export default useFormValidation;
