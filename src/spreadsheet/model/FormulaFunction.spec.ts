import { EvaluateExpression } from "./FormulaFunctions";
import { SpreadSheet } from "./SpreadSheet";
import { Cell } from "./Cell";

describe("should evaluate basic arithmetic function", () => {
  it("should correctly evaluate basic arithmetic expressions", () => {
    const s = new SpreadSheet("s1", "0", [],5,5);
    const expression = "+2 + 3 * 4 / 2 - 1";
    const cell = s.addCell(0,0,expression);
    expect(cell.getRawValue()).toBe(expression);
    expect(cell.getDisplayedValue()).toBe('7');
  });

  it("Should evaluate correctly with cell reference", () => {
    
    const s = new SpreadSheet("s1", "0", [],5,5);
    const expression = "+A1 + B2";    

    s.addCell(0,0,'10');
    s.addCell(0,1,'8');
    s.addCell(1,0,'3');
    s.addCell(1,1,'40');
    const c5 = s.addCell(1,2, expression);
 
    expect(c5.getDisplayedValue()).toBe('50');
  });

  it("Should evaluate sting with cell reference", () => {
    
    const s = new SpreadSheet("s1", "0", [],5,5);   

    const cell = s.addCell(0,0,'hi');
 
    expect(cell.getDisplayedValue()).toBe('hi');
  });

  it("Should evaluate correctly with nested cell references", () => {
    
    const s = new SpreadSheet("s1", "0", [],5,5);
    const expression = "+A1 + B2";  
    const expression2 = "+A1 + C3";   

    s.addCell(0,0,'10');
    s.addCell(1,1,'40');
    const cell1 = s.addCell(2,2, expression);
    const cell2 = s.addCell(1,2, expression2)
 
    expect(cell1.getDisplayedValue()).toBe('50');
    expect(cell2.getDisplayedValue()).toBe('60');
  });
  
  it("Should evaluate correctly if a reference is changed after with set", () => {
    
    const s = new SpreadSheet("s1", "0", [],5,5);
    const expression = "+A1 + B2";   

    const cell = s.addCell(0,0,'10');
    s.addCell(1,1,'40');
    s.addCell(2,2, expression);
    s.setCellValue(cell, '100')
 
    expect(s.getCell(2,2).getDisplayedValue()).toBe('140');

  });

  it("should evaluate expressions with MIN", () => {
    const s = new SpreadSheet("s1", "0", [],5,5);
    const expression = "+MIN(2,3,5,1,-4)";
    const cell = s.addCell(0,0,expression);
    expect(cell.getRawValue()).toBe(expression);
    expect(cell.getDisplayedValue()).toBe('-4');
  
  });

  it("should evaluate expressions with MAX", () => {
    const s = new SpreadSheet("s1", "0", [],5,5);
    const expression = "+MAX(2,3,5,1,-4)";
    const cell = s.addCell(0,0,expression);
    expect(cell.getRawValue()).toBe(expression);
    expect(cell.getDisplayedValue()).toBe('5');
  });

  it("should evaluate expressions with AVERAGE", () => {
    const s = new SpreadSheet("s1", "0", [],5,5);
    const expression = "+AVERAGE(2,3,5,1,-4)";
    const cell = s.addCell(0,0,expression);
    expect(cell.getRawValue()).toBe(expression);
    expect(cell.getDisplayedValue()).toBe('1.4');
  });

  it("should evaluate expressions with COUNT", () => {
    const s = new SpreadSheet("s1", "0", [],5,5);
    const expression = "+COUNT(2,3,5,1,-4)";
    const cell = s.addCell(0,0,expression);
    expect(cell.getRawValue()).toBe(expression);
    expect(cell.getDisplayedValue()).toBe('5');
  });

  it("should evaluate expressions with SUM", () => {
    const s = new SpreadSheet("s1", "0", [],5,5);
    const expression = "+SUM(2,3,5,1,-4)";
    const cell = s.addCell(0,0,expression);
    expect(cell.getRawValue()).toBe(expression);
    expect(cell.getDisplayedValue()).toBe('7');
    expect(cell.checkError()).toBe(false);
  });

  it("should evaluate expressions with SUM and cell refs", () => {
    const s = new SpreadSheet("s1", "0", [],5,5);
    const expression = "+SUM(A1,B1,A2,B2)";

    s.addCell(0,0,'2');
    s.addCell(0,1,'4');
    s.addCell(1,0,'6');
    s.addCell(1,1,'8');

    s.setCellValue(s.getCell(3,3), expression);

    const cell = s.getCell(3,3);
    expect(cell.getRawValue()).toBe(expression);
    expect(cell.getDisplayedValue()).toBe('20');
    expect(cell.checkError()).toBe(false); 
  });

  it("should evaluate expressions with SUM and cell refs alt", () => {
    const s = new SpreadSheet("sheet1", "0", [],5,5);
    const expression = "+SUM(B1,C1)";

    s.addCell(0,1,'2');
    s.addCell(0,2,'8');

    s.setCellValue(s.getCell(4,4), expression);

    const cell = s.getCell(4,4);
    expect(cell.getRawValue()).toBe(expression);
    expect(cell.getDisplayedValue()).toBe('10');
    expect(cell.checkError()).toBe(false); 
  });

  //...

});  

describe('Tests for row and column manipulations', () => {
  it('should insert a row at the beginning of the spreadsheet', () => {
    const s = new SpreadSheet('s1', '0', [], 5, 5);
    const initialRows = s.rows;
    s.addCell(0,2,'8');

    s.insertRow(0);

    expect(s.rows).toBe(initialRows + 1);



    // Assuming default cell values are empty strings
    for (let i = 0; i < s.getNumCols(); i++) {
      expect(s.getCell(0, i).getDisplayedValue()).toBe('');
    }
    expect(s.getCell(1,2).getDisplayedValue()).toBe('8');
  });

  it('should insert a row in the middle of the spreadsheet', () => {
    const s = new SpreadSheet('s1', '0', [], 5, 5);
    s.addCell(2,1,'8');
    const initialRows = s.getNumRows();

    s.insertRow(2);

    expect(s.getNumRows()).toBe(initialRows + 1);
    // Assuming default cell values are empty strings
    for (let i = 0; i < s.getNumCols(); i++) {
      expect(s.getCell(2, i).getDisplayedValue()).toBe('');
    }
    expect(s.getCell(3,1).getDisplayedValue()).toBe('8');
  });

  it('should insert a row at the end of the spreadsheet', () => {
    const s = new SpreadSheet('s1', '0', [], 5, 5);
    const initialRows = s.getNumRows();

    s.insertRow(initialRows);

    expect(s.getNumRows()).toBe(initialRows + 1);
    // Assuming default cell values are empty strings
    for (let i = 0; i < s.getNumCols(); i++) {
      expect(s.getCell(initialRows, i).getDisplayedValue()).toBe('');
    }
  });

  it('should insert a column at the beginning of the spreadsheet', () => {
    const s = new SpreadSheet('s1', '0', [], 5, 5);
    const initialCols = s.getNumCols();
    s.addCell(1,0,'4');
    s.insertCol(0);

    expect(s.getNumCols()).toBe(initialCols + 1);
    // Assuming default cell values are empty strings
    for (let i = 0; i < s.getNumRows(); i++) {
      expect(s.getCell(i, 0).getDisplayedValue()).toBe('');
    }

    expect(s.getCell(1, 1).getDisplayedValue()).toBe('4');
  });

  it('should insert a column in the middle of the spreadsheet', () => {
    const s = new SpreadSheet('s1', '0', [], 5, 5);
    const initialCols = s.getNumCols();
    s.addCell(1,2,'4');

    s.insertCol(2);

    expect(s.getNumCols()).toBe(initialCols + 1);
    // Assuming default cell values are empty strings
    for (let i = 0; i < s.getNumRows(); i++) {
      expect(s.getCell(i, 2).getDisplayedValue()).toBe('');
    }

    expect(s.getCell(1, 3).getDisplayedValue()).toBe('4');
  });

  it('should insert a column at the end of the spreadsheet', () => {
    const s = new SpreadSheet('s1', '0', [], 5, 5);
    const initialCols = s.getNumCols();

    s.insertCol(initialCols);

    expect(s.getNumCols()).toBe(initialCols + 1);
    // Assuming default cell values are empty strings
    for (let i = 0; i < s.getNumRows(); i++) {
      expect(s.getCell(i, initialCols).getDisplayedValue()).toBe('');
    }
  });

  it('should delete a row at the beginning of the spreadsheet', () => {
    const s = new SpreadSheet('s1', '0', [], 5, 5);
    const initialRows = s.getNumRows();
    s.addCell(1,1,'4');

    s.deleteRow(0);

    expect(s.getNumRows()).toBe(initialRows - 1);
    // Ensure that the first row after deletion is the originally second row
    expect(s.getCell(0, 1).getDisplayedValue()).toBe('4');
  });

  it('should delete a row in the middle of the spreadsheet', () => {
    const s = new SpreadSheet('s1', '0', [], 5, 5);
    const initialRows = s.getNumRows();
    s.addCell(4,4,'8');
    s.deleteRow(2);

    expect(s.getNumRows()).toBe(initialRows - 1);
    // Ensure that the third row after deletion is the originally fourth row
    expect(s.getCell(3, 4).getDisplayedValue()).toBe('8');
  });

  it('should delete a row at the end of the spreadsheet', () => {
    const s = new SpreadSheet('s1', '0', [], 5, 5);
    const initialRows = s.getNumRows();

    s.deleteRow(initialRows - 1);

    expect(s.getNumRows()).toBe(initialRows - 1);
    // Assuming default cell values are empty strings
    for (let i = 0; i < s.getNumCols(); i++) {
      expect(s.getCell(initialRows - 2, i).getDisplayedValue()).toBe('');
    }
  });

});

describe("should return raw value and toggle error flg if invalid", () => {
  
  it("should not throw error flag with valid exp", () => {
    const s = new SpreadSheet("s1", "0", [],5,5);
    const expression = "+AVERAGE(2,3,5,1,-4) - SUM(3,2) * COUNT(1,2,3,4) / MIN(MAX(1,1,1))";
    const cell = s.addCell(0,0,expression);
    expect(cell.getDisplayedValue()).toBe('-18.6');
    expect(cell.checkError()).toBe(false);
  });

  it("should throw error flag and return raw with invalid expression", () => {
    const s = new SpreadSheet("s1", "0", [],5,5);
    const expression = "+AVERAGE(2,3,5,1,-4) - ";
    const cell = s.addCell(0,0,expression);
    expect(cell.getDisplayedValue()).toBe('average(2,3,5,1,-4) - ');
    expect(cell.checkError()).toBe(true);
  });

  it("Should evaluate correctly with CONCAT", () => {
    
    const s = new SpreadSheet("s1", "0", [],5,5);
    const expression = "+CONCAT(A1,B1)";   

    s.addCell(0,0,'App');
    s.addCell(0,1,'Cat');
    const cell = s.addCell(2,2, expression);
 
    expect(cell.getDisplayedValue()).toBe('AppCat');
    expect(cell.checkError()).toBe(false);
  });

  it("should throw error flag and return raw with incorrect syntax", () => {
    const s = new SpreadSheet("s1", "0", [], 5, 5);
    const expression = "+SUM(2, 3, * 5, 1, -4)";
    const cell = s.addCell(0, 0, expression);
    expect(cell.getDisplayedValue()).toBe('sum(2, 3, * 5, 1, -4)');
    expect(cell.checkError()).toBe(true);
  });

  it("should throw error flag and return raw with circular reference", () => {
    const s = new SpreadSheet("s1", "0", [], 5, 5);
    const cell = s.addCell(1,1,"10");
    s.addCell(0,0,'+40-B2')
    s.setCellValue(cell, '+3+A1');
    
    expect(cell.checkError()).toBe(true);
  });

    it("should throw error flag and return raw with invalid operator", () => {
      const s = new SpreadSheet("s1", "0", [], 5, 5);
      const expression = "+SUM(2, 3) ++ 5";
      const cell = s.addCell(0, 0, expression);
      expect(cell.getDisplayedValue()).toBe('sum(2, 3) ++ 5');
      expect(cell.checkError()).toBe(true);
    });
  
    it("should throw error flag and return raw with missing parentheses", () => {
      const s = new SpreadSheet("s1", "0", [], 5, 5);
      const expression = "+SUM(2, 3";
      const cell = s.addCell(0, 0, expression);
      expect(cell.getDisplayedValue()).toBe('sum(2, 3');
      expect(cell.checkError()).toBe(true);
    });
  
    it("should throw error flag and return raw with unrecognized function", () => {
      const s = new SpreadSheet("s1", "0", [], 5, 5);
      const expression = "+INVALIDFUNC(2, 3)";
      const cell = s.addCell(0, 0, expression);
      expect(cell.getDisplayedValue()).toBe('INVALIDFUNC(2, 3)');
      expect(cell.checkError()).toBe(true);
    });

    it("should throw error flag for out-of-range reference", () => {
      const s = new SpreadSheet("s1", "0", [], 2, 2);
      const expression = "+C3 + D4"; // Out-of-range reference
      const cell = s.addCell(0, 0, expression);
      expect(cell.getDisplayedValue()).toBe('C3 + D4');
      expect(cell.checkError()).toBe(true);
    });

    it("should throw error flag for function type errors", () => {
      const s = new SpreadSheet("s1", "0", [], 5, 5);
      const expression = "+COUNT(1, 2, abc)"; // Invalid argument
      const cell = s.addCell(0, 0, expression);
      expect(cell.getDisplayedValue()).toBe('count(1, 2, abc)');
      expect(cell.checkError()).toBe(true);
    });
 

});