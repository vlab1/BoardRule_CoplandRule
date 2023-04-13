function generateRandomNumber(n: number, m: number): number {
    if (n >= m) {
        throw new Error('n должно быть меньше m');
    }

    const range = m - n + 1;

    const randomNumber = Math.floor(Math.random() * range) + n;

    return randomNumber;
}
export default generateRandomNumber;
