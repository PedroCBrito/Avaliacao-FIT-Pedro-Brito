/**
 * Converts any parseable date string to "yyyy-MM-dd" — the format required
 * by <input type="date">.
 */
export function toInputDate(date: string): string {
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    const d = new Date(date);
    if (isNaN(d.getTime())) return date;
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

/**
 * Formats any parseable date string for display in Brazilian Portuguese
 * (e.g. "15/01/2023").
 */
export function formatDateBR(date: string): string {
    const normalized = toInputDate(date);
    const [yyyy, mm, dd] = normalized.split('-');
    return `${dd}/${mm}/${yyyy}`;
}
