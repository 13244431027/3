
"use strict";
class MathPlus {
    /**
     * Converts a value from radians to degrees.
     * @param {number} value - The value in radians.
     * @returns {number} The value in degrees.
     */
    static toDegrees(value) {
        return value * 180 / Math.PI;
    };

    /**
     * Converts a value from degrees to radians.
     * @param {number} value - The value in degrees.
     * @returns {number} The value in radians.
     */
    static toRadians(value) {
        return value * Math.PI / 180;
    };

    /**
     * Calculates the sine of an angle given in degrees.
     * @param {number} value - The angle in degrees.
     * @returns {number} The sine of the angle.
     */
    static sin(value) {
        return Math.sin(this.toRadians(value));
    };

    /**
     * Calculates the cosine of an angle given in degrees.
     * @param {number} value - The angle in degrees.
     * @returns {number} The cosine of the angle.
     */
    static cos(value) {
        return Math.cos(this.toRadians(value));
    };

    /**
     * Calculates the atans of (x, y) and return degrees.
     * @param {number} y The y of point
     * @param {number} x The x of point
     */
    static atan2(y, x) {
        return MathPlus.toDegrees(Math.atan2(y, x));
    }

    /**
     * Clamps a value between a minimum and maximum boundary.
     * @param {number} min - The minimum boundary.
     * @param {number} value - The value to clamp.
     * @param {number} max - The maximum boundary.
     * @returns {number} The clamped value.
     */
    static between(min, value, max) {
        return Math.max(min, Math.min(max, value));
    };

    /**
     * Generates a random integer between min (inclusive) and max (exclusive).
     * @param {number} min - The minimum value (inclusive).
     * @param {number} max - The maximum value (exclusive).
     * @returns {number} A random integer.
     */
    static random(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    };

    /**
     * Calculates the Euclidean distance between two 2D points.
     * @param {number} x1 - The x-coordinate of the first point.
     * @param {number} y1 - The y-coordinate of the first point.
     * @param {number} x2 - The x-coordinate of the second point.
     * @param {number} y2 - The y-coordinate of the second point.
     * @returns {number} The distance between the two points.
     */
    static distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    };

    /**
     * Returns the largest number from a list of numbers.
     * @param {...number} number - A list of numbers to evaluate.
     * @returns {number} The maximum value.
     */
    static max(...number) {
        return number.reduce((max, cur) => Math.max(max, cur), -Infinity);
    };

    /**
     * Returns the smallest number from a list of numbers.
     * @param {...number} number - A list of numbers to evaluate.
     * @returns {number} The minimum value.
     */
    static min(...number) {
        return number.reduce((min, cur) => Math.min(min, cur), Infinity);
    };

    static precise(number, precise) {
        return Math.round(number * Math.pow(10, precise)) / Math.pow(10, precise);
    }

    static Matrix = class {
        /**
         * Applies horizontal translation to an x-coordinate.
         * @param {number} x - The original x-coordinate.
         * @param {number} offsetX - The horizontal offset.
         * @returns {number} The translated x-coordinate.
         */
        static translationX(x, offsetX) {
            return x + offsetX;
        }

        /**
         * Applies vertical translation to a y-coordinate.
         * @param {number} y - The original y-coordinate.
         * @param {number} offsetY - The vertical offset.
         * @returns {number} The translated y-coordinate.
         */
        static translationY(y, offsetY) {
            return y + offsetY;
        }

        /**
         * Scales an x-coordinate by a given factor.
         * @param {number} x - The original x-coordinate.
         * @param {number} scale - The scale factor.
         * @returns {number} The scaled x-coordinate.
         */
        static scaleX(x, scale) {
            return x * scale;
        }

        /**
         * Scales a y-coordinate by a given factor.
         * @param {number} y - The original y-coordinate.
         * @param {number} scale - The scale factor.
         * @returns {number} The scaled y-coordinate.
         */
        static scaleY(y, scale) {
            return y * scale;
        }

        /**
         * Rotates an x-coordinate around the origin.
         * @param {number} x - The original x-coordinate.
         * @param {number} y - The original y-coordinate.
         * @param {number} rotate - The rotation angle in degrees.
         * @returns {number} The rotated x-coordinate.
         */
        static rotateX(x, y, rotate) {
            return x * MathPlus.cos(rotate) - y * MathPlus.sin(rotate);
        }

        /**
         * Rotates a y-coordinate around the origin.
         * @param {number} x - The original x-coordinate.
         * @param {number} y - The original y-coordinate.
         * @param {number} rotate - The rotation angle in degrees.
         * @returns {number} The rotated y-coordinate.
         */
        static rotateY(x, y, rotate) {
            return x * MathPlus.sin(rotate) + y * MathPlus.cos(rotate);
        }

        /**
         * Applies a complete 2D transformation: scale, rotate, and translate.
         * @param {number} x - The original x-coordinate.
         * @param {number} y - The original y-coordinate.
         * @param {number} offsetX - The horizontal translation offset.
         * @param {number} offsetY - The vertical translation offset.
         * @param {number} scale - The uniform scale factor.
         * @param {number} rotate - The rotation angle in degrees.
         * @returns {[number, number]} An array containing the transformed [x, y] coordinates.
         */
        static translate(x, y, offsetX, offsetY, scale, rotate) {
            const scaledX = this.scaleX(x, scale);
            const scaledY = this.scaleY(y, scale);

            const rotatedX = this.rotateX(scaledX, scaledY, rotate);
            const rotatedY = this.rotateY(scaledX, scaledY, rotate);

            const finalX = this.translationX(rotatedX, offsetX);
            const finalY = this.translationY(rotatedY, offsetY);

            return [finalX, finalY];
        }

        /**
         * Inverts the complete 2D transformation applied by translate.
         * @param {number} x - The transformed x-coordinate.
         * @param {number} y - The transformed y-coordinate.
         * @param {number} offsetX - The horizontal translation offset used by the forward transform.
         * @param {number} offsetY - The vertical translation offset used by the forward transform.
         * @param {number} scale - The uniform scale factor used by the forward transform.
         * @param {number} rotate - The rotation angle used by the forward transform.
         * @returns {[number, number]} An array containing the original [x, y] coordinates.
         */
        static inverseTranslate(x, y, offsetX, offsetY, scale, rotate) {
            if (scale === 0) return [x - offsetX, y - offsetY];

            const translatedX = x - offsetX;
            const translatedY = y - offsetY;
            const scaledX = translatedX / scale;
            const scaledY = translatedY / scale;

            const rotatedX = this.rotateX(scaledX, scaledY, -rotate);
            const rotatedY = this.rotateY(scaledX, scaledY, -rotate);

            return [rotatedX, rotatedY];
        }
    };
}

class Triangle {
    /**
     * @typedef {[[number, number], [number, number], [number, number]]} triangle
     * @type {triangle}
     */
    #vertexes = [[0, 0], [0, 0], [0, 0]];
    /**@type {triangle} */
    #vertexes_real = [[0, 0], [0, 0], [0, 0]];

    #bounding = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        toString: () => "Triangle Bounding"
    };

    get vertexes() {
        return this.#vertexes_real;
    }

    constructor(x1, y1, x2, y2, x3, y3) {
        this.#vertexes = [[x1, y1], [x2, y2], [x3, y3]];
        this.#vertexes_real = this.#vertexes;

        this.#boundingAABB();
    }

    #boundingAABB() {
        const vertexes = this.#vertexes_real;
        this.#bounding.left = MathPlus.precise(Math.min(vertexes[0][0], vertexes[1][0], vertexes[2][0]), 2);
        this.#bounding.right = MathPlus.precise(Math.max(vertexes[0][0], vertexes[1][0], vertexes[2][0]), 2);
        this.#bounding.bottom = MathPlus.precise(Math.min(vertexes[0][1], vertexes[1][1], vertexes[2][1]), 2);
        this.#bounding.top = MathPlus.precise(Math.max(vertexes[0][1], vertexes[1][1], vertexes[2][1]), 2);
    }

    /**
     * AABB collision detection
     * @param {Triangle} triangle Another triangle
     */
    AABB(triangle) {
        const v1 = this.#vertexes_real;
        const v2 = triangle.vertexes;

        /* current triangle */
        const min1X = Math.min(v1[0][0], v1[1][0], v1[2][0]);
        const max1X = Math.max(v1[0][0], v1[1][0], v1[2][0]);
        const min1Y = Math.min(v1[0][1], v1[1][1], v1[2][1]);
        const max1Y = Math.max(v1[0][1], v1[1][1], v1[2][1]);

        /* target triangle */
        const min2X = Math.min(v2[0][0], v2[1][0], v2[2][0]);
        const max2X = Math.max(v2[0][0], v2[1][0], v2[2][0]);
        const min2Y = Math.min(v2[0][1], v2[1][1], v2[2][1]);
        const max2Y = Math.max(v2[0][1], v2[1][1], v2[2][1]);

        return !(max1X < min2X || min1X > max2X || max1Y < min2Y || min1Y > max2Y);

    }

    /**
     * SAT collision detection
     * @param {Triangle} triangle Another triangle
     * @param {boolean} [aabb=true] 
     */
    SAT(triangle, aabb = true) {
        if (aabb && !this.AABB(triangle)) return false;

        const axes = [];
        
        for (let i = 0; i < 3; i++) {
            const p1 = this.#vertexes_real[i];
            const p2 = this.#vertexes_real[(i + 1) % 3];
            const edge = [p2[0] - p1[0], p2[1] - p1[1]];

            const normal = [-edge[1], edge[0]];
            axes.push(normal);
        }
        
        for (let i = 0; i < 3; i++) {
            const p1 = triangle.vertexes[i];
            const p2 = triangle.vertexes[(i + 1) % 3];
            const edge = [p2[0] - p1[0], p2[1] - p1[1]];

            const normal = [-edge[1], edge[0]];
            axes.push(normal);
        }
        
        for (const axis of axes) {
            const length = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1]);
            if (length === 0) continue;
            const normalizedAxis = [axis[0] / length, axis[1] / length];
            
            let min1 = Infinity, max1 = -Infinity;
            for (const point of this.#vertexes_real) {
                const projection = point[0] * normalizedAxis[0] + point[1] * normalizedAxis[1];
                min1 = Math.min(min1, projection);
                max1 = Math.max(max1, projection);
            }
            
            let min2 = Infinity, max2 = -Infinity;
            for (const point of triangle.vertexes) {
                const projection = point[0] * normalizedAxis[0] + point[1] * normalizedAxis[1];
                min2 = Math.min(min2, projection);
                max2 = Math.max(max2, projection);
            }
            
            if (max1 < min2 || max2 < min1) {
                return false;
            }
        }
        
        return true;
    }

    get bounding() {
        return this.#bounding;
    }   

    serialize() {
        return {
            "vertexes": JSON.stringify(this.#vertexes),
            "transformed_vertexes": JSON.stringify(this.#vertexes_real),
            "bounding": JSON.stringify({...this.#bounding, width: this.#bounding.right - this.#bounding.left, height: this.#bounding.top - this.#bounding.bottom})
        };
    }

    translate(offsetX, offsetY, scale, rotate, followCam, cameraX, cameraY, cameraScale, cameraRotate) {
        this.#vertexes_real = [
            MathPlus.Matrix.translate(this.#vertexes[0][0], this.#vertexes[0][1], offsetX, offsetY, scale, rotate),
            MathPlus.Matrix.translate(this.#vertexes[1][0], this.#vertexes[1][1], offsetX, offsetY, scale, rotate),
            MathPlus.Matrix.translate(this.#vertexes[2][0], this.#vertexes[2][1], offsetX, offsetY, scale, rotate),
        ];

        if (followCam) {
            this.#vertexes_real = [
                MathPlus.Matrix.translate(this.#vertexes_real[0][0], this.#vertexes_real[0][1], -cameraX, -cameraY, cameraScale, -cameraRotate),
                MathPlus.Matrix.translate(this.#vertexes_real[1][0], this.#vertexes_real[1][1], -cameraX, -cameraY, cameraScale, -cameraRotate),
                MathPlus.Matrix.translate(this.#vertexes_real[2][0], this.#vertexes_real[2][1], -cameraX, -cameraY, cameraScale, -cameraRotate),
            ];
        }

        this.#boundingAABB();
        return this;
    }

    toString() {
        return "Triangle Object";
    }
};

class Polygon {
    /**@type {Triangle[]} */
    #triangles = [];
    #bounding = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        toString: () => "Polygon Bounding"
    };

    #offsetX = 0;
    #offsetY = 0;
    #scale = 1;
    #rotate = 0;
    #followCam = false;
    #cameraX = 0;
    #cameraY = 0;
    #cameraScale = 1;
    #cameraRotate = 0;

    /**
     * @constructor
     * @param  {...Triangle} triangle Triangles
     */
    constructor(...triangle) {
        this.#triangles = triangle;
        
    }

    /**
     * Collision detection
     * @param {Polygon} polygon Another polygon
     */
    collision(polygon, aabb = true) {
        for (const tri1 of this.#triangles) {
            for (const tri2 of polygon.triangles) {
                if (tri1.SAT(tri2, aabb)) return true;
            }
        }

        return false;
    }

    append(triangle) {
        this.#triangles.push(triangle.translate(this.#offsetX, this.#offsetY, this.#scale, this.#rotate, this.#followCam, this.#cameraX, this.#cameraY, this.#cameraScale, this.#cameraRotate));
        this.#boundingAABB();
        return this;
    }

    #boundingAABB() {
        if (this.#triangles.length < 1) return;

        const myBounding = this.#bounding;
        myBounding.left = Infinity;
        myBounding.right = -Infinity;
        myBounding.bottom = Infinity;
        myBounding.top = -Infinity;

        for (let index = 0; index < this.#triangles.length; index++) {
            const triBounding = this.#triangles[index].bounding;
            myBounding.left = Math.min(triBounding.left, myBounding.left);
            myBounding.right = Math.max(triBounding.right, myBounding.right);
            myBounding.bottom = Math.min(triBounding.bottom, myBounding.bottom);
            myBounding.top = Math.max(triBounding.top, myBounding.top);
        }
    }

    get triangles() {
        return this.#triangles;
    }

    get bounding() {
        return this.#bounding;
    }

    serialize() {
        return {
            triangles: JSON.stringify(this.#triangles.map(t => t.serialize())),
            bounding: JSON.stringify({...this.#bounding, width: this.#bounding.right - this.#bounding.left, height: this.#bounding.top - this.#bounding.bottom}),
            offsetX: this.#offsetX,
            offsetY: this.#offsetY,
            scale: this.#scale,
            rotate: this.#rotate,
            followCam: this.#followCam,
            cameraX: this.#cameraX,
            cameraY: this.#cameraY,
            cameraScale: this.#cameraScale,
            cameraRotate: this.#cameraRotate,
        }
    }

    translate(offsetX, offsetY, scale, rotate, followCam, cameraX, cameraY, cameraScale, cameraRotate) {
        if (
            offsetX === this.#offsetX &&
            offsetY === this.#offsetY &&
            scale === this.#scale &&
            rotate === this.#rotate &&
            followCam === this.#followCam &&
            cameraX === this.#cameraX &&
            cameraY === this.#cameraY &&
            cameraScale === this.#cameraScale &&
            cameraRotate === this.#cameraRotate
        ) return this;
        this.#triangles = this.#triangles.map(tri => tri.translate(offsetX, offsetY, scale, rotate, followCam, cameraX, cameraY, cameraScale, cameraRotate));
        this.#offsetX = offsetX;
        this.#offsetY = offsetY;
        this.#scale = scale;
        this.#rotate = rotate;
        this.#followCam = followCam;
        this.#cameraX = cameraX;
        this.#cameraY = cameraY;
        this.#cameraScale = cameraScale;
        this.#cameraRotate = cameraRotate;
        this.#boundingAABB();
        return this;
    }

    toString() {
        return "Polygon Object";
    }
};

class Hitbox {
    /**
     * Create a Polygon with 2 Triangles to be a rectangle.
     * @param {number} x The x in the upper left corner.
     * @param {number} y The y in the upper left corner.
     * @param {number} w The width of the rectangle.
     * @param {number} h The height of the rectangle.
     * @returns {Polygon}
     */
    static rectangle(x, y, w, h) {
        return new Polygon(
            new Triangle(
                x, y,
                x + w, y,
                x, y - h
            ),
            new Triangle(
                x + w, y,
                x, y - h, 
                x + w, y - h
            )
        );
    }

    /**
     * Create a Hitbox with 2 Triangles to be a rectangle.
     * @param {number} x The x in the upper left corner.
     * @param {number} y The y in the upper left corner.
     * @param {number} w The width of the rectangle.
     * @param {number} h The height of the rectangle.
     * @returns {Hitbox}
     */
    static rectBox(x, y, w, h) {
        return new Hitbox(this.rectangle(x, y, w, h));
    }

    /** @type {{[name: string]: Polygon}} */
    #boxes = {};
    /**
     * @param {Polygon} defaultHitbox default hitbox
     */
    constructor(defaultHitbox) {
        if (!defaultHitbox) throw new TypeError("Must declare the default polygon for hitbox.");
        this.setBox("default", defaultHitbox);
    }

    #bounding = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        toString: () => "Hitbox Bounding"
    };

    #offsetX = 0;
    #offsetY = 0;
    #scale = 1;
    #rotate = 0;
    #followCam = false;
    #cameraX = 0;
    #cameraY = 0;
    #cameraScale = 1;
    #cameraRotate = 0;

    /**
     * Set a hitbox by name.
     * @param {string} name The name of the hitbox
     * @param {Polygon} polygon The polygon box
     * @returns {this}
     */
    setBox(name, polygon) {
        this.#boxes[name] = polygon.translate(this.#offsetX, this.#offsetY, this.#scale, this.#rotate, this.#followCam, this.#cameraX, this.#cameraY, this.#cameraScale, this.#cameraRotate);
        this.#boundingAABB();
        return this;
    }

    /**
     * Get a hitbox by name.
     * @param {string} name The name of the hitbox.
     * @returns {Polygon}
     */
    getBox(name) {
        return this.#boxes[name] ?? this.#boxes["default"];
    }

    /**
     * Check this hitbox has the polygon box with the given name.
     * @param {string} name The name of hitbox
     * @returns {boolean}
     */
    hasBox(name) {
        return Object.hasOwn(this.#boxes, name);
    }

    deleteBox(name) {
        if (name === "default") throw new TypeError("Cannot delete the default hitbox.");
        delete this.#boxes[name];
        this.#boundingAABB();
    }

    /**
     * Determine if two collision boxes intersect.
     * @param {string} myType The name of hitbox
     * @param {Hitbox} targetHitbox target hitbox
     * @param {string} targetType target name of hitbox
     * @returns {boolean}
     */
    collision(myType, targetHitbox, targetType, aabb = true) {
        return this.getBox(myType).collision(targetHitbox.getBox(targetType), aabb);
    }

    /**
     * Translate the polygons that belong to this hitbox.
     * @param {number} offsetX 
     * @param {number} offsetY 
     * @param {number} scale 
     * @param {number} rotate 
     */
    translate(offsetX, offsetY, scale, rotate, followCam, cameraX, cameraY, cameraScale, cameraRotate) {
        if (
            offsetX === this.#offsetX &&
            offsetY === this.#offsetY &&
            scale === this.#scale &&
            rotate === this.#rotate &&
            followCam === this.#followCam &&
            cameraX === this.#cameraX &&
            cameraY === this.#cameraY &&
            cameraScale === this.#cameraScale &&
            cameraRotate === this.#cameraRotate
        ) return;
        for (const [key, polygon] of Object.entries(this.#boxes)) {
            this.#boxes[key] = polygon.translate(offsetX, offsetY, scale, rotate, followCam, cameraX, cameraY, cameraScale, cameraRotate);
        }
        this.#boundingAABB();
        this.#offsetX = offsetX;
        this.#offsetY = offsetY;
        this.#scale = scale;
        this.#rotate = rotate;
        this.#followCam = followCam;
        this.#cameraX = cameraX;
        this.#cameraY = cameraY;
        this.#cameraScale = cameraScale;
        this.#cameraRotate = cameraRotate;
    }

    #boundingAABB() {
        const polygons = Object.values(this.#boxes);
        if (polygons.length < 1) return;
        const myBounding = this.#bounding;
        myBounding.left = Infinity;
        myBounding.right = -Infinity;
        myBounding.bottom = Infinity;
        myBounding.top = -Infinity;

        for (let index = 0; index < polygons.length; index++) {
            const bounding = polygons[index].bounding;
            myBounding.left = Math.min(bounding.left, myBounding.left);
            myBounding.right = Math.max(bounding.right, myBounding.right);
            myBounding.bottom = Math.min(bounding.bottom, myBounding.bottom);
            myBounding.top = Math.max(bounding.top, myBounding.top);
        }
    }

    get boxes() {
        return Object.keys(this.#boxes);
    }

    get bounding() {
        return this.#bounding;
    }

    serialize() {
        return {
            polygons: JSON.stringify(Object.fromEntries(Object.entries(this.#boxes).map(box => [box[0], box[1].serialize()]))),
            bounding: JSON.stringify({...this.#bounding, width: this.#bounding.right - this.#bounding.left, height: this.#bounding.top - this.#bounding.bottom}),
            offsetX: this.#offsetX,
            offsetY: this.#offsetY,
            scale: this.#scale,
            rotate: this.#rotate,
            followCam: this.#followCam,
            cameraX: this.#cameraX,
            cameraY: this.#cameraY,
            cameraScale: this.#cameraScale,
            cameraRotate: this.#cameraRotate,
        }
    }

    toString() {
        return "Hitbox Object";
    }
}

class SAPCollision {
    /**
     * @typedef {{value: number, isMin: boolean, parent: string}} Point
     * @typedef {[Point, Point, Point, Point]} EntityPoints
     */

    /** @type {Point[]} */
    #x_sort = [];
    /** @type {Point[]} */
    #y_sort = [];
    
    /** @type {Map<string, EntityPoints>} */
    #entities = new Map();
    
    /** 
     * @type {Map<string, string[]>} 
     */
    #collisionPairs = new Map();

    constructor() {}

    /**
     * Add a new Entity
     * @param {string} id 
     * @param {number} minX 
     * @param {number} minY 
     * @param {number} maxX 
     * @param {number} maxY 
     */
    addEntity(id, minX, minY, maxX, maxY) {
        if (this.#entities.has(id)) {
            this.moveEntity(id, minX, minY, maxX, maxY);
            return;
        }
        const point_minX = { value: minX, isMin: true, parent: id };
        const point_minY = { value: minY, isMin: true, parent: id };
        const point_maxX = { value: maxX, isMin: false, parent: id };
        const point_maxY = { value: maxY, isMin: false, parent: id };

        this.#entities.set(id, [point_minX, point_minY, point_maxX, point_maxY]);
        this.#collisionPairs.set(id, []);
        
        this.#x_sort.push(point_minX, point_maxX);
        this.#y_sort.push(point_minY, point_maxY);
    }

    moveEntity(id, minX, minY, maxX, maxY) {
        const entity = this.#entities.get(id);
        if (!entity) return;
        entity[0].value = minX;
        entity[1].value = minY;
        entity[2].value = maxX;
        entity[3].value = maxY;
    }

    removeEntity(id) {
        const entity = this.#entities.get(id);
        if (!entity) return;

        this.#x_sort = this.#x_sort.filter(p => p.parent !== id);
        this.#y_sort = this.#y_sort.filter(p => p.parent !== id);
        
        this.#entities.delete(id);
        this.#collisionPairs.delete(id);
    }

    /**
     * True if id1 touch id2 or false.
     * @param {string} id1 
     * @param {string} id2 
     * @returns {boolean}
     */
    touch(id1, id2) {
        return Boolean(this.#collisionPairs.get(id1)?.includes(id2));
    }

    /**
     * Obtain all potential collision bodies.
     * @param {string} id 
     * @returns {string[]}
     */
    getPotentialCollisions(id) {
        return this.#collisionPairs.get(id) ?? [];
    }

    update() {
        this.#x_sort.sort((a, b) => a.value - b.value);
        this.#y_sort.sort((a, b) => a.value - b.value);

        for (const list of this.#collisionPairs.values()) {
            list.length = 0;
        }

        /** @type {Set<string>} */
        const xActive = new Set();
        /** @type {Map<string, Set<string>>} */
        const xOverlaps = new Map(); // X轴重叠关系

        for (const point of this.#x_sort) {
            if (point.isMin) {
                // 当前实体与所有活跃实体在X轴重叠
                for (const activeId of xActive) {
                    if (!xOverlaps.has(point.parent)) xOverlaps.set(point.parent, new Set());
                    if (!xOverlaps.has(activeId)) xOverlaps.set(activeId, new Set());
                    
                    xOverlaps.get(point.parent).add(activeId);
                    xOverlaps.get(activeId).add(point.parent);
                }
                xActive.add(point.parent);
            } else {
                xActive.delete(point.parent);
            }
        }

        /** @type {Set<string>} */
        const yActive = new Set();

        for (const point of this.#y_sort) {
            if (point.isMin) {
                const currentId = point.parent;
                const currentXOverlaps = xOverlaps.get(currentId);

                if (currentXOverlaps) {
                    const pairList = this.#collisionPairs.get(currentId);
                    for (const activeId of yActive) {
                        if (currentXOverlaps.has(activeId)) {
                            pairList.push(activeId);
                            this.#collisionPairs.get(activeId).push(currentId);
                        }
                    }
                }
                yActive.add(currentId);
            } else {
                yActive.delete(point.parent);
            }
        }
    }

    clear() {
        this.#x_sort.length = 0;
        this.#y_sort.length = 0;
        this.#entities.clear();
        this.#collisionPairs.clear();
    }
}

(function (Scratch) {
    const vm = Scratch?.runtime?.extensionManager?.vm ?? Scratch.vm.extensionManager?.vm;
    vm.Scratch = Scratch;
    //window.vm = vm;
    const {BlockType, ArgumentType, Cast} = Scratch;

    vm.runtime.ScratchError = class ScratchBasicError extends Error {
        scratchErrorType;
        constructor(message, type) {
            super(message);
            this.scratchErrorType = type;
        }
    }

    const label = text => ({blockType: BlockType.LABEL, text: text});
    const button = (funcName, text) => ({blockType: BlockType.BUTTON, func: funcName, text: text});
    const xml = xml => ({blockType: BlockType.XML, xml: xml});
    const ext_id = "BetterClone";
    const color1 = "#B57842";
    const color2 = "#6E5848";
    const color3 = "#9C8572";
    const menuIconURI = "https://m.ccw.site/creator-college/images/4715b1ff233284de9eca2873b30e9f41.svg";

    const compiler = vm.exports.i_will_not_ask_for_help_when_these_break();
    const JSGen = compiler.JSGenerator;
    const origin_descendStackedBlock = JSGen.prototype.descendStackedBlock;
    JSGen.prototype.descendStackedBlock =  function (block) {
        const inputs = block.inputs;
        if (block.opcode === `${ext_id}_tryCatchFinally`) {
            const Frame = JSGen.unstable_exports.Frame;
            const throwError = "console.error('未捕获的错误', {type: e.scratchErrorType ?? e.name, message: e.message})";

            this.source += "try{";
            if (block.substacks[1]) this.descendStack(block.substacks[1], new Frame(false));
            this.source += `}catch(e){switch(e.scratchErrorType ?? e.name){`;

            let substackCount = 2;
            for (const errType of Object.values(inputs)) {
                this.source += `case "${errType.value}":{`;
                if (block.substacks[substackCount]) this.descendStack(block.substacks[substackCount], new Frame(false));
                this.source += "break;}";
                substackCount++;
            }

            this.source += `default: {${throwError}}}}finally{try{`;
            if (block.substacks[999]) this.descendStack(block.substacks[999], new Frame(false));
            this.source += `}catch(e){${throwError}}};`;
        } else if (block.opcode === `${ext_id}_throwScratchError`) {
            this.source += `throw new runtime.ScratchError(${JSON.stringify(inputs.MESSAGE.value)}, ${JSON.stringify(block.fields.ERRORTYPE)});`;
        } else origin_descendStackedBlock.call(this, block);
    };

    // Fork from https://github.com/TurboWarp/scratch-vm/
    const Pen = class {
        static runtime = Scratch.runtime;
        static _penSkinId = -1;
        static _penDrawableId = -1;

        static toNumber(v) {
            const n = typeof v === 'number' ? v : Number(v);
            return Number.isNaN(n) ? 0 : n;
        }

        static clamp(n, min, max) { return Math.min(Math.max(n, min), max); }

        static rgbToHsv(rgb) {
            const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
            const x = Math.min(r, g, b), v = Math.max(r, g, b);
            let h = 0, s = 0;
            if (x !== v) {
                const f = (r === x) ? g - b : ((g === x) ? b - r : r - g);
                const i = (r === x) ? 3 : ((g === x) ? 5 : 1);
                h = ((i - (f / (v - x))) * 60) % 360;
                s = (v - x) / v;
            }
            return { h, s, v };
        }

        static hsvToRgb(hsv) {
            let h = hsv.h % 360; if (h < 0) h += 360;
            const s = Math.max(0, Math.min(hsv.s, 1));
            const v = Math.max(0, Math.min(hsv.v, 1));
            const i = Math.floor(h / 60), f = h / 60 - i;
            const p = v * (1 - s), q = v * (1 - s * f), t = v * (1 - s * (1 - f));
            let r, g, b;
            switch (i) {
                default: case 0: r=v; g=t; b=p; break; case 1: r=q; g=v; b=p; break;
                case 2: r=p; g=v; b=t; break; case 3: r=p; g=q; b=v; break;
                case 4: r=t; g=p; b=v; break; case 5: r=v; g=p; b=q; break;
            }
            return { r: Math.floor(r*255), g: Math.floor(g*255), b: Math.floor(b*255) };
        }

        static toRgbColorObject(value) {
            if (typeof value === 'string' && value[0] === '#') {
                const hex = value.substring(1);
                const parsed = parseInt(hex, 16);
                if (isNaN(parsed)) return { r: 0, g: 0, b: 0, a: 255 };
                if (hex.length === 6) return { r: (parsed>>16)&0xff, g: (parsed>>8)&0xff, b: parsed&0xff };
                if (hex.length === 3) {
                    const r=(parsed>>8)&0xf, g=(parsed>>4)&0xf, b=parsed&0xf;
                    return { r:(r<<4)|r, g:(g<<4)|g, b:(b<<4)|b };
                }
                return { r: 0, g: 0, b: 0, a: 255 };
            }
            const dec = this.toNumber(value);
            const a = (dec >> 24) & 0xFF;
            return { r: (dec>>16)&0xFF, g: (dec>>8)&0xFF, b: dec&0xFF, a: a > 0 ? a : 255 };
        }

        static get STATE_KEY() { return 'Scratch.pen'; }

        static _getPenSkinId() {
            const renderer = this.runtime.renderer;
            if (this._penSkinId < 0 && renderer) {
                this._penSkinId = renderer.createPenSkin();
                this._penDrawableId = renderer.createDrawable('pen');
                if (renderer.markDrawableAsNoninteractive) renderer.markDrawableAsNoninteractive(this._penDrawableId);
                renderer.updateDrawableSkinId(this._penDrawableId, this._penSkinId);
            }
            return this._penSkinId;
        }

        static _getPenAttrs(target) {
            let state = target._customState[this.STATE_KEY];
            if (!state) {
                state = { color: 66.66, saturation: 100, brightness: 100, transparency: 0,
                        penAttributes: { color4f: [0, 0, 1, 1], diameter: 1 } };
                target.setCustomState(this.STATE_KEY, state);
            }
            return state.penAttributes;
        }

        static _updateColor(state) {
            const rgb = this.hsvToRgb({ h: state.color*3.6, s: state.saturation/100, v: state.brightness/100 });
            const c = state.penAttributes.color4f;
            c[0] = rgb.r/255; c[1] = rgb.g/255; c[2] = rgb.b/255;
            c[3] = 1 - state.transparency / 100;
        }

        static drawLine(target, x1, y1, x2, y2) {
            const skinId = this._getPenSkinId();
            if (skinId >= 0) {
                this.runtime.renderer.penLine(skinId, this._getPenAttrs(target),
                    this.toNumber(x1), this.toNumber(y1), this.toNumber(x2), this.toNumber(y2));
                this.runtime.requestRedraw();
            }
        }

        static stamp(target) {
            const skinId = this._getPenSkinId();
            if (skinId >= 0) {
                this.runtime.renderer.penStamp(skinId, target.drawableID);
                this.runtime.requestRedraw();
            }
        }

        static stampImmediate(target) {
            this.runtime.renderer.updateDrawableProperties(target.drawableID, {
                position: [target.x, target.y],
                direction: target.direction,
                scale: [target.size, target.size],
                visible: target.visible,
                ghost: target.effects?.ghost,
                brightness: target.effects?.brightness,
            });

            this.stamp();
        }

        static setPenColorToColor(target, color) {
            let state = target._customState[this.STATE_KEY];
            if (!state) {
                state = { color: 66.66, saturation: 100, brightness: 100, transparency: 0, penAttributes: { color4f: [0, 0, 1, 1], diameter: 1 } };
                target.setCustomState(this.STATE_KEY, state);
            }
            const rgb = this.toRgbColorObject(color);
            const hsv = this.rgbToHsv(rgb);
            state.color = hsv.h / 3.6;
            state.saturation = hsv.s * 100;
            state.brightness = hsv.v * 100;
            state.transparency = Object.prototype.hasOwnProperty.call(rgb, 'a') ? 100 * (1 - rgb.a / 255) : 0;
            this._updateColor(state);
        }

        static setPenSizeTo(size) {
            const attrs = this._getPenAttrs();
            const limits = this.runtime.runtimeOptions?.miscLimits;
            const hq = this.runtime.renderer?.useHighQualityRender;
            attrs.diameter = (!limits || hq) ? Math.max(0, this.toNumber(size))
                : this.clamp(this.toNumber(size), 1, 1200);
        }

        static clear() {
            const renderer = this.runtime.renderer;
            const skinId = this._getPenSkinId();
            if (skinId >= 0 && renderer) {
                renderer.penClear(skinId);
                this.runtime.requestRedraw();
            }
        }
    };

    // 添加新的时不要忘了初始化
    /**@type {Map<string, object>} */
    const cloneExtraData = new Map();

    /**@type {Map<string, object>} */
    const dataTemplate = new Map();

    /**@type {Map<string, Set<string>>} */
    const groups = new Map();

    /**@type {Map<string, Hitbox>} */
    const Hitboxes = new Map();

    /**@type {SAPCollision} */
    const SAPSystem = new SAPCollision();

    let lastestCreated = {};
    let lastestRemoved = {};

    function triggerHat(opcode, matchFields, target, params = {}, onlyOrigin = false) {
        const threadsStarted = [];
        
        let targets = Array.isArray(target) ? target : (target ? [target] : vm.runtime.target);
        if (onlyOrigin) {
            targets = targets.filter(t => t.isOriginal);
        }
        if (!Array.isArray(target) || targets.length < 1) return;
        
        const matchKeys = matchFields ? Object.keys(matchFields) : [];
        const hasMatchCondition = matchKeys.length > 0;

        for (const currentTarget of targets) {
            if (!currentTarget?.blocks?.getScripts) continue;

            const scripts = currentTarget.blocks.getScripts();

            for (const topBlockId of scripts) {
                const block = currentTarget.blocks.getBlock(topBlockId);

                if (!block || !block.topLevel || block.opcode !== opcode) continue;

                let isMatch = true;
                
                if (hasMatchCondition) {
                    for (let i = 0; i < matchKeys.length; i++) {
                        const key = matchKeys[i];
                        const expectedValue = matchFields[key];
                        
                        let actualValue = "";
                        if (block.fields[key]) {
                            actualValue = block.fields[key].value;
                        } else if (block.inputs[key]) {
                            const input = block.inputs[key];
                            const shadowBlock = currentTarget.blocks.getBlock(input.shadow || input.block);
                            
                            actualValue = 
                                shadowBlock?.fields?.[key]?.value ?? 
                                shadowBlock?.fields?.MENU?.value ??
                                Object.values(shadowBlock?.fields || {})?.[0]?.value;
                        } else {
                            isMatch = false;
                            break;
                        }

                        if (actualValue === undefined || Cast.toString(actualValue) !== Cast.toString(expectedValue)) {
                            isMatch = false;
                            break;
                        }
                    }
                }

                if (!isMatch) continue;

                const thread = vm.runtime._pushThread(topBlockId, currentTarget, {
                    stackClick: false,
                    updateMonitor: false,
                    hatParam: params
                });

                if (thread) {
                    threadsStarted.push(thread);
                }
            }
        }

        return threadsStarted;
    }

    // 把target打成超级拼装
    function flatTarget(target) {
        if (!target) return;
        return {
            "id": target.id,
            "spriteName": target.sprite.name,
            "originalTargetId": target.originalTargetId,
            "x": target.x,
            "y": target.y,
            "direction": target.direction,
            "rotationStyle": target.rotationStyle,
            "size": target.size,
            "costume": target.getCostumes()[target.currentCostume].name,
            "costumeIndex":target.currentCostume,
            "numberOfCostumes": target.getCostumes().length,
            "visiable": target.visible,
            "brightness": target.effects.brightness,
            "ghost": target.effects.ghost,
            "color": target.effects.color,
            "fisheye": target.effects.fisheye,
            "whirl": target.effects.whirl,
            "pixelate": target.effects.pixelate,
            "mosaic": target.effects.mosaic,
            "numberOfSounds": target.getSounds().length,
            "numberOfClones": target.sprite.clones.length - 1
        };
    }

    if (vm.runtime._CloneProEvents) {
        for (const [name, fn] of vm.runtime._CloneProEvents) {
            vm.runtime.off(name, fn);
        }
    }

    const events = [
        ["PROJECT_START", () => {
            Pen.clear()
            lastestCreated = {};
            lastestRemoved = {};
            cloneExtraData.clear();
            dataTemplate.clear();
            groups.clear();
            Hitboxes.clear();
            SAPSystem.clear();
        }],
        ["targetWasCreated", target => {
            lastestCreated = target;
            const flat = flatTarget(target);
            const name = target.getName();
            triggerHat(`${ext_id}_whenTargetWasCreated`, {SPRITE: name, ONLYORIGIN: true}, vm.runtime.getSpriteTargetByName(name), flat, true);
            triggerHat(`${ext_id}_whenTargetWasCreated`, {SPRITE: name, ONLYORIGIN: false}, null, flat, false);
        }],
        ["targetWasRemoved", target => {
            lastestRemoved = target;
            const flat = flatTarget(target);
            const name = target.getName();
            const id = target.id;
            triggerHat(`${ext_id}_whenTargetWasCreated`, {SPRITE: name, ONLYORIGIN: true}, vm.runtime.getSpriteTargetByName(name), flat, true);
            triggerHat(`${ext_id}_whenTargetWasCreated`, {SPRITE: name, ONLYORIGIN: false}, null, flat, false);

            groups.forEach(g => g.delete(id));
            cloneExtraData.delete(id);
            Hitboxes.delete(id);
            SAPSystem.removeEntity(id);
        }],
        ["PROJECT_STOP_ALL", () => Pen.clear()]
    ];

    vm.runtime._CloneProEvents = events;
    for (const [name, fn] of events) {
        vm.runtime.on(name, fn);
    }

    class ClonePro {
        #scratchUid() {
            const chars = '!#$%()*+,-./:;=?@[]^_`{|}~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const targetLength = 20;
            let id = "";
            for (let i = 0; i < targetLength; i++) {
                id += chars.charAt(Math.random() * chars.length);
            }
            return id;
        };

        constructor () {
            this._runtime = vm.runtime;
            this.blockly_is_proxy = false;
        }

        hijack(fn){
            const orig_ = Function.prototype.apply;
            Function.prototype.apply = (this_args) => this_args;
            const result=fn();
            Function.prototype.apply = orig_;
            return result;
        }

        getListener(e){
            return e instanceof Array ? e[e.length-1] : e;
        }

        proxy_blockly() {
            if (this.blockly_is_proxy) return;

            const Blockly = this._runtime.scratchBlocks || this.hijack(this.getListener(this._runtime._events.EXTENSION_ADDED))?.scratchBlocks;
            if (Blockly === undefined) return 'error';

            if (this._runtime.orig_blocks) {
                Blockly.Blocks = this._runtime.orig_blocks;
            }

            const CATCH_INPUT_TYPE = 'CLONEPRO_CATCH_TYPE';

            class ButtonField extends Blockly.FieldLabel {
                constructor(text, validator, runtime) {
                    super(text, validator);
                    this.binds = [];
                    this.eventReady = false;
                    this.runtime = runtime;

                    this._boundMousedownHandler = this.mousedownHandler.bind(this);
                    this._boundMouseupHandler = this.mouseupHandler.bind(this);
                    this._boundTouchstartHandler = this.mousedownHandler.bind(this);
                    this._boundTouchmoveHandler = (e) => { e.stopPropagation(); };
                    this._boundTouchendHandler = this.touchendHandler.bind(this);
                }

                init() {
                    super.init();
                    const svgRoot = this.getSvgRoot();
                    svgRoot.style.cursor = 'default';
                    if (!this.eventReady) {
                        svgRoot.removeEventListener("mousedown", this._boundMousedownHandler);
                        svgRoot.removeEventListener("mouseup", this._boundMouseupHandler);
                        svgRoot.addEventListener("mousedown", this._boundMousedownHandler);
                        svgRoot.addEventListener("mouseup", this._boundMouseupHandler);

                        svgRoot.removeEventListener("touchstart", this._boundTouchstartHandler);
                        svgRoot.removeEventListener("touchend", this._boundTouchendHandler);
                        svgRoot.addEventListener("touchstart", this._boundTouchstartHandler);
                        svgRoot.addEventListener("touchmove", this._boundTouchmoveHandler);
                        svgRoot.addEventListener("touchend", this._boundTouchendHandler);
                        this.eventReady = true;
                    }
                }

                mousedownHandler(e) { e.stopPropagation(); }

                mouseupHandler(e) {
                    if (!this.sourceBlock_ || !this.sourceBlock_.workspace) return;
                    if (this.sourceBlock_.workspace.isDragging()) return;
                    if (this.sourceBlock_.isInFlyout) return;
                    this.handleClick.call(this, e);
                }

                touchendHandler(e) {
                    this.mouseupHandler.call(this, e);
                    e.stopPropagation();
                }

                dispose() { super.dispose(); }
            }

            class AddCatchButton extends ButtonField {
                constructor(text, validator) { super(text, validator); }
                handleClick() {
                    const sourceBlock = this.sourceBlock_;
                    if (sourceBlock.catchNum < 100) {
                        const oldMutation = Blockly.Xml.domToText(sourceBlock.mutationToDom());
                        sourceBlock.catchNum += 1;
                        sourceBlock.updateDisplay(oldMutation);
                    }
                }
            }

            class RemoveCatchButton extends ButtonField {
                constructor(text, validator) { super(text, validator); }
                handleClick() {
                    const sourceBlock = this.sourceBlock_;
                    const oldMutation = Blockly.Xml.domToText(sourceBlock.mutationToDom());
                    if (sourceBlock.catchNum < 2) return;
                    sourceBlock.catchNum -= 1;
                    sourceBlock.updateDisplay(oldMutation);
                }
            }

            this._runtime.orig_blocks = Blockly.Blocks;
            const runtime = this._runtime;
            // window.Blockly = Blockly;

            this._runtime.scratchBlocks.Blocks = new Proxy(this._runtime.orig_blocks, {
                set(target, blockName, blockInfo, proxy) {
                    if (blockName === `${ext_id}_menu_ERRORTYPE`) {
                        blockInfo.orig_init = blockInfo.init;
                        blockInfo.init = function () {
                            blockInfo.orig_init.call(this);
                            if (this.outputConnection) {
                                this.outputConnection.setCheck(CATCH_INPUT_TYPE);
                            }
                        };
                    }

                    if (blockName === `${ext_id}_tryCatchFinally`) {
                        blockInfo._runtime = runtime;
                        blockInfo.orig_init = blockInfo.init;

                        blockInfo.inputNames = {
                            catch_name: `CATCH_`,
                            getStatementName: (id) => `SUBSTACK${id + 1}`
                        };

                        blockInfo.staticStatement = function () {
                            if (!this.getInput('SUBSTACK')) {
                                this.appendStatementInput('SUBSTACK');
                            }
                            if (!this.getInput('LABEL_FINALLY')) {
                                this.appendDummyInput('LABEL_FINALLY')
                                    .appendField(new Blockly.FieldLabel('finally', 'keyword'));
                            }
                            if (!this.getInput('SUBSTACK999')) {
                                this.appendStatementInput('SUBSTACK999');
                            }
                        };

                        blockInfo.init = function () {
                            blockInfo.orig_init.call(this);
                            if (!this.inputList) return;

                            if (this.getInput('SUBSTACK')) this.removeInput('SUBSTACK');
                            this.staticStatement();

                            this.catchNum = 1;
                            if (this.workspace.id !== Blockly.mainWorkspace.id) this.updateDisplay();
                        };

                        blockInfo.updateDisplay = function (oldMutation) {
                            const wasRendered = this.rendered;
                            this.rendered = false;
                            Blockly.Events.setGroup(true);

                            let finallyBlock = null;
                            Blockly.Events.disable();
                            const finallyInput = this.getInput('SUBSTACK999');
                            if (finallyInput && finallyInput.connection && finallyInput.connection.targetBlock()) {
                                finallyBlock = finallyInput.connection.targetBlock();
                                finallyBlock.previousConnection.disconnect();
                            }
                            Blockly.Events.enable();

                            this.updateCatches(oldMutation);
                            this.appendCatchButton();

                            const newMutation = Blockly.Xml.domToText(this.mutationToDom());
                            this.setMovable(true);
                            Blockly.Events.fire(new Blockly.Events.BlockChange(this, "mutation", null, oldMutation, newMutation));

                            const finallyLabel = this.getInput('LABEL_FINALLY');
                            const finallyStack = this.getInput('SUBSTACK999');
                            if (finallyLabel && finallyStack) {
                                this.moveInputBefore('LABEL_FINALLY', null);
                                this.moveInputBefore('SUBSTACK999', null);
                            }

                            if (finallyBlock) {
                                const newFinallyInput = this.getInput('SUBSTACK999');
                                if (newFinallyInput && newFinallyInput.connection) {
                                    Blockly.Events.disable();
                                    finallyBlock.previousConnection.connect(newFinallyInput.connection);
                                    Blockly.Events.enable();
                                }
                            }

                            Blockly.ScratchBlocks.ProcedureUtils.deleteShadows_();
                            Blockly.Events.setGroup(false);
                            this.rendered = wasRendered;

                            if (wasRendered && !this.isInsertionMarker()) {
                                this.initSvg();
                                this.render();
                            }
                        };

                        blockInfo.updateCatches = function (oldMutation) {
                            const inputNames = this.inputNames;
                            let inputNeedRemove = [];

                            for (let input of this.inputList) {
                                if (input.name.startsWith(inputNames.catch_name)) {
                                    inputNeedRemove.push(input.name);
                                } else if (input.name.startsWith('SUBSTACK') &&
                                    input.name !== 'SUBSTACK' &&
                                    input.name !== 'SUBSTACK999') {
                                    inputNeedRemove.push(input.name);
                                }
                            }

                            let oldConnectionBlock = {};
                            Blockly.Events.disable();

                            for (let inputName of inputNeedRemove) {
                                const input = this.getInput(inputName);
                                if (input?.connection?.targetConnection?.sourceBlock_) {
                                    const oldBlock = input.connection.targetBlock();
                                    oldBlock.wasShadow = oldBlock.isShadow_;

                                    if (inputName.startsWith(inputNames.catch_name)) {
                                        if (oldBlock.wasShadow) {
                                            oldBlock.oldShadowText = oldBlock.inputList[0].fieldRow[0].text_;
                                            oldBlock.dispose();
                                        }
                                    } else if (inputName.startsWith('SUBSTACK')) {
                                        const id = parseInt(inputName.replace('SUBSTACK', ''), 10) - 1;
                                        if (id <= this.catchNum) {
                                            oldBlock.render(false);
                                        }
                                        oldBlock.previousConnection.disconnect();
                                        oldBlock.moveBy(20, 0);
                                        input.connection.targetConnection = null;
                                    }
                                    oldConnectionBlock[input.name] = oldBlock;
                                }
                                this.removeInput(inputName);
                            }

                            Blockly.Events.enable();

                            for (let i = 1; i <= this.catchNum; i++) {
                                this.createCatchWithId(i, oldConnectionBlock);
                            }
                        };

                        blockInfo.appendCatchButton = function () {
                            if (this.workspace.id !== Blockly.mainWorkspace.id || this.isInsertionMarker()) return;

                            while (this.getInput("BUTTON_CATCH")) this.removeInput("BUTTON_CATCH");

                            const input = this.appendDummyInput("BUTTON_CATCH");
                            input.setAlign(Blockly.ALIGN_LEFT);
                            input.appendField(new AddCatchButton("▼", null));
                            if (this.catchNum > 1) {
                                input.appendField(new RemoveCatchButton("▲", null));
                            }
                            return input;
                        };

                        blockInfo.createCatchWithId = function (id, oldConnectionBlock) {
                            const inputNames = this.inputNames;
                            const catchInputName = inputNames.catch_name + id;
                            const statementInputName = inputNames.getStatementName(id);

                            const catchDataInput = this.appendValueInput(catchInputName);
                            catchDataInput.appendField(new Blockly.FieldLabel('catch', null));
                            catchDataInput.setCheck(CATCH_INPUT_TYPE);

                            const SHADOW_TYPE = `${ext_id}_menu_ERRORTYPE`;
                            const SHADOW_FIELD_NAME = 'ERRORTYPE';
                            const DEFAULT_FIELD_VALUE = 'ScratchError';

                            const oldCatchBlock = oldConnectionBlock?.[catchInputName];
                            const hasOldRealBlock = oldCatchBlock && !oldCatchBlock.wasShadow;

                            if (!this.isInsertionMarker()) {
                                if (hasOldRealBlock) {
                                    oldCatchBlock.setShadow(false);
                                    oldCatchBlock.hidden = false;
                                    oldCatchBlock.initSvg();
                                    oldCatchBlock.render(false);
                                    oldCatchBlock.outputConnection.connect(catchDataInput.connection);

                                    const fallbackShadowDom = Blockly.Xml.textToDom(
                                        `<shadow type="${SHADOW_TYPE}"><field name="${SHADOW_FIELD_NAME}">${DEFAULT_FIELD_VALUE}</field></shadow>`
                                    );
                                    catchDataInput.connection.setShadowDom(fallbackShadowDom);
                                } else {
                                    let fieldValue = DEFAULT_FIELD_VALUE;
                                    if (oldCatchBlock?.wasShadow && oldCatchBlock?.oldShadowText) {
                                        fieldValue = oldCatchBlock.oldShadowText;
                                    }

                                    const menuShadow = Blockly.Xml.textToDom(
                                        `<shadow type="${SHADOW_TYPE}"><field name="${SHADOW_FIELD_NAME}">${fieldValue}</field></shadow>`
                                    );
                                    catchDataInput.connection.setShadowDom(menuShadow);

                                    const newBlock = Blockly.Xml.domToBlock(menuShadow, this.workspace);
                                    catchDataInput.connection.connect(newBlock.outputConnection);
                                }
                            }

                            const statementInput = this.appendStatementInput(statementInputName);
                            if (oldConnectionBlock?.[statementInputName] && !this.isInsertionMarker()) {
                                const oldStatementBlock = oldConnectionBlock[statementInputName];
                                oldStatementBlock.hidden = false;
                                oldStatementBlock.initSvg();
                                oldStatementBlock.render(false);
                                oldStatementBlock.previousConnection.connect(statementInput.connection);
                            }

                            if (!this.isInsertionMarker()) this.render();
                            return catchDataInput;
                        };

                        blockInfo.mutationToDom = function () {
                            const container = document.createElement("mutation");
                            container.setAttribute("catch_num", JSON.stringify(this.catchNum));
                            container.setAttribute("try_statement", "true");
                            container.setAttribute("finally_statement", "true");
                            return container;
                        };

                        blockInfo.domToMutation = function (xmlElement) {
                            this.catchNum = JSON.parse(decodeURI(xmlElement.getAttribute('catch_num')));
                            this.staticStatement();
                            this.updateDisplay();
                            if (!this.isInsertionMarker()) {
                                this.initSvg();
                                this.render();
                            }
                        };
                    }
                    return Reflect.set(target, blockName, blockInfo);
                }
            });
        }

        #commentSign(sign) {
            return `${ext_id}扩展(@Twenty)保存在作品中的${sign}数据\n若您删除此注释即为清空储存的数据\n不建议您手动编辑或更改 但可以拖动 折叠`;
        }

        #findCommentTarget(start) {
            return Object.values(vm.runtime.targets[0].comments).filter(c => c.text.startsWith(start))[0];
        }

        #commentInStage(sign, content) {
            vm.runtime.targets[0].createComment(this.#scratchUid(), null, this.#commentSign(sign)+content, 0, 0, 600, 300, false);
        }

        #updateComment(sign, content) {
            const commentSign = this.#commentSign(sign);
            const targetComment = this.#findCommentTarget(commentSign);
            if (targetComment) {
                targetComment.text = commentSign+content;
                vm.runtime.emitTargetCommentsChanged(vm.runtime.targets[0].id, ["update", targetComment.id, targetComment]);
            } else {
                this.#commentInStage(sign, content);
            }
        }

        #getConfig(sign, defaultValue) {
            const commentSign = this.#commentSign(sign);
            const targetComment = this.#findCommentTarget(commentSign);
            if (targetComment) {
                return targetComment.text.slice(commentSign.length);
            } else {
                this.#commentInStage(sign, defaultValue);
                return defaultValue;
            }
        }

        getInfo() {
            this.proxy_blockly();
            return {
                id: ext_id,
                name: "Better Clone",
                color1: color1, 
                color2: color2, 
                color3: color3,
                menuIconURI: menuIconURI,
                blocks: [
                    label("感觉dolly设计的挺奇怪的所以我想自己写一个，肯定没dolly好（"),
                    label("Basic Information"),
                    {
                        opcode: "isOrigin",
                        blockType: BlockType.BOOLEAN,
                        text: "Am I origin?",
                        arguments: {}
                    },
                    {
                        opcode: "myId",
                        blockType: BlockType.REPORTER,
                        text: "My id",
                        arguments: {}
                    },
                    {
                        opcode: "myArribute",
                        blockType: BlockType.REPORTER,
                        text: "My [ATTRIBUTE]",
                        arguments: {
                            ATTRIBUTE: {
                                menu: "attribute"
                            }
                        }
                    },
                    {
                        opcode: "itsArribute",
                        blockType: BlockType.REPORTER,
                        text: "[ID]'s [ATTRIBUTE]",
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: "id"
                            },
                            ATTRIBUTE: {
                                menu: "attribute"
                            }
                        }
                    },
                    {
                        opcode: "setIdAttribute",
                        blockType: BlockType.COMMAND,
                        text: "[ID]'s [ATTRIBUTE] [OPERATOR] [VALUE]",
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: "id"
                            },
                            ATTRIBUTE: {
                                menu: "templateData"
                            },
                            OPERATOR: {
                                menu: "operators",
                                defaultValue: "="
                            },
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: "value"
                            }
                        }
                    },
                    {
                        opcode: "myVariable",
                        blockType: BlockType.REPORTER,
                        text: "My variable [VAR]",
                        arguments: {
                            VAR: {
                                menu: "currentVariables"
                            }
                        }
                    },
                    {
                        opcode: "itsVariable",
                        blockType: BlockType.REPORTER,
                        text: "[ID]'s [VAR]",
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: "id"
                            },
                            VAR: {
                                menu: "allVariables"
                            }
                        }
                    },
                    {
                        opcode: "setItsVariable",
                        blockType: BlockType.COMMAND,
                        text: "[ID]'s [VAR] [OPERATOR] [VALUE]",
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: "id"
                            },
                            VAR: {
                                menu: "allVariables"
                            },
                            OPERATOR: {
                                menu: "operators"
                            },
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: "value"
                            },
                        }
                    },
                    {
                        opcode: "myDollyArribute",
                        blockType: BlockType.REPORTER,
                        text: "My dolly- [DOLLY_ATTRIBUTE]",
                        arguments: {
                            DOLLY_ATTRIBUTE: {
                                type: ArgumentType.STRING,
                                defaultValue: "attribute"
                            }
                        }
                    },
                    {
                        opcode: "itsDollyArribute",
                        blockType: BlockType.REPORTER,
                        text: "[ID]'s dolly- [DOLLY_ATTRIBUTE]",
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: "id"
                            },
                            DOLLY_ATTRIBUTE: {
                                type: ArgumentType.STRING,
                                defaultValue: "attribute"
                            }
                        }
                    },
                    {
                        opcode: "idExist",
                        blockType: BlockType.BOOLEAN,
                        text: "Does the [ID] exist?",
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: "id"
                            }
                        }
                    },
                    {
                        opcode: "spriteCloneList",
                        blockType: BlockType.REPORTER,
                        text: "All clones' id of [SPRITE] (include origin?[ORIGIN])",
                        arguments: {
                            SPRITE: {
                                menu: "allSpriteList",
                            },
                            ORIGIN: {
                                menu: "boolValue"
                            }
                        }
                    },
                    {
                        opcode: "originId",
                        blockType: BlockType.REPORTER,
                        text: "Origin of [SPRITE]'s id",
                        arguments: {
                            SPRITE: {
                                menu: "spriteList",
                            }
                        }
                    },
                    label("Clone"),
                    button("registerTemplate", "注册模板"),
                    button("cancelTemplate", "注销模板"),
                    {
                        opcode: "defineDataTemplate",
                        blockType: BlockType.COMMAND,
                        text: "Define data template: [NAME] with x:[X] y:[Y] dir:[DIRECTION] rotation style:[ROTATIONSTYLE] size:[SIZE] costume:[COSTUME] visiable:[VISIABLE] brightness:[BRIGHTNESS] ghost:[GHOST] color:[COLOR] fisheye:[FISHEYE] whirl:[WHIRL] pixelate:[PIXELATE] mosaic:[MOSAIC]",
                        arguments: {
                            NAME: {
                                menu: "templates"
                            },
                            X: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            DIRECTION: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 90
                            },
                            ROTATIONSTYLE: {
                                menu: "rotationStyle",
                            },
                            SIZE: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 100
                            },
                            COSTUME: {
                                type: ArgumentType.COSTUME,
                            },
                            VISIABLE: {
                                menu: "boolValue",
                                defaultValue: "true"
                            },
                            BRIGHTNESS: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            GHOST: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            COLOR: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            FISHEYE: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            WHIRL: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            PIXELATE: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            MOSAIC: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: "modifyDataTemplate",
                        blockType: BlockType.COMMAND,
                        text: "Modify the template [NAME] data [DATA] to [VALUE]",
                        arguments: {
                            NAME: {
                                menu: "templates"
                            },
                            DATA: {
                                menu: "templateData",
                            },
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: "value"
                            }
                        }
                    },
                    {
                        opcode: "deleteDataTemplate",
                        blockType: BlockType.COMMAND,
                        text: "Delete the data template [NAME]",
                        arguments: {
                            NAME: {
                                menu: "templates"
                            },
                        }
                    },
                    {
                        opcode: "clearDataTemplate",
                        blockType: BlockType.COMMAND,
                        text: "Clear all data templates",
                        arguments: {}
                    },
                    xml(`<block type="control_start_as_clone"></block>`),
                    {
                        opcode: "cloneWithTemplate",
                        blockType: BlockType.COMMAND,
                        text: "Clone [SPRITE] with template [NAME]",
                        arguments: {
                            SPRITE: {
                                menu: "spriteList"
                            },
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "template"
                            }
                        }
                    },
                    xml(`
                        <block type="control_create_clone_of">
                        <value name="CLONE_OPTION">
                            <shadow type="control_create_clone_of_menu">
                            <field name="CLONE_OPTION">_myself_</field>
                            </shadow>
                        </value>
                        </block>
                    `),
                    {
                        opcode: "removeClone",
                        blockType: BlockType.COMMAND,
                        text: "Remove the clone [ID]",
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: "id"
                            }
                        }
                    },
                    xml(`
                        <block type="control_delete_this_clone"></block>
                    `),
                    {
                        opcode: "latestCloneId",
                        blockType: BlockType.REPORTER,
                        text: "Latest clone ID",
                        arguments: {}
                    },
                    {
                        opcode: "latestRemoveId",
                        blockType: BlockType.REPORTER,
                        text: "Latest remove ID",
                        arguments: {}
                    },
                    {
                        opcode: "whenTargetWasCreated",
                        blockType: BlockType.EVENT,
                        text: "When [SPRITE] clone was created (only origin? [ONLYORIGIN])",
                        isEdgeActivated: false,
                        arguments: {
                            SPRITE: {
                                menu: "staticSpriteList",
                                type: ArgumentType.STRING
                            },
                            ONLYORIGIN: {
                                menu: "staticBoolValue",
                                defaultValue: "false",
                            }
                        }
                    },
                    {
                        opcode: "whenTargetWasRemoved",
                        blockType: BlockType.EVENT,
                        text: "When [SPRITE] clone was removed (only origin? [ONLYORIGIN])",
                        isEdgeActivated: false,
                        arguments: {
                            SPRITE: {
                                menu: "staticSpriteList",
                                type: ArgumentType.STRING
                            },
                            ONLYORIGIN: {
                                menu: "staticBoolValue",
                                defaultValue: "false",
                            }
                        }
                    },
                    label("Extra data"),
                    {
                        opcode: "setExtraData",
                        blockType: BlockType.COMMAND,
                        text: "Set my extra data [NAME] [OPERATOR] [VALUE]",
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            },
                            OPERATOR: {
                                menu: "operators",
                                defaultValue: "="
                            },
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: "value"
                            }
                        }
                    },
                    {
                        opcode: "deleteExtraData",
                        blockType: BlockType.COMMAND,
                        text: "Delete my extra data [NAME]",
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            }
                        }
                    },
                    {
                        opcode: "getExtraData",
                        blockType: BlockType.REPORTER,
                        text: "My extra data [NAME]",
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            }
                        }
                    },
                    {
                        opcode: "hasExtraData",
                        blockType: BlockType.BOOLEAN,
                        text: "Has extra data [NAME]",
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            }
                        }
                    },
                    {
                        opcode: "ifExtraData",
                        blockType: BlockType.CONDITIONAL,
                        text: "If my extra data [NAME]:",
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            }
                        }
                    },
                    {
                        opcode: "ifExtraDataEqualsTo",
                        blockType: BlockType.CONDITIONAL,
                        text: "If my extra data [NAME] [COMPARE] [VALUE]:",
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            },
                            COMPARE: {
                                menu: "compare",
                                defaultValue: "==="
                            },
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: "value"
                            }
                        }
                    },
                    {
                        opcode: "insExtraData",
                        blockType: BlockType.LOOP,
                        text: "Repeat [TIMES] times, my data [NAME]+=1 each time:",
                        arguments: {
                            TIMES: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 10
                            },
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            }
                        }
                    },
                    {
                        opcode: "repeatExtraData",
                        blockType: BlockType.LOOP,
                        text: "Repeat [TIMES] times, my data [NAME] [OPERATOR] [VALUE] each time (initValue [INIT]):",
                        arguments: {
                            TIMES: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 10
                            },
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            },
                            OPERATOR: {
                                menu: "operators",
                                defaultValue: "+="
                            },
                            VALUE: {
                                type: ArgumentType.NUMBER,
                                defaultValue: "1"
                            },
                            INIT: {
                                type: ArgumentType.NUMBER,
                                defaultValue: "0"
                            },
                        }
                    },
                    "---",
                    {
                        opcode: "setIdExtraData",
                        blockType: BlockType.COMMAND,
                        text: "Set [ID]'s extra data [NAME] [OPERATOR] [VALUE]",
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: "id"
                            },
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            },
                            OPERATOR: {
                                menu: "operators",
                                defaultValue: "="
                            },
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: "value"
                            }
                        }
                    },
                    {
                        opcode: "deleteIdExtraData",
                        blockType: BlockType.COMMAND,
                        text: "Delete [ID]'s extra data [NAME]",
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: "id"
                            },
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            }
                        }
                    },
                    {
                        opcode: "getIdExtraData",
                        blockType: BlockType.REPORTER,
                        text: "[ID]'s extra data [NAME]",
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: "id"
                            },
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            }
                        }
                    },
                    {
                        opcode: "IdHasExtraData",
                        blockType: BlockType.BOOLEAN,
                        text: "[ID] has extra data [NAME]",
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: "id"
                            },
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            }
                        }
                    },
                    {
                        opcode: "ifIdExtraData",
                        blockType: BlockType.CONDITIONAL,
                        text: "If [ID] extra data [NAME]:",
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: "id"
                            },
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            }
                        }
                    },
                    {
                        opcode: "ifIdExtraDataEqualsTo",
                        blockType: BlockType.CONDITIONAL,
                        text: "If [ID] extra data [NAME] [COMPARE] [VALUE]:",
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: "id"
                            },
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            },
                            COMPARE: {
                                menu: "compare",
                                defaultValue: "==="
                            },
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: "value"
                            }
                        }
                    },
                    {
                        opcode: "idInsExtraData",
                        blockType: BlockType.LOOP,
                        text: "Repeat [TIMES] times, [ID]'s data [NAME]+=1 each time:",
                        arguments: {
                            TIMES: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 10
                            },
                            ID: {
                                type: ArgumentType.STRING, 
                                defaultValue: "id"
                            },
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            }
                        }
                    },
                    {
                        opcode: "idRepeatExtraData",
                        blockType: BlockType.LOOP,
                        text: "Repeat [TIMES] times, [ID]'s data [NAME] [OPERATOR] [VALUE] each time (initValue [INIT]):",
                        arguments: {
                            TIMES: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 10
                            },
                            ID: {
                                type: ArgumentType.STRING, 
                                defaultValue: "id"
                            },
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            },
                            OPERATOR: {
                                menu: "operators",
                                defaultValue: "+="
                            },
                            VALUE: {
                                type: ArgumentType.NUMBER,
                                defaultValue: "1"
                            },
                            INIT: {
                                type: ArgumentType.NUMBER,
                                defaultValue: "0"
                            },
                        }
                    },
                    label("Group"),
                    button("registerGroup", "注册组名"),
                    button("cancelGroup", "注销组名"),
                    {
                        opcode: "createGroup",
                        blockType: BlockType.COMMAND,
                        text: "Create a group [NAME]",
                        arguments: {
                            NAME: {
                                menu: "groups"
                            }
                        }
                    },
                    {
                        opcode: "deleteGroup",
                        blockType: BlockType.COMMAND,
                        text: "Delete the group [NAME]",
                        arguments: {
                            NAME: {
                                menu: "groups"
                            }
                        }
                    },
                    {
                        opcode: "hasGroup",
                        blockType: BlockType.BOOLEAN,
                        text: "Has the group [NAME]",
                        arguments: {
                            NAME: {
                                menu: "groups"
                            }
                        }
                    },
                    "---",
                    {
                        opcode: "joinGroup",
                        blockType: BlockType.COMMAND,
                        text: "Join the group [NAME]",
                        arguments: {
                            NAME: {
                                menu: "groups"
                            }
                        }
                    },
                    {
                        opcode: "leaveGroup",
                        blockType: BlockType.COMMAND,
                        text: "Leave the group [NAME]",
                        arguments: {
                            NAME: {
                                menu: "groups"
                            }
                        }
                    },
                    {
                        opcode: "inGroup",
                        blockType: BlockType.BOOLEAN,
                        text: "Did I join the group [NAME]?",
                        arguments: {
                            NAME: {
                                menu: "groups"
                            }
                        }
                    },
                    {
                        opcode: "IdJoinGroup",
                        blockType: BlockType.COMMAND,
                        text: "Let [ID] join the group [NAME]",
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: "id"
                            },
                            NAME: {
                                menu: "groups"
                            }
                        }
                    },
                    {
                        opcode: "IdLeaveGroup",
                        blockType: BlockType.COMMAND,
                        text: "Let [ID] leave the group [NAME]",
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: "id"
                            },
                            NAME: {
                                menu: "groups"
                            }
                        }
                    },
                    {
                        opcode: "IdInGroup",
                        blockType: BlockType.BOOLEAN,
                        text: "Did [ID] join the group [NAME]?",
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: "id"
                            },
                            NAME: {
                                menu: "groups"
                            }
                        }
                    },
                    "---",
                    {
                        opcode: "membersOfGroup",
                        blockType: BlockType.REPORTER,
                        text: "Members of group [NAME]",
                        arguments: {
                            NAME: {
                                menu: "groups"
                            }
                        }
                    },
                    {
                        opcode: "sizeOfGroup",
                        blockType: BlockType.REPORTER,
                        text: "The size of the group [NAME]",
                        arguments: {
                            NAME: {
                                menu: "groups"
                            }
                        }
                    },
                    label("Hitbox"),
                    {
                        opcode: "createHitbox",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Create hitbox for me with default polygon [POLYGON]",
                        arguments: {
                            POLYGON: {
                                type: null
                            },
                        },
                    },
                    {
                        opcode: "createRectangle",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Rectangle x:[X] y:[Y] width:[W] height:[H]",
                        arguments: {
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            W: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            H: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        },
                    },
                    {
                        opcode: "createRectHitbox",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Create rectangular hitbox for me x:[X] y:[Y] width:[W] height:[H]",
                        arguments: {
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            W: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            H: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        },
                    },
                    {
                        opcode: "setHitbox",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Set my hitbox [NAME] to [POLYGON]",
                        arguments: {
                            NAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "default"
                            },
                            POLYGON: {
                                type: null
                            },
                        },
                    },
                    {
                        opcode: "deleteHitbox",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Delete my hitbox [NAME]",
                        arguments: {
                            NAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "default"
                            }
                        },
                    },
                    {
                        opcode: "createTriangle",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Create a triangle ([X0], [Y0]) ([X1], [Y1]) ([X2], [Y2])",
                        arguments: {
                            X0: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: "0"
                            },
                            Y0: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: "0"
                            },
                            X1: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: "0"
                            },
                            Y1: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: "0"
                            },
                            X2: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: "0"
                            },
                            Y2: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: "0"
                            },
                        },
                    },
                    {
                        opcode: "createPolygon",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Create a polygon with triangle [TRIANGLE]",
                        arguments: {
                            TRIANGLE: {
                                type: null
                            }
                        }
                    },
                    {
                        opcode: "appendForPolygon",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Append a triangle [TRIANGLE] to the polygon [POLYGON]",
                        arguments: {
                            POLYGON: {
                                type: null
                            },
                            TRIANGLE: {
                                type: null
                            },
                        }
                    },
                    "---",
                    {
                        opcode: "collisionTo",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "Did my hitbox [TYPE] touch id [ID]?",
                        arguments: {
                            TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "default"
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                            }
                        }
                    },
                    {
                        opcode: "idCollisionTo",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "Did [ID]'s hitbox [TYPE] touch id [TARGET]? In SAP?[SAP]",
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "id"
                            },
                            TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "default"
                            },
                            TARGET: {
                                type: Scratch.ArgumentType.STRING,
                            },
                            SAP: {
                                menu: "boolValue",
                                defaultValue: "false"
                            }
                        }
                    },
                    {
                        opcode: "collisionGroup",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "Did my hitbox [TYPE] touch the group [GROUP]? In SAP?[SAP]",
                        arguments: {
                            TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "default"
                            },
                            GROUP: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "group"
                            },
                            SAP: {
                                menu: "boolValue",
                                defaultValue: "false"
                            }
                        }
                    },
                    {
                        opcode: "idCollisionGroup",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "Did [ID]'s hitbox [TYPE] touch the group [GROUP]? In SAP?[SAP]",
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "id"
                            },
                            TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "default"
                            },
                            GROUP: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "group"
                            },
                            SAP: {
                                menu: "boolValue",
                                defaultValue: "false"
                            }
                        }
                    },
                    {
                        opcode: "groupCollisionGroup",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "Did group [GROUP1] [TYPE] touch the group [GROUP2]? In SAP?[SAP]",
                        arguments: {
                            GROUP1: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "group"
                            },
                            TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "default"
                            },
                            GROUP2: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "group"
                            },
                            SAP: {
                                menu: "boolValue",
                                defaultValue: "false"
                            }
                        }
                    },
                    {
                        opcode: "transform",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Transform my hitboxes [OFFSETX] [OFFSETY] [SCALE] [ROTATE] [FOLLOWCAM] [CAMX] [CAMY] [CAMSCALE] [CAMROTATE]",
                        arguments: {
                            OFFSETX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            OFFSETY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            SCALE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100
                            },
                            ROTATE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            FOLLOWCAM: {
                                type: Scratch.ArgumentType.BOOLEAN,
                                defaultValue: false
                            },
                            CAMX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            CAMY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            CAMSCALE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100
                            },
                            CAMROTATE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: "transformWithoutData",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Transform my hitboxes based on my attributes [FOLLOWCAM] [CAMX] [CAMY] [CAMSCALE] [CAMROTATE]",
                        arguments: {
                            FOLLOWCAM: {
                                type: Scratch.ArgumentType.BOOLEAN,
                                defaultValue: false
                            },
                            CAMX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            CAMY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            CAMSCALE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100
                            },
                            CAMROTATE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    "---",
                    {
                        opcode: "getMyHitbox",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Get my hitbox",
                        disableMonitor: true,
                        arguments: {}
                    },
                    {
                        opcode: "getIdHitbox",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Get [ID]'s hitbox",
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: "id"
                            }
                        }
                    },
                    {
                        opcode: "getPolygonOfHitbox",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Get polygon [NAME] of hitbox [HITBOX]",
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "name"
                            },
                            HITBOX: {
                                type: null
                            },
                        }
                    },
                    {
                        opcode: "getTriOfPolygon",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Get triangle [INDEX] of polygon [POLYGON]",
                        arguments: {
                            INDEX: {
                                type: ArgumentType.NUMBER,
                                defaultValue: "0"
                            },
                            POLYGON: {
                                type: null
                            },
                        }
                    },
                    {
                        opcode: "serialize",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Serialize [GRAPHICS]",
                        arguments: {
                            GRAPHICS: {
                                type: null
                            },
                        }
                    },
                    "---",
                    {
                        opcode: "drawHitbox",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Draw my hitbox [NAME] in color [COLOR]",
                        arguments: {
                            COLOR: {
                                type: Scratch.ArgumentType.COLOR,
                            },
                            NAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "default"
                            }
                        },
                    },
                    {
                        opcode: "clear",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Clear all",
                        arguments: {},
                    },
                    label("SAP (Sweep And Prune)"),
                    label("这是一种基于AABB实现的快速排除不可能碰撞物体的算法，自己去查"),
                    label("说人话就是增快效率，代价是占用空间，在物体数量小的情况下不需要使用"),
                    {
                        opcode: "joinSAP",
                        blockType: BlockType.COMMAND,
                        text: "Join the SAP system",
                        arguments: {}
                    },
                    {
                        opcode: "leaveSAP",
                        blockType: BlockType.COMMAND,
                        text: "Leave the SAP system",
                        arguments: {}
                    },
                    {
                        opcode: "moveInSAP",
                        blockType: BlockType.COMMAND,
                        text: "Move in SAP system.",
                        arguments: {}
                    },
                    {
                        opcode: "idJoinSAP",
                        blockType: BlockType.COMMAND,
                        text: "Let [ID] join the SAP system",
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: "id"
                            }
                        }
                    },
                    {
                        opcode: "idLeaveSAP",
                        blockType: BlockType.COMMAND,
                        text: "Let [ID] leave the SAP system",
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: "id"
                            }
                        }
                    },
                    {
                        opcode: "idMoveInSAP",
                        blockType: BlockType.COMMAND,
                        text: "Let [ID] move in SAP system.",
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: "id"
                            }
                        }
                    },
                    {
                        opcode: "updateSAP",
                        blockType: BlockType.COMMAND,
                        text: "Update the SAP system",
                        arguments: {}
                    },
                    label("Messages"),
                    {
                        opcode: "sendMessage",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Send a message [NAME] with data [DATA] to [ID_FILTER] [SPRITE_FILTER] [GROUP_FILTER] (only origin?[ONLYORIGIN])",
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "massage name"
                            },
                            DATA: {
                                type: ArgumentType.STRING,
                                defaultValue: "extra data"
                            },
                            ID_FILTER: {
                                type: ArgumentType.STRING,
                                defaultValue: "target id"
                            },
                            SPRITE_FILTER: {
                                menu: "stageSpriteList"
                            },
                            GROUP_FILTER: {
                                type: ArgumentType.STRING,
                                defaultValue: "group name"
                            },
                            ONLYORIGIN: {
                                menu: "boolValue",
                                defaultValue: "false"
                            }
                        }
                    },
                    {
                        opcode: "receiveMessage",
                        blockType: Scratch.BlockType.EVENT,
                        text: "When I received message [NAME]",
                        isEdgeActivated: false,
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "massage name"
                            }
                        }
                    },
                    label("Thread infomation"),
                    {
                        opcode: "hatParam",
                        blockType: BlockType.REPORTER,
                        text: "Hat parameter [VALUE]",
                        arguments: {
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: "key"
                            }
                        }
                    },
                    {
                        opcode: "setThreadVar",
                        blockType: BlockType.COMMAND,
                        text: "Set thread variable [KEY] [OPERATOR] [VALUE]",
                        arguments: {
                            KEY: {
                                type: ArgumentType.STRING,
                                defaultValue: "key"
                            },
                            OPERATOR: {
                                menu: "operators",
                                defaultValue: "="
                            },
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: "value"
                            },
                        }
                    },
                    {
                        opcode: "getThreadVar",
                        blockType: BlockType.REPORTER,
                        text: "Get thread variable [KEY]",
                        arguments: {
                            KEY: {
                                type: ArgumentType.STRING,
                                defaultValue: "key"
                            }
                        }
                    },
                    label("Error"),
                    button("registerErrorType", "注册错误类型"),
                    button("cancelErrorType", "注销错误类型"),
                    {
                        opcode: "tryCatchFinally",
                        text:'try',
                        arguments: {},
                        blockType: BlockType.LOOP,
                    },
                    {
                        opcode: "throwScratchError",
                        text:'throw new [ERRORTYPE] ([MESSAGE]);',
                        arguments: {
                            ERRORTYPE: {
                                menu: "ERRORTYPE",
                                type: ArgumentType.STRING
                            },
                            MESSAGE: {
                                type: ArgumentType.STRING,
                                defaultValue: "message"
                            }
                        },
                        blockType: BlockType.COMMAND,
                    },
                    label("NB Tools"),
                    xml(`<block type="${ext_id}_menu_globalVariables"></block>`),
                    xml(`<block type="${ext_id}_menu_currentVariables"></block>`),
                    xml(`<block type="${ext_id}_menu_allVariables"></block>`),
                    {
                        opcode: "log",
                        blockType: BlockType.COMMAND,
                        text: "console.[METHOD]([PARAM])",
                        arguments: {
                            METHOD: {
                                menu: "consoleMethod",
                                defaultValue: "log"
                            },
                            PARAM: {
                                type: ArgumentType.STRING,
                                defaultValue: "message"
                            }
                        }
                    },
                    {
                        opcode: "boolValue",
                        blockType: BlockType.BOOLEAN,
                        text: "[VALUE]",
                        arguments: {
                            VALUE: {
                                menu: "boolValue"
                            }
                        }
                    },
                    {
                        opcode: "str",
                        blockType: BlockType.REPORTER,
                        text: "[VALUE]",
                        arguments: {
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: ""
                            }
                        }
                    },
                    xml(`
                        <block type="looks_costume"></block>
                    `),
                    xml(`
                        <block type="${ext_id}_menu_rotationStyle"></block>
                    `),
                    {
                        opcode: "nullValue",
                        blockType: BlockType.REPORTER,
                        text: "null",
                        disableMonitor: true,
                        arguments: {}
                    },
                    {
                        opcode: "typeofObject",
                        blockType: BlockType.REPORTER,
                        text: "typeof [VALUE]",
                        arguments: {
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: "value"
                            }
                        }
                    },
                    label("相关信息"),
                    button("authorURL", "打开作者主页"),
                    button("ccwDocument", "打开文档"),
                ],
                menus: {
                    attribute: {
                        acceptReporters: true,
                        items: ["id", "spriteName", "isOrigin", "originalTargetId", "x", "y", "direction", "rotationStyle", "size", "costume", "costumeIndex", "numberOfCostumes", "visiable", "brightness", "ghost", "color", "fisheye", "whirl", "pixelate", "mosaic", "numberOfSounds", "numberOfClones", "bounding left", "bounding right", "bounding top", "bounding bottom", "bounding width", "bounding height"]
                    },
                    rotationStyle: {
                        acceptReporters: true,
                        items: ["all around", "left-right", "don't rotate"]
                    },
                    templateData: {
                        acceptReporters: true,
                        items: ["X","Y","DIRECTION","ROTATIONSTYLE","SIZE","COSTUME","VISIABLE","BRIGHTNESS","GHOST","COLOR","FISHEYE","WHIRL","PIXELATE","MOSAIC"]
                    },
                    boolValue: {
                        acceptReporters: true,
                        items: ["true", "false"]
                    },
                    staticBoolValue: {
                        acceptReporters: false,
                        items: ["true", "false"]
                    },
                    allSpriteList: {
                        acceptReporters: true,
                        items: "_findAllSpriteList"
                    },
                    spriteList: {
                        acceptReporters: true,
                        items: "_findSpriteList"
                    },
                    stageSpriteList: {
                        acceptReporters: true,
                        items: "_findStageSpriteList"
                    },
                    staticSpriteList: {
                        acceptReporters: false,
                        items: "_findSpriteList"
                    },
                    operators: {
                        acceptReporters: true,
                        items: ["=", "+=", "-=", "*=", "/=", "//=", "**=", "%="]
                    },
                    consoleMethod: {
                        acceptReporters: true,
                        items: ["debug","error","info","log","warn","dir","table","trace","group","groupCollapsed","groupEnd","clear","count","countReset","profile","profileEnd","time","timeLog","timeEnd","timeStamp"]  // 直接JSON.stringify(Object.keys(console))出来的再踢掉一些
                    },
                    compare: {
                        acceptReporters: true,
                        items: ["===", "==", ">", "<", ">=", "<=", "!="]
                    },
                    ERRORTYPE: {
                        acceptReporters: false,
                        items: "_getErrorTypes"
                    },
                    globalVariables: {
                        acceptReporters: true,
                        items: "_globalVariables"
                    },
                    currentVariables: {
                        acceptReporters: true,
                        items: "_currentVariables"
                    },
                    allVariables: {
                        acceptReporters: true,
                        items: "_allVariables"
                    },
                    bounding: {
                        acceptReporters: true,
                        items: ["left", "right", "top", "bottom", "width", "height"],
                    },
                    templates: {
                        acceptReporters: true,
                        items: "_getTemplates"
                    },
                    groups: {
                        acceptReporters: true,
                        items: "_getGroups"
                    }
                }
            };
        }

        _findMyDollyAttributes(id) {
            if (!vm.runtime.getTargetById(id).DollyPro) return ["Please install the Dolly Pro extension first."];
            const data = Object.keys(vm.runtime.getTargetById(id)?.DollyPro?.extraData);
            data.unshift("allTags");
            return data;
        };
        _findAllSpriteList(stage) {
            const lists = this._findSpriteList(stage);
            lists.unshift("All Sprites");
            return lists;
        }
        _findSpriteList(stage = false) {
            const lists = vm.runtime.targets.filter(t => t.isOriginal && (stage || !t.isStage)).map(t => t.getName());
            return lists;
        }
        _findStageSpriteList() {
            return this._findAllSpriteList(true);
        }

        #getDataFromComment(sign, defaultValue) {
            const dataString = this.#getConfig(sign, defaultValue);
            try {
                const data = JSON.parse(dataString);
                return data;
            } catch (error) {
                this.#commentInStage(sign, defaultValue);
                return JSON.parse(defaultValue);
            }
        }

        static defaultErrorTypes = '["ScratchError", "ScratchTypeError", "ScratchRangeError", "EvalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError", "AggregateError", "InternalError"]';

        _getErrorTypes() {
            const data = this.#getDataFromComment("ErrorType", ClonePro.defaultErrorTypes);
            if (data.length < 1) data.push("No Errors");
            return data;
        }

        _getTemplates() {
            const data = this.#getDataFromComment("TemplateNames", '[]');
            if (data.length < 1) data.push("No Templates");
            return data;
        }

        _getGroups() {
            const data = this.#getDataFromComment("Groups", '[]');
            if (data.length < 1) data.push("No Groups");
            return data;
        }

        #registerData(sign, promptTip, warn, defaultValue) {
            const inputData = String(prompt(promptTip));
            if (this.#checkInput(inputData)) {
                const commentData = this.#getDataFromComment(sign, defaultValue);

                if (commentData.includes(inputData)) {
                    alert(`${warn} ${inputData}`);
                    return;
                }

                commentData.push(inputData);
                this.#updateComment(sign, JSON.stringify(commentData));
            } else {
                alert("输入不合法 仅可输入英文字母 阿拉伯数字 下划线和美元符合且不以数字开头的值");
            }
        }

        #cancelData(sign, promptTip, defaultValue) {
            const inputString = String(prompt(promptTip));
            const commentData = this.#getDataFromComment(sign, defaultValue);
            commentData.splice(commentData.indexOf(inputString), 1);
            this.#updateComment(sign, JSON.stringify(commentData));
        }

        #getTargetVariables(target) {
            return Object.values(target.variables)?.map?.(v => ({text: `[${target.sprite.name}] ${v.name}`, value: v.id}));
        }

        _globalVariables() {
            const vars = this.#getTargetVariables(vm.runtime._stageTarget);
            if (!vars.length) vars.push("No global variables");
            return vars;
        }
        _currentVariables() {
            const vars = this.#getTargetVariables(vm.runtime._editingTarget);
            vars.push(...this._globalVariables());
            if (!vars.length) vars.push("No private variables");
            return vars;
        }
        _allVariables() {
            const allVars = [];
            vm.runtime.targets.forEach(t => {
                if (t.isOriginal) {
                    allVars.push(...this.#getTargetVariables(t));
                }
            });
            if (!allVars.length) allVars.push("No any variables");
            return allVars;
        }

        #calc(oldValue, operator, newValue) {
            switch (operator) {
                case "=":
                    return newValue;
                case "+=":
                    return oldValue + newValue;
                case "-=":
                    return oldValue - newValue;
                case "*=":
                    return oldValue * newValue;
                case "/=":
                    return oldValue / newValue;
                case "**=":
                    return oldValue ** newValue;
                case "//=":
                    return Math.floor(oldValue / newValue);
                case "%=":
                    return oldValue % newValue;
                default: return 0;
            }
        }

        #compare(value1, compare, value2) {
            switch (compare) {
                case "===":return value1 === value2;
                case "==":return value1 == value2;
                case ">":return value1 > value2;
                case "<":return value1 < value2;
                case ">=":return value1 >= value2;
                case "<=":return value1 <= value2;
                case "!=":return value1 != value2;
                default: return false;
            }
        }

        #getAttribute(id, attr, givenTarget) {
            const target = givenTarget ?? vm?.runtime?.getTargetById?.(id);
            if (!target) return "";
            switch (attr) {
                case "id": return id;
                case "spriteName": return target.getName();
                case "isOrigin": return target.isOriginal;
                case "originalTargetId": return target.originalTargetId;
                case "x": return target.x;
                case "y": return target.y;
                case "direction": return target.direction;
                case "rotationStyle": return target.rotationStyle;
                case "size": return target.size;
                case "costume": return target.getCostumes()[target.currentCostume].name;
                case "costumeIndex": return target.currentCostume;
                case "numberOfCostumes": return target.getCostumes().length;
                case "visiable": return target.visible;
                case "brightness": return target.effects.brightness;
                case "ghost": return target.effects.ghost;
                case "color": return target.effects.color;
                case "fisheye": return target.effects.fisheye;
                case "whirl": return target.effects.whirl;
                case "pixelate": return target.effects.pixelate;
                case "mosaic": return target.effects.mosaic;
                case "numberOfSounds": return target.getSounds().length;
                case "numberOfClones": return target.sprite.clones.length - 1; // 本体也在clones列表里面
                case "bounding left": return target.getBounds().left;
                case "bounding right": return target.getBounds().right;
                case "bounding top": return target.getBounds().top;
                case "bounding bottom": return target.getBounds().bottom;
                case "bounding width": return target.getBounds().width;
                case "bounding height": return target.getBounds().height;
                default: return "";
            }
        }

        #setAttribute(id, attr, OPERATOR, value, givenTarget) {
            const target = givenTarget ?? vm?.runtime?.getTargetById?.(id);
            if (!target) return;
            const newValue = this.#calc(this.#getAttribute(id, attr, givenTarget), OPERATOR, value);
            switch (attr) {
                case "X": target.setXY(newValue, target.y);
                case "Y": target.setXY(target.x, newValue);
                case "DIRECTION": target.setDirection(newValue);
                case "ROTATIONSTYLE": target.setRotationStyle(newValue);
                case "SIZE": target.setSize(newValue);
                case "COSTUME": target.setCostume(target.getCostumeIndexByName(target));
                case "VISIABLE": target.setVisible(newValue);
                case "BRIGHTNESS": target.setEffect("brightness", newValue);
                case "GHOST": target.setEffect("ghost", newValue);
                case "COLOR": target.setEffect("color", newValue);
                case "FISHEYE": target.setEffect("fisheye", newValue);
                case "WHIRL": target.setEffect("whirl", newValue);
                case "PIXELATE": target.setEffect("pixelate", newValue);
                case "MOSAIC": target.setEffect("mosaic", newValue);
                default:break;
            }
        }

        #cloneList(SPRITE, ORIGIN) {
            let list;
            if (SPRITE === "All Sprites") list = vm?.runtime?.targets;
            else list = vm?.runtime?.getSpriteTargetByName?.(SPRITE)?.sprite?.clones;

            if (!list) return [];

            if (ORIGIN === "false" || !ORIGIN) list = list.filter(i => !i.isOriginal);
            list = list.map(c => c.id);
            return list;
        }

        #checkInput(input) {
            return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(input);
        }

        isOrigin(args, util) {
            return Cast.toBoolean(util?.target?.isOriginal);
        }

        myId(args, util) {
            return util?.target?.id;
        }

        myArribute({ATTRIBUTE}, util) {
            return this.#getAttribute(util?.target?.id, ATTRIBUTE, util?.target);
        }

        itsArribute({ID, ATTRIBUTE}, util) {
            return this.#getAttribute(ID, ATTRIBUTE);
        }

        setIdAttribute({ID, ATTRIBUTE, OPERATOR, VALUE}) {
            this.#setAttribute(ID, ATTRIBUTE, OPERATOR, VALUE);
        }

        #getTargetVaribaleValue(target, VAR) {
            return target?.variables?.[VAR] ?? vm.runtime._stageTarget.variables?.[VAR] ?? "";
        }

        #setTargetVariableValue(target, VAR, OPERATOR, value) {
            const variable = this.#getTargetVaribaleValue(target, VAR);
            if (variable) variable.value = this.#calc(variable.value, OPERATOR, value);
        }

        myVariable({VAR}, util) {
            return this.#getTargetVaribaleValue(util.target, VAR)?.value;
        }

        itsVariable({ID, VAR}) {
            return this.#getTargetVaribaleValue(vm?.runtime?.getTargetById?.(ID), VAR)?.value;
        }

        setItsVariable({ID, VAR, OPERATOR, VALUE}) {
            this.#setTargetVariableValue(vm.runtime.getTargetById(ID), VAR, OPERATOR, VALUE);
        }

        myDollyArribute({DOLLY_ATTRIBUTE}, util) {
            return util?.target?.DollyPro?.extraData?.[DOLLY_ATTRIBUTE];
        }

        itsDollyArribute({ID, DOLLY_ATTRIBUTE}, util) {
            return vm.runtime?.getTargetById(ID)?.DollyPro?.extraData?.[DOLLY_ATTRIBUTE];
        }

        idExist({ID}) {
            return Cast.toBoolean(vm?.runtime?.getTargetById(ID));
        }

        spriteCloneList({SPRITE, ORIGIN}) { 
            return JSON.stringify(this.#cloneList(SPRITE, ORIGIN));
        }

        originId({SPRITE}) {
            if (SPRITE === vm.runtime._stageTarget.sprite.name) return vm.runtime._stageTarget.id;
            return vm?.runtime?.getSpriteTargetByName?.(SPRITE)?.id;
        }

        registerTemplate() {
            this.#registerData("TemplateNames", "要注册的模板", "请勿注册重复的模板 ", "[]");
        }

        cancelTemplate() {
            this.#cancelData("TemplateNames", "要注销的模板", "[]");
        }

        defineDataTemplate({NAME,X,Y,DIRECTION,ROTATIONSTYLE,SIZE,COSTUME,VISIABLE,BRIGHTNESS,GHOST,COLOR,FISHEYE,WHIRL,PIXELATE,MOSAIC}) {
            dataTemplate.set(NAME, {NAME,X,Y,DIRECTION,ROTATIONSTYLE,SIZE,COSTUME,VISIABLE,BRIGHTNESS,GHOST,COLOR,FISHEYE,WHIRL,PIXELATE,MOSAIC});
        }

        modifyDataTemplate({NAME, DATA, VALUE}) {
            if (!dataTemplate.has(NAME)) return;
            dataTemplate.get(NAME)[DATA] = VALUE;
        }

        deleteDataTemplate({NAME}) {
            dataTemplate.delete(NAME);
        }

        clearDataTemplate() {
            dataTemplate.clear();
        }

        cloneWithTemplate({SPRITE, NAME}) {
            if (!dataTemplate.has(NAME)) return;
            const target = vm.runtime.getSpriteTargetByName(SPRITE);
            const clone = target.makeClone();
            const template = dataTemplate.get(NAME);
            if (template) {
                // 这貌似有点多
                clone.setXY(template.X, template.Y);
                clone.setDirection(template.DIRECTION);
                clone.setRotationStyle(template.ROTATIONSTYLE);
                clone.setCostume(clone.getCostumeIndexByName(template.COSTUME));
                clone.setEffect("ghost", template.GHOST);
                clone.setEffect("brightness", template.BRIGHTNESS);
                clone.setEffect("fisheye", template.FISHEYE);
                clone.setEffect("color", template.COLOR);
                clone.setEffect("whirl", template.WHIRL);
                clone.setEffect("mosaic", template.MOSAIC);
                clone.setEffect("pixelate", template.PIXELATE);
                clone.setSize(template.SIZE);
                clone.setVisible(template.VISIABLE);
            }
            clone.goBehindOther(target);

            vm.runtime.addTarget(clone);
        }

        removeClone({ID}) {
            const target = vm.runtime.getTargetById(ID);
            if (!target || target.isOriginal) return;
            vm.runtime.disposeTarget(target);
            vm.runtime.stopForTarget(target);
        }

        latestCloneId() {
            return lastestCreated.id ?? "";
        }

        latestRemoveId() {
            return lastestRemoved.id ?? "";
        }

        whenTargetWasCreated() {return true;}
        whenTargetWasRemoved() {return true;}

        #setIdExtraData(ID, NAME, OPERATOR, VALUE) {
            if (!cloneExtraData.has(ID)) cloneExtraData.set(ID, {});
            const treeKey = cloneExtraData.get(ID);
            if (!Object.hasOwn(treeKey, NAME)) treeKey[NAME] = 0;

            treeKey[NAME] = this.#calc(treeKey[NAME], OPERATOR, VALUE);
        }

        #deleteIdExtraData(ID, NAME) {
            if (this.#IdHasExtraData(ID, NAME)) delete cloneExtraData.get(ID)[NAME];
        }

        #getIdExtraData(ID, NAME) {
            return cloneExtraData.get(ID)?.[NAME];
        }

        #IdHasExtraData(ID, NAME) {
            return cloneExtraData.has(ID) && Object.hasOwn(cloneExtraData.get(ID), NAME);
        }

        #ifIdExtraData(ID, NAME) {
            return Cast.toBoolean(this.#getIdExtraData(ID, NAME));
        }

        #ifIdExtraDataEqualsTo(ID, NAME, COMPARE, VALUE) {
            const myValue = this.#getIdExtraData(ID, NAME);
            return this.#compare(myValue, COMPARE, VALUE);
        }

        #repeat(ID, NAME, TIMES, OPERATOR, VALUE, INIT, util) {
            const times = Math.round(TIMES);

            if (typeof util.stackFrame.loopCounter === "undefined") {
                util.stackFrame.loopCounter = 0;
                if (typeof INIT === "number") this.#setIdExtraData(ID, NAME, "=", INIT);
            }

            if (util.stackFrame.loopCounter < times) {
                util.startBranch(1, true);
                util.stackFrame.loopCounter++;
                this.#setIdExtraData(ID, NAME, OPERATOR, VALUE);
            }
        }

        setExtraData({NAME, OPERATOR, VALUE}, util) {
            const ID = util.target.id;
            this.#setIdExtraData(ID, NAME, OPERATOR, VALUE);
        }

        deleteExtraData({NAME}, util) {
            const ID = util.target.id;
            this.#deleteIdExtraData(ID, NAME);
        }

        getExtraData({NAME}, util) {
            const ID = util.target.id;
            return this.#getIdExtraData(ID, NAME);
        }

        hasExtraData({NAME}, util) {
            const ID = util.target.id;
            return this.#IdHasExtraData(ID, NAME);
        }

        ifExtraData({NAME}, util) {
            const ID = util.target.id;
            return this.#ifIdExtraData(ID, NAME);
        }

        ifExtraDataEqualsTo({NAME, COMPARE, VALUE}, util) {
            const ID = util.target.id;
            return this.#ifIdExtraDataEqualsTo(ID, NAME, COMPARE, VALUE);
        }

        insExtraData({NAME, TIMES}, util) {
            this.#repeat(util.target.id, NAME, TIMES, "+=", 1, null, util);
        }

        repeatExtraData({NAME, TIMES, OPERATOR, VALUE, INIT}, util) {
            this.#repeat(util.target.id, NAME, TIMES, OPERATOR, VALUE, INIT, util);
        }

        idInsExtraData({ID, NAME, TIMES}, util) {
            this.#repeat(ID, NAME, TIMES, "+=", 1, null, util);
        }

        idRepeatExtraData({ID, NAME, TIMES, OPERATOR, VALUE, INIT}, util) {
            this.#repeat(ID, NAME, TIMES, OPERATOR, VALUE, INIT, util);
        }

        setIdExtraData({ID, NAME, OPERATOR, VALUE}) {
            this.#setIdExtraData(ID, NAME, OPERATOR, VALUE);
        }

        deleteIdExtraData({ID, NAME}) {
            this.#deleteIdExtraData(ID, NAME);
        }

        getIdExtraData({ID, NAME}) {
            return this.#getIdExtraData(ID, NAME);
        }

        IdHasExtraData({ID, NAME}) {
            return this.#IdHasExtraData(ID, NAME);
        }

        ifIdExtraData({ID, NAME}) {
            return this.#ifIdExtraData(ID, NAME);
        }

        ifIdExtraDataEqualsTo({ID, NAME, COMPARE, VALUE}, util) {
            return this.#ifIdExtraDataEqualsTo(ID, NAME, COMPARE, VALUE);
        }

        registerGroup() {
            this.#registerData("Groups", "要注册的组", "请勿注册重复的组 ", "[]");
        }

        cancelGroup() {
            this.#cancelData("Groups", "要注销的组", "[]");
        }

        createGroup({NAME}) {
            groups.set(NAME, new Set());
        }

        deleteGroup({NAME}) {
            groups.delete(NAME);
        }

        hasGroup({NAME}) {
            return groups.has(NAME);
        }

        joinGroup({NAME}, util) {
            const ID = util.target.id;
            groups.get(NAME)?.add?.(ID);
        }

        leaveGroup({NAME}, util) {
            const ID = util.target.id;
            groups.get(NAME)?.delete?.(ID);
        }

        inGroup({NAME}, util) {
            const ID = util.target.id;
            return Cast.toBoolean(groups.get(NAME)?.has?.(ID));
        }

        IdJoinGroup({ID, NAME}) {
            groups.get(NAME)?.add?.(ID);
        }

        IdLeaveGroup({ID, NAME}) {
            groups.get(NAME)?.delete?.(ID);
        }

        IdInGroup({ID, NAME}) {
            return groups.get(NAME)?.has?.(ID);
        }

        membersOfGroup({NAME}) {
            if (!groups.has(NAME)) return "[]";
            return JSON.stringify([...groups.get(NAME)])
        }

        sizeOfGroup({NAME}) {
            return groups.get(NAME)?.size ?? 0;
        }

        createHitbox({POLYGON}, util) {
            if (POLYGON instanceof Polygon) Hitboxes.set(this.myId(null, util), new Hitbox(POLYGON));
            else Hitboxes.set(this.myId(null, util), new Hitbox(new Polygon()));
        }

        createRectangle({X, Y, W, H}) {
            return Hitbox.rectangle(Cast.toNumber(X), Cast.toNumber(Y), Cast.toNumber(W), Cast.toNumber(H));
        }

        createRectHitbox({X, Y, W, H}, util) {
            Hitboxes.set(this.myId(null, util), Hitbox.rectBox(Cast.toNumber(X), Cast.toNumber(Y), Cast.toNumber(W), Cast.toNumber(H)));
        }

        setHitbox({NAME, POLYGON}, util) {
            if (!(POLYGON instanceof Polygon)) return;
            Hitboxes.get(util.target.id)?.setBox?.(NAME, POLYGON);
        }

        deleteHitbox({NAME}, util) {
            try {
                Hitboxes.get(util.target.id)?.deleteBox?.(NAME);
            } catch (e) {}
        }

        createTriangle({X0, Y0, X1, Y1, X2, Y2}) {
            return new Triangle(Cast.toNumber(X0), Cast.toNumber(Y0), Cast.toNumber(X1), Cast.toNumber(Y1), Cast.toNumber(X2), Cast.toNumber(Y2));
        }

        createPolygon({TRIANGLE}) {
            if (TRIANGLE instanceof Triangle) {
                return new Polygon(TRIANGLE);
            }
            return new Polygon();
        }

        appendForPolygon({POLYGON, TRIANGLE}) {
            return POLYGON?.append?.(TRIANGLE);
        }

        #idCollisionId(ID1, TYPE1, ID2, TYPE2, aabb = true) {
            if (!Hitboxes.has(ID1) || !Hitboxes.has(ID2)) return false;
            return Hitboxes.get(ID1)?.collision(TYPE1, Hitboxes.get(ID2), TYPE2, aabb);
        }

        #idcollisionGroup(ID1, TYPE1, GROUP, TYPE2, SAP) {
            if (!Hitboxes.has(ID1)) return false;
            const groupEntities = groups.get(GROUP);
            if (!groupEntities) return;
            if (SAP === "true") {
                for (const id of SAPSystem.getPotentialCollisions(ID1)) {
                    if (groupEntities.has(id)) {
                        // 自己不会是自己的潜在碰撞对
                        if (this.#idCollisionId(ID1, TYPE1, id, TYPE2, false)) return true;
                    }
                }
            } else {
                for (const id of groupEntities) {
                    if (id !== ID1) {
                        if (this.#idCollisionId(ID1, TYPE1, id, TYPE2)) return true;
                    }
                }
            }
            return false;
        }

        collisionTo({TYPE, ID}, util) {
            return this.#idCollisionId(util.target.id, TYPE, ID, TYPE);
        }

        idCollisionTo({ID, TYPE, TARGET}) {
            return this.#idCollisionId(ID, TYPE, TARGET, TYPE);
        }

        collisionGroup({TYPE, GROUP, SAP}, util) {
            return this.#idcollisionGroup(util.target.id, TYPE, GROUP, TYPE, SAP);
        }

        idCollisionGroup({ID, TYPE, GROUP, SAP}) {
            return this.#idcollisionGroup(ID, TYPE, GROUP, TYPE, SAP);
        }

        groupCollisionGroup({GROUP1, TYPE, GROUP2, SAP}) {
            const group1Entities = groups.get(GROUP1);
            const group2Entities = groups.get(GROUP2);
            if (!group1Entities || !group2Entities) return;
            for (const id1 of group1Entities) {
                if (this.#idcollisionGroup(id1, TYPE, group2Entities, TYPE, SAP));
            }
        }

        getMyHitbox(args, util) {
            return Hitboxes.get(util.target.id) ?? "";
        }

        getIdHitbox({ID}) {
            return Hitboxes.get(ID) ?? "";
        }

        getPolygonOfHitbox({NAME, HITBOX}) {
            return HITBOX?.getBox?.(NAME) ?? "";
        }

        getTriOfPolygon({INDEX, POLYGON}) {
            return POLYGON?.triangles?.[INDEX] ?? "";
        }

        serialize({GRAPHICS}) {
            return JSON.stringify(GRAPHICS?.serialize?.());
        }

        drawHitbox(args, util) {
            const myId = this.myId(null, util);
            const hitbox = Hitboxes.get(myId)?.getBox?.(args.NAME);

            if (!hitbox) return;

            const target = util.target;
            Pen.setPenColorToColor(target, args.COLOR);
            for (const tri of hitbox.triangles) {
                Pen.drawLine(target, tri.vertexes[0][0], tri.vertexes[0][1], tri.vertexes[1][0], tri.vertexes[1][1]);
                Pen.drawLine(target, tri.vertexes[2][0], tri.vertexes[2][1], tri.vertexes[1][0], tri.vertexes[1][1]);
                Pen.drawLine(target, tri.vertexes[2][0], tri.vertexes[2][1], tri.vertexes[0][0], tri.vertexes[0][1]);
            }
        }

        clear() {
            Pen.clear();
        }

        joinSAP(args, util) {
            const id = util.target.id;
            const bounding = Hitboxes.get(id)?.bounding;
            SAPSystem.addEntity(id, bounding?.left ?? 0, bounding?.top ?? 0, bounding?.right ?? 0, bounding?.bottom ?? 0);
        }

        leaveSAP(args, util) {
            SAPSystem.removeEntity(util.target.id);
        }

        moveInSAP(args, util) {
            const id = util.target.id;
            const bounding = Hitboxes.get(id)?.bounding;
            SAPSystem.moveEntity(id, bounding?.left ?? 0, bounding?.top ?? 0, bounding?.right ?? 0, bounding?.bottom ?? 0);
        }

        idJoinSAP({ID}) {
            const bounding = Hitboxes.get(ID)?.bounding;
            SAPSystem.addEntity(ID, bounding?.left ?? 0, bounding?.top ?? 0, bounding?.right ?? 0, bounding?.bottom ?? 0);
        }

        idLeaveSAP({ID}) {
            SAPSystem.removeEntity(ID);
        }

        idMoveInSAP({ID}) {
            const bounding = Hitboxes.get(ID)?.bounding;
            SAPSystem.moveEntity(ID, bounding?.left ?? 0, bounding?.top ?? 0, bounding?.right ?? 0, bounding?.bottom ?? 0);
        }

        updateSAP() {
            SAPSystem.update();
        }

        sendMessage({NAME, DATA, ID_FILTER, SPRITE_FILTER, GROUP_FILTER, ONLYORIGIN}, util) {
            let targets;

            if (ID_FILTER) {
                // 通过ID过滤了顶多一个实体
                const target = vm.runtime.getTargetById(ID_FILTER);
                if (!target?.isOriginal && ONLYORIGIN) return;  // id不是本体但是only origin就无合适目标，直接返回
                targets = target;
            } else {
                targets = vm.runtime.targets.filter(t => 
                    (!SPRITE_FILTER || t.sprite.name === SPRITE_FILTER) &&  // 如果有sprite_filter则检查是否匹配，否则放行
                    (!GROUP_FILTER || groups.get(GROUP_FILTER)?.has?.(t.id)) &&  // 如果有group_filter则检查是否匹配
                    (!ONLYORIGIN || t?.isOriginal)  // 不限制必须本体或者当前target是本体
                );
                if (targets.length < 1) return;
            }

            triggerHat(`${ext_id}_receiveMessage`, {NAME: NAME}, targets, {data: DATA, sender: util.target.id});
        }

        receiveMessage({NAME}, util) {return true;}

        transform({OFFSETX, OFFSETY, SCALE, ROTATE, FOLLOWCAM, CAMX, CAMY, CAMSCALE, CAMROTATE}, util) {
            Hitboxes.get(this.myId(null, util))?.translate?.(
                Cast.toNumber(OFFSETX), 
                Cast.toNumber(OFFSETY), 
                Cast.toNumber(SCALE) / 100, 
                90 - Cast.toNumber(ROTATE), 
                Cast.toBoolean(FOLLOWCAM), 
                Cast.toNumber(CAMX), 
                Cast.toNumber(CAMY), 
                Cast.toNumber(CAMSCALE), 
                90 - Cast.toNumber(CAMROTATE)
            );
        }

        transformWithoutData({FOLLOWCAM, CAMX, CAMY, CAMSCALE, CAMROTATE}, util) {
            const target = util.target;
            if (!target) return;
            Hitboxes.get(this.myId(null, util))?.translate?.(
                Cast.toNumber(target.x),
                Cast.toNumber(target.y), 
                Cast.toNumber(target.size) / 100, 
                90 - Cast.toNumber(target.direction), 
                Cast.toBoolean(FOLLOWCAM),
                Cast.toNumber(CAMX), 
                Cast.toNumber(CAMY), 
                Cast.toNumber(CAMSCALE),
                90 - Cast.toNumber(CAMROTATE)
            );
        }

        hatParam({VALUE}, util) {
            return util?.thread?.hatParam?.[VALUE];
        }

        setThreadVar({KEY, OPERATOR, VALUE}, util) {
            const thread = util.thread;
            if (!thread.cloneProData) thread.cloneProData = {};
            thread.cloneProData[KEY] = this.#calc(thread.cloneProData[KEY], OPERATOR, VALUE);
        }

        getThreadVar({KEY}, util) {
            return util.thread?.cloneProData?.[KEY];
        }

        registerErrorType() {
            this.#registerData("ErrorType", "要注册的错误类型", "不要重复注册相同的错误类型 ", ClonePro.defaultErrorTypes);
        }

        cancelErrorType() {
            this.#cancelData("ErrorType", "要注销的错误类型", ClonePro.defaultErrorTypes);
        }

        tryCatchFinally() {}
        throwScratchError() {}

        log({METHOD, PARAM}, util) {
            console[METHOD]?.(PARAM);
        }

        boolValue({VALUE}) {
            if (VALUE === "false") return false;
            return Cast.toBoolean(VALUE);
        }

        str({VALUE}) {
            return Cast.toString(VALUE);
        }

        nullValue() {
            return null;
        }

        typeofObject({VALUE}) {
            return Object.prototype.toString.call(VALUE).slice(7, -1);
        }

        authorURL() {
            window.open("https://www.ccw.site/student/65f8238ca65f1229b0d8c776");
        }

        ccwDocument() {
            window.open("https://learn.ccw.site/article/f29a698b-12eb-4073-b545-50030362c63e");
        }
    }

  Scratch.extensions.register(new ClonePro());
})(Scratch);
