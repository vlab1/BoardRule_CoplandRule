"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateRandomNumber(n, m) {
    if (n >= m) {
        throw new Error('n должно быть меньше m');
    }
    const range = m - n + 1;
    const randomNumber = Math.floor(Math.random() * range) + n;
    return randomNumber;
}
exports.default = generateRandomNumber;
