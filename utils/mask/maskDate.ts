export function maskDate(text: string) {
    let cleaned = text.replace(/\D/g, '');

    if (cleaned.length > 4) {
        cleaned = cleaned.replace(/^(\d{2})(\d{2})(\d{0,4}).*/, '$1/$2/$3');
    } else if (cleaned.length > 2) {
        cleaned = cleaned.replace(/^(\d{2})(\d{0,2})/, '$1/$2');
    }
    return cleaned;
}
