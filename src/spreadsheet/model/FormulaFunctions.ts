import { Cell } from "./Cell";
export function EvaluateExpression(expression: string, variables: Record<string, number | string>, cells: Cell[][]): number {
  // Replace function names with their JavaScript counterparts
  expression = expression.replace(/MIN/g, 'Math.min');
  expression = expression.replace(/MAX/g, 'Math.max');
  expression = expression.replace(/AVERAGE/g, 'average');
  expression = expression.replace(/COUNT/g, 'count');
  expression = expression.replace(/SUM/g, 'sum');
  expression = expression.replace(/CONCAT\((.+?)\)/g, (_, args) => `concat(${args})`);

  // Replace variables with their values
  expression = expression.replace(/[A-Za-z]\w*/g, (match) => {
    const variableValue = variables[match];
    return variableValue !== undefined ? variableValue.toString() : match;
  });

  // Evaluate the expression
  const result = eval(expression);

  return result;
}

export function DecodeExcelCell(cellReference: string): { row: number, column: number } {
  const regex = /([A-Z]+)(\d+)/;
  const match = cellReference.match(regex);

  if (!match) {
      throw new Error("Invalid cell reference format");
  }

  const columnString = match[1];
  const rowString = match[2];

  // Convert column letters to column number
  let column = 0;
  for (let i = 0; i < columnString.length; i++) {
      const charCode = columnString.charCodeAt(i) - 'A'.charCodeAt(0) + 1;
      column = column * 26 + charCode;
  }

  const row = parseInt(rowString, 10);

  return { row, column };
  // Examples
  // console.log(decodeExcelCell("A1"));  // Output: { row: 1, column: 1 }
  // console.log(decodeExcelCell("Z2"));  // Output: { row: 2, column: 26 }
  // console.log(decodeExcelCell("AA1")); // Output: { row: 1, column: 27 }
}

function average(...numbers: number[]): number {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
}

function count(...items: any[]): number {
  return items.length;
}

function sum(...numbers: number[]): number {
  return numbers.reduce((acc, num) => acc + num, 0);
}

function concat(...values: any[]): string {
  return values.join('');
}

// Example on how it would be used
// const exampleString = 'MIN(A6, X7, 3, AVERAGE(2, 4), 1 + 2, 3 * 2, 5 / 7, COUNT(1, 2, 3), SUM(2, 4, 6))';
// const variables = { A6: 10, X7: 5 }; // in the future, we want to use {A6: getDisplayedValue(A6)}
// const result = evaluateExpression(exampleString, variables);
