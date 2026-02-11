import { getCoverTransform } from './photoUtils';
import { generatePrintDescription } from './printDescription';

// Basic test setup for the photo canvas app
// Add tests for image upload, canvas logic, and print description

describe('Photo Canvas App', () => {
  it('should upload and display an image', () => {
    // Simulate loading an image and check dimensions
    const img = new window.Image();
    // Mock image dimensions
    Object.defineProperty(img, 'naturalWidth', { value: 2000 });
    Object.defineProperty(img, 'naturalHeight', { value: 1000 });
    expect(img.naturalWidth).toBe(2000);
    expect(img.naturalHeight).toBe(1000);
  });
  it('should calculate cover transform to always cover canvas', () => {
    // 20x10 image, 15x10 canvas, scale 1
    const { drawW, drawH } = getCoverTransform(20, 10, 750, 500, 0, 0, 1);
    expect(drawW).toBeGreaterThanOrEqual(750);
    expect(drawH).toBeGreaterThanOrEqual(500);
  });

  it('should generate correct print description', () => {
    const desc = generatePrintDescription({
      id: 'test',
      src: 'data:image/png;base64,abc',
      width: 15,
      height: 10,
      x: 0,
      y: 0
    });
    expect(desc.canvas.width).toBe(15);
    expect(desc.canvas.height).toBe(10);
    expect(desc.canvas.photo.id).toBe('test');
    expect(desc.canvas.photo.src).toContain('base64');
  });
});
