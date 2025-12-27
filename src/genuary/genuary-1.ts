/*
 * Copyright (C) 2025 brittni watkins.
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

import p5 from "p5";

import { GenuarySketch } from "../genuary-sketch";

export class Genuary1 extends GenuarySketch {
    readonly #backgroundColor: p5.Color;
    // readonly #p5Ctx: p5;

    public constructor(p5Ctx: p5, graphics: p5.Graphics) {
        super(graphics);
        const red = Math.floor(p5Ctx.random(255));
        const green = Math.floor(p5Ctx.random(255));
        const blue = Math.floor(p5Ctx.random(255));
        this.#backgroundColor = p5Ctx.color(red, green, blue);
    }

    public override drawToGraphics(ctx: p5.Graphics): void {
        ctx.background(this.#backgroundColor);
    }
}
