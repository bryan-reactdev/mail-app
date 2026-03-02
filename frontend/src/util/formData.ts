/**
 * Converts an object to FormData, handling files and converting values to strings
 * @param data - Object with form data
 * @returns FormData instance
 */
export function objectToFormData<T extends Record<string, any>>(data: T): FormData {
    const formData = new FormData();

    for (const [key, value] of Object.entries(data)) {
        if (value === undefined || value === null) {
            continue;
        }

        // Handle FileList or File arrays
        if (value instanceof FileList) {
            Array.from(value).forEach((file) => {
                formData.append(key, file);
            });
        } else if (Array.isArray(value) && value[0] instanceof File) {
            value.forEach((file) => {
                formData.append(key, file);
            });
        } else if (value instanceof File) {
            formData.append(key, value);
        } else {
            // Convert everything else to string
            formData.append(key, String(value));
        }
    }

    return formData;
}




