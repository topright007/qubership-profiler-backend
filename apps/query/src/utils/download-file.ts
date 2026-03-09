/**
 * Download a file from URL and trigger browser save.
 */
export async function downloadFile(url: string, filename: string): Promise<void> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
    }
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    try {
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } finally {
        URL.revokeObjectURL(objectUrl);
    }
}
