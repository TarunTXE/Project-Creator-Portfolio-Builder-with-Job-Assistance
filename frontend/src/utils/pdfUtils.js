/**
 * Opens a base64 data URL PDF in a new browser tab by converting it to a Blob URL.
 * Browsers block data: URLs in new tabs for security, so this workaround is required.
 */
export const openPdfInNewTab = (dataUrl) => {
  if (!dataUrl) return;

  try {
    // Extract the base64 content from the data URL
    const parts = dataUrl.split(',');
    const mime = parts[0].match(/:(.*?);/)?.[1] || 'application/pdf';
    const byteString = atob(parts[1]);

    // Convert to byte array
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // Create blob and open
    const blob = new Blob([ab], { type: mime });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
  } catch (err) {
    console.error('Failed to open PDF:', err);
    // Fallback: try direct open
    window.open(dataUrl, '_blank');
  }
};
