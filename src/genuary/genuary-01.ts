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

import { GenuarySketch } from '../genuary-sketch';
import p5 from 'p5';

interface ShapeConfig {
    position: p5.Vector;
    width: number;
    height: number;
    rotation: number;
    fillColor: p5.Color | null;
    strokeColor: p5.Color | null;
    strokeWeight: number;
}

abstract class Shape {
    readonly #position: p5.Vector;
    readonly #width: number;
    readonly #height: number;
    readonly #rotation: number;
    readonly #fillColor: p5.Color | null;
    readonly #strokeColor: p5.Color | null;
    readonly #strokeWeight: number;

    protected constructor(config: ShapeConfig) {
        this.#position = config.position;
        this.#width = config.width;
        this.#height = config.height;
        this.#rotation = config.rotation;
        this.#strokeColor = config.strokeColor;
        this.#fillColor = config.fillColor;
        this.#strokeWeight = config.strokeWeight;
    }

    public abstract draw(ctx: p5.Graphics): void;

    public get position(): p5.Vector {
        return this.#position;
    }

    public get width(): number {
        return this.#width;
    }

    public get height(): number {
        return this.#height;
    }

    public get rotation(): number {
        return this.#rotation;
    }

    public applyStyles(ctx: p5.Graphics): void {
        if (this.#fillColor) {
            ctx.fill(this.#fillColor);
        } else {
            ctx.noFill();
        }

        if (this.#strokeColor) {
            ctx.strokeWeight(this.#strokeWeight);
            ctx.stroke(this.#strokeColor);
        } else {
            ctx.noStroke();
        }
    }
}

class Rectangle extends Shape {
    public constructor(config: ShapeConfig) {
        super(config);
    }

    public draw(ctx: p5.Graphics): void {
        ctx.push();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.rectMode(ctx.CENTER);
        this.applyStyles(ctx);
        ctx.rect(0, 0, this.width, this.height);
        ctx.pop();
    }
}

class Ellipse extends Shape {
    public constructor(config: ShapeConfig) {
        super(config);
    }

    public draw(ctx: p5.Graphics): void {
        ctx.push();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.ellipseMode(ctx.CENTER);
        this.applyStyles(ctx);
        ctx.ellipse(0, 0, this.width, this.height);
        ctx.pop();
    }
}

class ColorSelector {
    #hue: number;
    #saturation: number;
    #backgroundLightnessRange: { min: number; max: number; };
    #shapeLightnessRange: { min: number; max: number; };
    #alphaRange: { min: number; max: number; };

    public constructor(p5Ctx: p5, backgroundMode: 'light' | 'dark') {
        this.#hue = Math.floor(p5Ctx.random(360));
        this.#saturation = Math.floor(p5Ctx.random(15, 100));
        this.#alphaRange = { min: 50, max: 225 };

        if (backgroundMode === 'light') {
            this.#backgroundLightnessRange = { min: 30, max: 90 };
            this.#shapeLightnessRange = { min: 3, max: 35 };
        } else {
            this.#backgroundLightnessRange = { min: 3, max: 35 };
            this.#shapeLightnessRange = { min: 30, max: 90 };
        }
    }

    public buildBackgroundColor(p5Ctx: p5): p5.Color {
        const lightness = Math.floor(p5Ctx.random(this.#backgroundLightnessRange.min, this.#backgroundLightnessRange.max));
        const color = p5Ctx.color(`hsl(${this.#hue.toFixed()}, ${this.#saturation.toFixed()}%, ${lightness.toFixed()}%)`);
        color.setAlpha(Math.floor(p5Ctx.random(this.#alphaRange.min, this.#alphaRange.max)));
        return color;
    }

    public buildShapeColor(p5Ctx: p5): p5.Color {
        const lightness = Math.floor(p5Ctx.random(this.#shapeLightnessRange.min, this.#shapeLightnessRange.max));
        const color = p5Ctx.color(`hsl(${this.#hue.toFixed()}, ${this.#saturation.toFixed()}%, ${lightness.toFixed()}%)`);
        color.setAlpha(Math.floor(p5Ctx.random(this.#alphaRange.min, this.#alphaRange.max)));
        return color;
    }
}

enum ShapeType {
    RECTANGLE = 'RECTANGLE',
    ELLIPSE = 'ELLIPSE'
}

enum StyleType {
    /**
     * All shapes will be filled only.
     */
    FILL_ONLY = 'FILL_ONLY',

    /**
     * All shapes will be stroked only.
     */
    STROKE_ONLY = 'STROKE_ONLY',

    /**
     * All shapes will be filled and stroked.
     */
    BOTH = 'BOTH',

    /**
     * All shapes will be filled only or have both fill and stroke.
     */
    FILL_AND_BOTH = 'FILL_AND_BOTH',

    /**
     * All shapes will be stroked only or have both fill and stroke.
     */
    STROKE_AND_BOTH = 'STROKE_AND_BOTH',

    /**
     * All shapes will be filled only or stroked only.
     */
    FILL_AND_STROKE = 'FILL_AND_STROKE',

    /**
     * Shapes can be filled only, stroked only, or have both fill and stroke.
     */
    MIXED = 'MIXED'
}

function randomBoolean(): boolean {
    return Math.random() < 0.5;
}

function buildShapeConfig(p5Ctx: p5, width: number, height: number, styleType: StyleType, colorSelector: ColorSelector): ShapeConfig {
    const position = p5Ctx.createVector(
        p5Ctx.random(p5Ctx.width),
        p5Ctx.random(p5Ctx.height)
    );

    const rotation = p5Ctx.random(p5Ctx.TWO_PI);

    // let fillColor: p5.Color | null = p5Ctx.color(
    //     Math.floor(p5Ctx.random(255)),
    //     Math.floor(p5Ctx.random(255)),
    //     Math.floor(p5Ctx.random(255)),
    //     Math.floor(p5Ctx.random(50, 200))
    // );

    let fillColor: p5.Color | null = colorSelector.buildShapeColor(p5Ctx);

    // let strokeColor: p5.Color | null = p5Ctx.color(
    //     Math.floor(p5Ctx.random(255)),
    //     Math.floor(p5Ctx.random(255)),
    //     Math.floor(p5Ctx.random(255)),
    //     Math.floor(p5Ctx.random(50, 200))
    // );

    let strokeColor: p5.Color | null = colorSelector.buildShapeColor(p5Ctx);

    const strokeWeight = p5Ctx.random(0.5, 20);

    if (styleType === StyleType.FILL_ONLY) {
        strokeColor = null;
    } else if (styleType === StyleType.STROKE_ONLY) {
        fillColor = null;
    } else if (styleType === StyleType.FILL_AND_BOTH) {
        if (randomBoolean()) {
            strokeColor = null;
        }
    } else if (styleType === StyleType.STROKE_AND_BOTH) {
        if (randomBoolean()) {
            fillColor = null;
        }
    } else if (styleType === StyleType.FILL_AND_STROKE) {
        if (randomBoolean()) {
            fillColor = null;
        } else {
            strokeColor = null;
        }
    } else if (styleType === StyleType.MIXED) {
        const rand = p5Ctx.random(1);
        if (rand < 0.33) {
            fillColor = null;
        } else if (rand < 0.66) {
            strokeColor = null;
        }
    }

    return {
        position,
        width,
        height,
        rotation,
        fillColor,
        strokeColor,
        strokeWeight
    };
}

function selectRandomElement<T>(arr: T[], p5Ctx: p5): T | undefined {
    if (arr.length === 0) {
        return undefined;
    }

    const index = Math.floor(p5Ctx.random(arr.length));
    return arr.at(index) ?? undefined;
}

// const enum RotationType {
//     CONSTANT = 'CONSTANT',
//     RANDOM = 'RANDOM',
//     ALIGNED = 'ALIGNED'
// }

export class Genuary01 extends GenuarySketch {
    #shapes: Shape[] = [];
    #backgroundColor: p5.Color;

    public constructor(p5Ctx: p5, graphics: p5.Graphics) {
        super(graphics);

        const numShapes = p5Ctx.random(1, 1_000);
        const shapeType: ShapeType = selectRandomElement<ShapeType>(Object.values(ShapeType), p5Ctx) ?? ShapeType.RECTANGLE;
        const styleType: StyleType = selectRandomElement<StyleType>(Object.values(StyleType), p5Ctx) ?? StyleType.FILL_ONLY;
        const backgroundType: 'light' | 'dark' = selectRandomElement<'light' | 'dark'>(['light', 'dark'], p5Ctx) ?? 'light';

        const shapeWidth = p5Ctx.random(5, 500);
        const shapeHeight = p5Ctx.random(5, 500);

        const colorSelector = new ColorSelector(p5Ctx, backgroundType);
        this.#backgroundColor = colorSelector.buildBackgroundColor(p5Ctx);

        for (let i = 0; i < numShapes; i++) {
            if (shapeType === ShapeType.RECTANGLE) {
                const config = buildShapeConfig(p5Ctx, shapeWidth, shapeHeight, styleType, colorSelector);
                this.#shapes.push(new Rectangle(config));
            } else {
                const config = buildShapeConfig(p5Ctx, shapeWidth, shapeHeight, styleType, colorSelector);
                this.#shapes.push(new Ellipse(config));
            }
        }
    }

    public override drawToGraphics(ctx: p5.Graphics): void {
        ctx.background(this.#backgroundColor);
        for (const shape of this.#shapes) {
            shape.draw(ctx);
        }
    }
}
