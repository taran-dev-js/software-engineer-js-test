// Handles print description JSON generation and import/export

/**
 * Generate print description JSON
 * @param {object} params
 * @param {string} id - unique id for the photo
 * @param {string} src - base64 image data
 * @param {number} width - width in inches
 * @param {number} height - height in inches
 * @param {number} x - x offset in inches
 * @param {number} y - y offset in inches
 * @returns {object} print description
 */
export function generatePrintDescription({ id, src, width, height, x, y }) {
    return {
        canvas: {
            width: 15,
            height: 10,
            photo: {
                id,
                src,
                width,
                height,
                x,
                y
            }
        }
    };
}

/**
 * Save JSON to file
 */
export function saveJSONToFile(obj, filename) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
}

/**
 * Load JSON from file input
 */
export function loadJSONFromFile(file, cb) {
    const reader = new FileReader();
    reader.onload = e => {
        try {
            const data = JSON.parse(e.target.result);
            cb(null, data);
        } catch (err) {
            cb(err);
        }
    };
    reader.readAsText(file);
}
