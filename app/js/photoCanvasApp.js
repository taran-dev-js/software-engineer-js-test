import { getCoverTransform } from './photoUtils'
import { generatePrintDescription, saveJSONToFile, loadJSONFromFile } from './printDescription'

// Entry point for the photo canvas app
// Will import modules for UI, canvas logic, and print description

export function setupPhotoCanvasApp() {
    document.body.innerHTML = `<h1>Photo Canvas App</h1>
        <form id="photoForm" action="#">
            <fieldset>
                <label for="fileSelector">Select an Image file</label>
                <input type="file" id="fileSelector" />
            </fieldset>
        </form>
        <canvas id="editorCanvas" width="750" height="500" style="border:1px solid #ccc;"></canvas>
        <div id="controls">
            <button id="moveLeft">Move Left</button>
            <button id="moveRight">Move Right</button>
            <button id="moveUp">Move Up</button>
            <button id="moveDown">Move Down</button>
            <button id="scaleUp">Scale Up</button>
            <button id="scaleDown">Scale Down</button>
            <button id="submit">Submit</button>
            <button id="import">Import JSON</button>
            <input type="file" id="importFile" style="display:none" />
        </div>
        <div id="message"></div>`;

    const fileSelector = document.getElementById('fileSelector');
    const editorCanvas = document.getElementById('editorCanvas');
    const ctx = editorCanvas.getContext('2d');
    const moveLeft = document.getElementById('moveLeft');
    const moveRight = document.getElementById('moveRight');
    const moveUp = document.getElementById('moveUp');
    const moveDown = document.getElementById('moveDown');
    const scaleUp = document.getElementById('scaleUp');
    const scaleDown = document.getElementById('scaleDown');
    const submit = document.getElementById('submit');
    const importBtn = document.getElementById('import');
    const importFile = document.getElementById('importFile');
    const message = document.getElementById('message');

    // Canvas and photo state
    let photo = null;
    let photoId = '';
    let photoSrc = '';
    let imgW = 0, imgH = 0;
    let x = 0, y = 0, scale = 1;
    const CANVAS_WIDTH = 15; // inches
    const CANVAS_HEIGHT = 10; // inches
    const CANVAS_PX_W = 750; // px
    const CANVAS_PX_H = 500; // px
    const DPI = 50; // px per inch (for display)

    function render() {
        ctx.clearRect(0, 0, CANVAS_PX_W, CANVAS_PX_H);
        if (!photo) return;
        // Convert x, y from inches to px
        const pxX = x * DPI;
        const pxY = y * DPI;
        const { drawW, drawH } = getCoverTransform(imgW, imgH, CANVAS_PX_W, CANVAS_PX_H, 0, 0, scale);
        ctx.drawImage(photo, pxX, pxY, drawW, drawH);
    }

    fileSelector.onchange = function(e) {
        const files = e.target.files;
        if (!files.length) return;
        const file = files[0];
        if (!/^image\//.test(file.type)) {
            message.textContent = 'Please select a valid image file.';
            return;
        }
        const reader = new FileReader();
        reader.onload = function(ev) {
            const img = new window.Image();
            img.onload = function() {
                photo = img;
                imgW = img.naturalWidth;
                imgH = img.naturalHeight;
                x = 0; y = 0; scale = 1;
                photoId = Date.now().toString();
                photoSrc = reader.result;
                render();
            };
            img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
    };

    moveLeft.onclick = () => { x -= 0.5; render(); };
    moveRight.onclick = () => { x += 0.5; render(); };
    moveUp.onclick = () => { y -= 0.5; render(); };
    moveDown.onclick = () => { y += 0.5; render(); };
    scaleUp.onclick = () => { scale *= 1.1; render(); };
    scaleDown.onclick = () => { scale /= 1.1; render(); };

    submit.onclick = (e) => {
        e.preventDefault();
        if (!photo) {
            message.textContent = 'No photo loaded.';
            return;
        }
        // Calculate print description in inches
        const { drawW, drawH } = getCoverTransform(imgW, imgH, CANVAS_PX_W, CANVAS_PX_H, 0, 0, scale);
        const widthInches = drawW / DPI;
        const heightInches = drawH / DPI;
        const desc = generatePrintDescription({
            id: photoId,
            src: photoSrc,
            width: widthInches,
            height: heightInches,
            x,
            y
        });
        saveJSONToFile(desc, 'print-description.json');
        message.textContent = 'Print description saved.';
    };

    importBtn.onclick = () => {
        importFile.click();
    };
    importFile.onchange = (e) => {
        const files = e.target.files;
        if (!files.length) return;
        loadJSONFromFile(files[0], (err, data) => {
            if (err) {
                message.textContent = 'Invalid JSON file.';
                return;
            }
            try {
                const photoData = data.canvas.photo;
                const img = new window.Image();
                img.onload = function() {
                    photo = img;
                    imgW = img.naturalWidth;
                    imgH = img.naturalHeight;
                    x = photoData.x;
                    y = photoData.y;
                    scale = Math.max(photoData.width / imgW, photoData.height / imgH);
                    photoId = photoData.id;
                    photoSrc = photoData.src;
                    render();
                };
                img.src = photoData.src;
            } catch {
                message.textContent = 'Invalid print description.';
            }
        });
    };
}
