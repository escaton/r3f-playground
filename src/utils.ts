type RGBFunc = (x: number, y: number, t: number) => number;

export const R: RGBFunc = function (x, y, t) {
    return Math.floor(192 + 64 * Math.cos((x * x - y * y) / 300 + t));
};

export const G: RGBFunc = function (x, y, t) {
    return Math.floor(
        192 +
            64 *
                Math.sin(
                    (x * x * Math.cos(t / 4) + y * y * Math.sin(t / 3)) / 300
                )
    );
};

export const B: RGBFunc = function (x, y, t) {
    return Math.floor(
        192 +
            64 *
                Math.sin(
                    5 * Math.sin(t / 9) +
                        ((x - 100) * (x - 100) + (y - 100) * (y - 100)) / 1100
                )
    );
};
