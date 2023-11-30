import { EvaluateExpression } from "./FormulaFunctions";
import { SpreadSheet } from "./SpreadSheet";
import { Cell } from "./Cell";

describe("should evaluate basic arithmetic function", () => {
  it("should correctly evaluate basic arithmetic expressions", () => {
    const s = new SpreadSheet("s1", "0", []);
    const expression = "2 + 3 * 4 / 2 - 1";
    const  vars: Record<string, number | string> = {};
    const result = EvaluateExpression(expression, vars, s.cells);
    expect(result).toBe('7');
  });

  it("should evaluate expressions with MIN", () => {
    const s = new SpreadSheet("s1", "0", []);
    const expression = "MIN(5, 10, 2)";
    const  vars: Record<string, number | string> = {};
    const result = EvaluateExpression(expression, vars, s.cells);
    expect(result).toBe('2');
  });

  it("should evaluate expressions with MAX", () => {
    const s = new SpreadSheet("s1", "0", []);
    const expression = "MAX(5, 10, 2)";
    const  vars: Record<string, number | string> = {};
    const result = EvaluateExpression(expression, vars, s.cells);
    expect(result).toBe('10');
  });

  it("should evaluate expressions with AVERAGE", () => {
    const s = new SpreadSheet("s1", "0", []);
    const expression = "AVERAGE(5, 10, 3)";
    const  vars: Record<string, number | string> = {};
    const result = EvaluateExpression(expression, vars, s.cells);
    expect(result).toBe('6');
  });

  it("should evaluate expressions with COUNT", () => {
    const s = new SpreadSheet("s1", "0", []);
    const expression = "COUNT(5, 10, 2)";
    const  vars: Record<string, number | string> = {};
    const result = EvaluateExpression(expression, vars, s.cells);
    expect(result).toBe('3');
  });

  it("should evaluate expressions with SUM", () => {
    const s = new SpreadSheet("s1", "0", []);
    const expression = "SUM(5, 10, 2)";
    const  vars: Record<string, number | string> = {};
    const result = EvaluateExpression(expression, vars,s.cells);
    expect(result).toBe('17');
  });

  it("should evaluate expressions with CONCAT", () => {
    const s = new SpreadSheet("s1", "0", []);
    const expression = "CONCAT('Hello', ' ', 'World')";
    const  vars: Record<string, number | string> = {};
    const result = EvaluateExpression(expression, vars, s.cells);
    expect(result).toBe("Hello World");
  });
  
  it("should evaluate cell references", () => {
    const s = new SpreadSheet("s1", "0", []);
    const c1 = new Cell("10", s);
    const c2 = new Cell("8",s);
    const c3 = new Cell("6",s);
    const c4 = new Cell("40",s);

    const  vars: Record<string, number | string> = {};
    s.cells = [[c1, c2], 
                [c3, c4]];
    
    const expression = "A1 + B2";
    
    const result = EvaluateExpression(expression, vars, s.cells);
    expect(result).toBe("50");
  });


  it("should throw an error for invalid expressions", () => {
    const expression = "2 *"; // Invalid expression
    const s = new SpreadSheet("s1", "0", []);
    expect(() => {
      const  vars: Record<string, number | string> = {};
      EvaluateExpression(expression, vars, s.cells);
    }).toThrowError();
  });

/*
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
*/

  
  it("Should evaluate correctly with cell reference", () => {
    
    const s = new SpreadSheet("s1", "0", []);
        
    const c1 = new Cell("10", s);
    const c2 = new Cell("8" , s);
    const c3 = new Cell("6" , s);
    const c4 = new Cell("40", s);

    s.cells = [[c1, c2], 
               [c3, c4]];

    const expression = "A1 + B2";
    const  vars: Record<string, number | string> = {};

    const result = EvaluateExpression(expression, vars, s.cells);

    expect(result).toBe('50');
  });

  it("Should evaluate correctly with cell reference and keyword", () => {
    
    const s = new SpreadSheet("s1", "0", []);
        
    const c1 = new Cell("Hello", s);
    const c2 = new Cell("Hi" , s);
    const c3 = new Cell("World" , s);
    const c4 = new Cell(".", s);


    s.cells = [[c1, c2], 
               [c3, c4]];

    const exp = "CONCAT('A2',' ','A1', ' ', 'B1', 'B2')";
    const  vars: Record<string, number | string> = {};
    
    const result = EvaluateExpression(exp, vars, s.cells);

    expect(result).toBe("Hi Hello World.");
  });
});