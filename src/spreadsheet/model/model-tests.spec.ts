import { EvaluateExpression, DecodeExcelCell } from "./FormulaFunctions";
import { SpreadSheet } from "./SpreadSheet";
import { Cell } from "./Cell";

describe("should evaluate basic arithmetic function", () => {
  it("should correctly evaluate basic arithmetic expressions", () => {
    const s = new SpreadSheet("s1", "0", []);
    const expression = "2 + 3 * 4 / 2 - 1";
    const variables = {};
    const result = EvaluateExpression(expression, variables, s.cells);
    expect(result).toBe(9);
  });

  it("should evaluate expressions with functions", () => {
    const s = new SpreadSheet("s1", "0", []);
    const expression = "MIN(5, 10, 2)";
    const variables = {};
    const result = EvaluateExpression(expression, variables, s.cells);
    expect(result).toBe(2);
  });

  it("should evaluate expressions with MAX", () => {
    const s = new SpreadSheet("s1", "0", []);
    const expression = "MAX(5, 10, 2)";
    const variables = {};
    const result = EvaluateExpression(expression, variables, s.cells);
    expect(result).toBe(10);
  });

  it("should evaluate expressions with AVERAGE", () => {
    const s = new SpreadSheet("s1", "0", []);
    const expression = "AVERAGE(5, 10, 3)";
    const variables = {};
    const result = EvaluateExpression(expression, variables, s.cells);
    expect(result).toBe(6);
  });

  it("should evaluate expressions with COUNT", () => {
    const s = new SpreadSheet("s1", "0", []);
    const expression = "COUNT(5, 10, 2)";
    const variables = {};
    const result = EvaluateExpression(expression, variables, s.cells);
    expect(result).toBe(3);
  });

  it("should evaluate expressions with SUM", () => {
    const s = new SpreadSheet("s1", "0", []);
    const expression = "SUM(5, 10, 2)";
    const variables = {};
    const result = EvaluateExpression(expression, variables, s.cells);
    expect(result).toBe(17);
  });

  it("should evaluate expressions with CONCAT", () => {
    const s = new SpreadSheet("s1", "0", []);
    const expression = "CONCAT('Hello', ' ', 'World')";
    const variables = {};
    const result = EvaluateExpression(expression, variables, s.cells);
    expect(result).toBe("Hello World");
  });

  it("should handle variables and their values correctly", () => {
    const expression = "x + y";
    const variables = { x: 10, y: 5 };
    const s = new SpreadSheet("s1", "0", []);
    const result = EvaluateExpression(expression, variables, s.cells);
    expect(result).toBe(15);
  });

  it("should throw an error for invalid expressions", () => {
    const expression = "2 *"; // Invalid expression
    const variables = {};
    const s = new SpreadSheet("s1", "0", []);
    expect(() => {
      EvaluateExpression(expression, variables, s.cells);
    }).toThrowError();
  });
});

describe("DecodeExcelCell function", () => {
  it("should correctly decode Excel cell references", () => {
    const cellRef1 = "A1";
    const cellRef2 = "Z2";
    const cellRef3 = "AA1";
    expect(DecodeExcelCell(cellRef1)).toEqual({ row: 1, column: 1 });
    expect(DecodeExcelCell(cellRef2)).toEqual({ row: 2, column: 26 });
    expect(DecodeExcelCell(cellRef3)).toEqual({ row: 1, column: 27 });
  });

  // will eventually be switched to be an error message sent to react
  it("should throw an error for invalid cell references", () => {
    const invalidCellRef = "A";
    expect(() => {
      DecodeExcelCell(invalidCellRef);
    }).toThrowError("Invalid cell reference format");
  });
});

describe("Cell", () => {
  it("should detect cycles", () => {
    const spreadsheet = new SpreadSheet("s1", "0", []);
    const cellA = new Cell("", spreadsheet);
    const cellB = new Cell("", spreadsheet);
    const cellC = new Cell("", spreadsheet);

    cellA.setValue("=B1");
    cellB.setValue("=C1");
    cellC.setValue("=A1");

    const hasCycles = cellA.detectCycles();
    expect(hasCycles).toBe(true);
  });

  it("should not detect cycles for non-cyclic references", () => {
    const spreadsheet = new SpreadSheet("s1", "0", []);
    const cellA = new Cell("", spreadsheet);
    const cellB = new Cell("", spreadsheet);
    const cellC = new Cell("", spreadsheet);

    cellA.setValue("=10");
    cellB.setValue("=C1");
    cellC.setValue("=20");

    const hasCycles = cellA.detectCycles();
    expect(hasCycles).toBe(false);
  });
});
