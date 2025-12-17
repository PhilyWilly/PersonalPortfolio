/// Frame is the thing around the blue thing ykyk??
class Frame extends Canvas {
    constructor(canvas, isDark=false) {
        super(canvas);
        this.state = 0.0;
        this.direction = "neutral"; // Also "clicked" and "hover" possible
        this.isDark = isDark;
    }
    
    paintFrame(edge, lineWidth, color, d) { // d => decoration
        // Clear the frame
        this.clear();

         // Get height and width
        const height = this.getHeight();
        const width = this.getWidth();


        // Set consts
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        const hlw = lineWidth/2; // Half line width to not shoot over the edge

        // Paint frame
        this.ctx.beginPath();
        this.ctx.moveTo(0+hlw,0+hlw);
        this.ctx.lineTo(width-hlw-edge, 0+hlw);
        this.ctx.lineTo(width-hlw, 0+hlw+edge);
        this.ctx.lineTo(width-hlw, height-hlw);
        this.ctx.lineTo(0+hlw,height-hlw);
        this.ctx.lineTo(0+hlw,0+hlw);
        this.ctx.stroke();

        const stripes = 3;
        const stripesHeight = 6;
        const stripedHeightStretch = 4;
        const offsetX = 12;
        const stripesWidth = 4;
        const stripedWidthStretch = 2;
        const xStart = 8;

        // Paint stripes on the frame
        for (let i = 0; i < stripes; i++) {
            const xBegin = offsetX*i+xStart;
            this.ctx.beginPath();
            this.ctx.moveTo(hlw + xBegin ,0+hlw);
            this.ctx.lineTo(hlw + xBegin+stripesWidth+(stripedWidthStretch*d), 0+hlw + stripesHeight + (stripedHeightStretch*d));
            this.ctx.stroke();
        }        
    }
}