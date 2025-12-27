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

import '../assets/style/sketch.css';

// import { Genuary1 } from "./genuary/genuary-1";

// import {GenuarySketch} from "./genuary-sketch";

function sketch(ctx: p5): void {
    const ROWS: number = 3;
    const COLS: number = 3;
    const WIDTH_RATIO: number = 4;
    const HEIGHT_RATIO: number = 5;
    const RESOLUTION: number = 1080;
    const RESOLUTION_UNIT: number = RESOLUTION / WIDTH_RATIO;
    const CELL_WIDTH: number = WIDTH_RATIO * RESOLUTION_UNIT;
    const CELL_HEIGHT: number = HEIGHT_RATIO * RESOLUTION_UNIT;
    // const genuarySketches: GenuarySketch[][] = [];

    let canvas : p5.Renderer | null = null;

    ctx.setup = (): void => {
        canvas = ctx.createCanvas(CELL_WIDTH * COLS, CELL_HEIGHT * ROWS);
        updateCanvasStyle();

        // for (let row = 0; row < rows; row++) {
        //     genuarySketches.push([]);
        //
        //     for (let col = 0; col < cols; col++) {
        //         const graphics = ctx.createGraphics(cellWidth, cellHeight);
        //         genuarySketches[row].push(new Genuary1(ctx, graphics));
        //     }
        // }
    };

    ctx.draw = (): void => {
        ctx.background(0);
        ctx.fill(255, 0, 0);
        ctx.rect(0, 0, 100, 100);
        ctx.ellipse(ctx.width / 2, ctx.height / 2, 200, 200);
    };

    ctx.windowResized = (): void => {
        updateCanvasStyle();
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
}

new p5(sketch);
