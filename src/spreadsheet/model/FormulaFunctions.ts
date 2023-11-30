import { Cell } from "./Cell";
import { SpreadSheet } from "./SpreadSheet";

export function EvaluateExpression(
  expression: string,
  variables: Record<string, number | string>,
): string {
  // Replace function names with their JavaScript counterparts
  expression = expression.replace(/MIN/g, "Math.min");
  expression = expression.replace(/MAX/g, "Math.max");
  expression = expression.replace(/AVERAGE/g, "average");
  expression = expression.replace(/COUNT/g, "count");
  expression = expression.replace(/SUM/g, "sum");
  expression = expression.replace(
    /CONCAT\((.+?)\)/g,
    (_, args) => `concat(${args})`
  );
  

  // Replace variables with their values
  expression = expression.replace(/[A-Za-z]\w*/g, (match) => {
        const variableValue = variables[match];
    return variableValue !== undefined ? variableValue.toString() : match;
  });

  // Evaluate the expression
  const result = eval(expression);

  return String(result);
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
  return values.join("");
}

// Example on how it would be used
// const exampleString = 'MIN(A6, X7, 3, AVERAGE(2, 4), 1 + 2, 3 * 2, 5 / 7, COUNT(1, 2, 3), SUM(2, 4, 6))';
// const variables = { A6: 10, X7: 5 }; // in the future, we want to use {A6: getDisplayedValue(A6)}
// const result = evaluateExpression(exampleString, variables);
