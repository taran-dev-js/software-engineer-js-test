// Utility functions for image manipulation, scaling, and positioning

/**
 * Calculate the scale and position for the image to always cover the canvas (object-fit: cover logic)
 * @param {number} imgW - image width
 * @param {number} imgH - image height
 * @param {number} canvasW - canvas width
 * @param {number} canvasH - canvas height
 * @param {number} x - current x offset (inches)
 * @param {number} y - current y offset (inches)
 * @param {number} scale - current scale factor
 * @returns {object} {drawW, drawH, drawX, drawY, scale, x, y}
 */
export function getCoverTransform(imgW, imgH, canvasW, canvasH, x, y, scale) {
    // Calculate scale to cover canvas
    const scaleX = canvasW / imgW;
    const scaleY = canvasH / imgH;
    const coverScale = Math.max(scaleX, scaleY) * scale;
    const drawW = imgW * coverScale;
    const drawH = imgH * coverScale;
    // x, y are in inches, but canvas is in px; conversion handled elsewhere
    return {
        drawW,
        drawH,
        drawX: x,
        drawY: y,
        scale: coverScale
    };
}
