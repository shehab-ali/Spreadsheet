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
  
  it("Should evaluate correctly if a reference is changed after", () => {
    
    const s = new SpreadSheet("s1", "0", [],5,5);
    const expression = "+A1 + B2";   

    s.addCell(0,0,'10');
    s.addCell(1,1,'40');
    s.addCell(2,2, expression);
    //expect(s.setCellValue(s.getCell(1,1),'+100')).toBe(true);
 
    expect(s.getCell(2,2).getDisplayedValue()).toBe('110');

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

  //...

});  

describe('Tests for row and column manipulations', () => {
  it('should insert a row at the beginning of the spreadsheet', () => {
    const s = new SpreadSheet('s1', '0', [], 5, 5);
    const initialRows = s.getNumRows();
    s.addCell(0,2,'8');

    s.insertRow(0);

    expect(s.getNumRows()).toBe(initialRows + 1);
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
