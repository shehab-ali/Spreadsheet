export const FormulaFunctions: { [key: string]: (numbers: number[]) => number } = {
    '+': (numbers) => numbers.reduce((a, b) => a + b, 0),
    '-': (numbers) => numbers.reduce((a, b) => a - b),
    '*': (numbers) => numbers.reduce((a, b) => a * b, 1),
    '/': (numbers) => {
      if (numbers.length < 2 || numbers[1] === 0) {
       return 99999999999999;
      }
      return numbers.reduce((a, b) => a / b);
    },
    'SUM': (numbers) => numbers.reduce((a, b) => a + b, 0),
    'AVERAGE': (numbers) => {
      if (numbers.length === 0) return 0;
      return numbers.reduce((a, b) => a + b) / numbers.length;
    },
    'COUNT': (numbers) => numbers.length,
    'MIN': (numbers) => Math.min(...numbers),
    'MAX': (numbers) => Math.max(...numbers),
};