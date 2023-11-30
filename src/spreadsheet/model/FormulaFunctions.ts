import { Cell } from "./Cell";
import { SpreadSheet } from "./SpreadSheet";

export function EvaluateExpression(
  expression: string,
  variables: Record<string, number | string>,
  address: string,
): [string, string[], boolean] {
  // Replace function names with their JavaScript counterparts
  expression = expression.replace(/MIN/g, "Math.min");
  expression = expression.replace(/MAX/g, "Math.max");
  expression = expression.replace(/AVERAGE/g, "average");
  expression = expression.replace(/COUNT/g, "count");
  expression = expression.replace(/SUM/g, "sum");
  expression = expression.replace(
    /CONCAT\((.+?)\)/gi,
    (_, args) => `concat(${args.replace(/CONCAT/gi, 'concat')})`
  );
   
  const refList: string[] = [];
  // Iterate through variables and check if their value contains the address
  for (const [key, value] of Object.entries(variables)) {
    if (typeof value === 'string' && value.includes(address)) {
      refList.push(key); // Add the variable key to refList if value contains the address
    }
  }

  // Replace variables with their values
  expression = expression.replace(/[A-Za-z]\w*/g, (match) => {
    const variableValue = variables[match];
    return variableValue !== undefined ? variableValue.toString() : match;
  });
  
  const concatRegex = /concat\(([^)]+)\)/gi;

  let match;
  let concatOccurred = false; // Variable to track if concat occurred
  while ((match = concatRegex.exec(expression)) !== null) {
    const args = match[1];
    const concatResult = concat(...args.split(',').map((arg: string) => arg.trim()));
    expression = expression.replace(match[0], `${concatResult}`);
    concatOccurred = true; // Update flag if concat occurred
  }

  try {
    // Attempt to evaluate the expression
    const result = eval(expression);
    return [String(result), refList, false];

  } catch (error) {
    if (concatOccurred) {
      // If catching string 
      // If an error occurs during evaluation, return the original expression and throw flag
      return [expression, refList, false];
    } else {
      // Re-throw other types of errors
      // If an error occurs during evaluation, return the original expression and throw flag
    return [expression, refList, true];
    }

    
    
  }
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
  return values.flat().map(value => String(value)).join("");
}
