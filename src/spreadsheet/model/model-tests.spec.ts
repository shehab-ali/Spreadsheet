import { EvaluateExpression, DecodeExcelCell } from "./FormulaFunctions";
import { SpreadSheet } from "./SpreadSheet";
import { Cell } from "./Cell";

describe("should evaluate basic arithmetic function", () => {
  it("should correctly evaluate basic arithmetic expressions", () => {
    const s = new SpreadSheet("s1", "0", []);
    const expression = "2 + 3 * 4 / 2 - 1";
    const variables = {};
    const result = EvaluateExpression(expression, variables, s.cells);
    expect(result).toBe('7');
  });

  it("should evaluate expressions with MIN", () => {
    const s = new SpreadSheet("s1", "0", []);
    const expression = "MIN(5, 10, 2)";
    const variables = {};
    const result = EvaluateExpression(expression, variables, s.cells);
    expect(result).toBe('2');
  });

  it("should evaluate expressions with MAX", () => {
    const s = new SpreadSheet("s1", "0", []);
    const expression = "MAX(5, 10, 2)";
    const variables = {};
    const result = EvaluateExpression(expression, variables, s.cells);
    expect(result).toBe('10');
  });

  it("should evaluate expressions with AVERAGE", () => {
    const s = new SpreadSheet("s1", "0", []);
    const expression = "AVERAGE(5, 10, 3)";
    const variables = {};
    const result = EvaluateExpression(expression, variables, s.cells);
    expect(result).toBe('6');
  });

  it("should evaluate expressions with COUNT", () => {
    const s = new SpreadSheet("s1", "0", []);
    const expression = "COUNT(5, 10, 2)";
    const variables = {};
    const result = EvaluateExpression(expression, variables, s.cells);
    expect(result).toBe('3');
  });

  it("should evaluate expressions with SUM", () => {
    const s = new SpreadSheet("s1", "0", []);
    const expression = "SUM(5, 10, 2)";
    const variables = {};
    const result = EvaluateExpression(expression, variables, s.cells);
    expect(result).toBe('17');
  });

  it("should evaluate expressions with CONCAT", () => {
    const s = new SpreadSheet("s1", "0", []);
    const expression = "CONCAT('Hello', ' ', 'World')";
    const variables = {};
    const result = EvaluateExpression(expression, variables, s.cells);
    expect(result).toBe("Hello World");
  });
  
  it("should evaluate cell references", () => {
    const s = new SpreadSheet("s1", "0", []);
    const c1 = new Cell("10", s);
    const c2 = new Cell("8",s);
    const c3 = new Cell("6",s);
    const c4 = new Cell("40",s);

    
    s.cells = [[c1, c2], 
                [c3, c4]];
    
    const variables: Record<string, number | string> = {};
    const expression = "A1 + B2";

    const result = EvaluateExpression(expression, variables, s.cells);
    expect(result).toBe("50");
  });

  it("should handle variables and their values correctly", () => {
    const expression = "x + y";
    const variables = { x: 10, y: 5 };
    const s = new SpreadSheet("s1", "0", []);
    const result = EvaluateExpression(expression, variables, s.cells);
    expect(result).toBe('15');
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
    const emptyCells: Cell[][] = [];
    for (let i = 0; i < 10; i++) {
      emptyCells.push(Array(10).fill(''));
    }
    const spreadsheet = new SpreadSheet("s1", "0", [], emptyCells);

    const cellA = new Cell("B1", spreadsheet);
    const cellB = new Cell("A1", spreadsheet);
    //const cellC = new Cell("A1", spreadsheet);

    spreadsheet.cells[0][0] = cellA; //A1
    spreadsheet.cells[0][1] = cellB; //B1
    //spreadsheet.cells[0][2] = cellC; //C1


    //expect(spreadsheet.getCellAddress(cellB)).toBe(true);
    expect(cellA.checkCellReference()).toBe(true);
  });

  it("should not detect cycles for non-cyclic references", () => {
    
    const emptyCells: Cell[][] = [];
    for (let i = 0; i < 10; i++) {
      emptyCells.push(Array(10).fill(undefined));
    }
    const spreadsheet = new SpreadSheet("s1", "0", [], emptyCells);
    const cellA = new Cell("", spreadsheet);
    const cellB = new Cell("", spreadsheet);
    const cellC = new Cell("", spreadsheet);

    cellA.setValue("10");
    cellB.setValue("C1");
    cellC.setValue("20");

    expect(cellA.checkCellReference()).toBe(false);
  });
  
  it("should add cell variables to list of vars", () => {
    
    const s = new SpreadSheet("s1", "0", []);
        
    const c1 = new Cell("10", s);
    const c2 = new Cell("8" , s);
    const c3 = new Cell("6" , s);
    const c4 = new Cell("40", s);

    s.cells = [[c1, c2], 
               [c3, c4]];

    const variables: Record<string, number | string> = {};
    const expression = "A1 + B2";

    const result = EvaluateExpression(expression, variables, s.cells);

    expect(result).toBe('50');
  });
});