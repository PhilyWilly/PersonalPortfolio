// Add window resize listener to redraw canvas with proper proportions
window.addEventListener('resize', function () {
    // Debounce the resize event to avoid too many redraws
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(function () {
        matrixCanvas.resizeToFullSize();
        matrix = sizedMatrix();
        
        gridCanvas.resizeToFullSize();
        gridCanvas.paintGrid();

        resizeFrames();
    }, 150);
});