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

import p5 from 'p5';

import { GenuarySketch } from '../genuary-sketch';

class Timer {
    #startTimeMillis: number;
    #durationMillis: number;

    public constructor(p5Ctx: p5, durationMillis: number) {
        this.#startTimeMillis = p5Ctx.millis();
        this.#durationMillis = durationMillis;
    }

    public get durationMillis(): number {
        return this.#durationMillis;
    }

    public set durationMillis(millis: number) {
        this.#durationMillis = millis;
    }

    public isDone(p5Ctx: p5): boolean {
        return (p5Ctx.millis() - this.#startTimeMillis) >= this.durationMillis;
    }

    public reset(p5Ctx: p5): void {
        this.#startTimeMillis = p5Ctx.millis();
    }
}

// TODO - fibonacci cache for performance
// TODO - cache saved to JSON file would allow reuse across sessions
// TODO - file cache would allow sketch to begin at a higher Fibonacci number
function fibonacci(n: number): number {
    if (n <= 0) {
        return 0;
    }

    if (n === 1) {
        return 1;
    }

    return fibonacci(n - 1) + fibonacci(n - 2);
}

export class Genuary03 extends GenuarySketch {
    #p5Ctx: p5;
    #timer: Timer;

    public constructor(p5Ctx: p5, graphics: p5.Graphics) {
        super(graphics);
        this.#p5Ctx = p5Ctx;

        const durationMillis = p5Ctx.random(250, 10_000);
        this.#timer = new Timer(p5Ctx, durationMillis);

        console.log(this.#timer);
        console.log(this.#p5Ctx);
        const fib = fibonacci(1);
        console.log(fib);
    }

    public override drawToGraphics(ctx: p5.Graphics) {
        ctx.background(0);
    }
}
