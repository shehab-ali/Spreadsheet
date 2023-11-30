import { EvaluateExpression } from "./FormulaFunctions";
import { SpreadSheet } from "./SpreadSheet";
import { Cell } from "./Cell";
/*
describe("Cell function tests", () => {
    
    it("should detect cycles", () => {
      const emptyCells: Cell[][] = [];
      for (let i = 0; i < 10; i++) {
        emptyCells.push(Array(10).fill(''));
      }
      const spreadsheet = new SpreadSheet("s1", "0", [], emptyCells);
  
      const cellA = new Cell("B1", spreadsheet);
      const cellB = new Cell("A1", spreadsheet);
  
      spreadsheet.cells[0][0] = cellA; //A1
      spreadsheet.cells[0][1] = cellB; //B1
  
      //expect(spreadsheet.getCellAddress(cellB)).toBe(true);
      expect(cellA.checkCellReference()).toBe(true);
    });
  
    it("should not detect cycles for non-cyclic references", () => {
      
      const emptyCells: Cell[][] = [];
      for (let i = 0; i < 10; i++) {
        emptyCells.push(Array(10).fill(''));
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
});
*/
    describe('Cell Class Tests', () => {

        it('should correctly get the displayed value with getDisplayedValue() for basic arithmetic expressions', () => {
          const emptyCells: Cell[][] = [];
          for (let i = 0; i < 10; i++) {
            emptyCells.push(Array(10).fill(''));
          }
          const spreadsheet = new SpreadSheet("s1", "0", [], emptyCells);
          const cell = new Cell("", spreadsheet);

          const exp = '+2+3*4/2-1';
          cell.setValue(exp);
          expect(cell.getDisplayedValue()).toBe('7');
        });

        it('should correctly get the displayed value with getRawValue() for basic arithmetic expressions', () => {
            const emptyCells: Cell[][] = [];
            for (let i = 0; i < 10; i++) {
              emptyCells.push(Array(10).fill(''));
            }
            const spreadsheet = new SpreadSheet("s1", "0", [], emptyCells);
            const cell = new Cell("", spreadsheet);
  
            const exp = '+2+3*4/2-1';
          cell.setValue(exp);
            const displayedValue = cell.getRawValue();
            expect(displayedValue).toBe(exp);
          });



      /*
        it('should correctly get the displayed value with getDisplayedValue() for complex arithmetic expressions', () => {
          const expression = '10 + 5 * 2 / (7 - 4)';
          cell.setValue(`+${expression}`);
          const displayedValue = cell.getDisplayedValue();
          expect(displayedValue).toBe('11.66666666666666666667');
        });
      
        it('should correctly get the raw value with getRawValue() for expressions', () => {
          const expression = '8 / 2 * 3 - 1';
          cell.setValue(`+${expression}`);
          expect(cell.getRawValue()).toBe(`+${expression}`);
        });

        */
      });

    //setValue

    // displayvalue

    //raw value

    //cell address


