/*
 * Copyright (C) 2024-2025 brittni watkins.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import p5 from 'p5';

// import { GenuaryTest } from './genuary/genuary-test';
import { Genuary01 } from './genuary/genuary-01';

import { GenuarySketch } from './genuary-sketch';

import '../assets/style/sketch.css';

function sketch(ctx: p5): void {
    const ROWS: number = 3;
    const COLS: number = 3;
    const WIDTH_RATIO: number = 4;
    const HEIGHT_RATIO: number = 5;
    const RESOLUTION: number = 1080;
    const RESOLUTION_UNIT: number = RESOLUTION / WIDTH_RATIO;
    const CELL_WIDTH: number = WIDTH_RATIO * RESOLUTION_UNIT;
    const CELL_HEIGHT: number = HEIGHT_RATIO * RESOLUTION_UNIT;
    const GENUARY_GRID: GenuarySketch[][] = [];

    let canvas: p5.Renderer | null = null;

    function buildTimestamp(): string {
        const now: Date = new Date();
        const year: number = now.getFullYear();
        const month: string = String(now.getMonth() + 1).padStart(2, '0');
        const day: string = String(now.getDate()).padStart(2, '0');
        const hours: string = String(now.getHours()).padStart(2, '0');
        const minutes: string = String(now.getMinutes()).padStart(2, '0');
        const seconds: string = String(now.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
    }

    function saveGraphics(graphics: p5.Graphics, row: number, col: number): void {
        const filename: string = `${buildTimestamp()}_genuary_r${row}_c${col}.png`;
        ctx.save(graphics, filename);
    }

    function saveCanvas(): void {
        const filename: string = `${buildTimestamp()}_genuary_canvas`;
        ctx.saveCanvas(filename, 'png');
    }

    function saveImages(): void {
        for (let row: number = 0; row < ROWS; row++) {
            for (let col: number = 0; col < COLS; col++) {
                const graphics: p5.Graphics | undefined = GENUARY_GRID.at(row)?.at(col)?.graphics;

                if (graphics) {
                    saveGraphics(graphics, row, col);
                }
            }
        }
    }

    function updateCanvasStyle() {
        if (canvas) {
            const goalRatio: number = WIDTH_RATIO / HEIGHT_RATIO;
            const actualRatio: number = ctx.windowWidth / ctx.windowHeight;

            if (goalRatio < actualRatio) {
                canvas.attribute('style', 'height: 100vh;');
            } else {
                canvas.attribute('style', 'width: 100vw;');
            }
        }
    }

    ctx.setup = (): void => {
        canvas = ctx.createCanvas(CELL_WIDTH * COLS, CELL_HEIGHT * ROWS);
        updateCanvasStyle();

        for (let row: number = 0; row < ROWS; row++) {
            GENUARY_GRID.push([]);

            for (let col: number = 0; col < COLS; col++) {
                const graphics: p5.Graphics = ctx.createGraphics(CELL_WIDTH, CELL_HEIGHT);
                GENUARY_GRID.at(row)?.push(new Genuary01(ctx, graphics));
            }
        }
    };

    ctx.draw = (): void => {
        ctx.background(0);
        ctx.fill(255, 0, 0);
        ctx.rect(0, 0, 100, 100);
        ctx.ellipse(ctx.width / 2, ctx.height / 2, 200, 200);

        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const x = col * CELL_WIDTH;
                const y = row * CELL_HEIGHT;
                GENUARY_GRID.at(row)?.at(col)?.draw();
                const graphics: p5.Graphics | undefined = GENUARY_GRID.at(row)?.at(col)?.graphics;

                if (graphics) {
                    ctx.image(graphics, x, y);
                }
            }
        }
    };

    ctx.windowResized = (): void => {
        updateCanvasStyle();
    };

    ctx.keyPressed = (): void => {
        if (ctx.key === 's') {
            saveCanvas();
            saveImages();
        }
    };
}

new p5(sketch);
