import { EvaluateExpression } from "./FormulaFunctions";
import { SpreadSheet } from "./SpreadSheet";
import { Cell } from "./Cell";

describe("should evaluate basic arithmetic function", () => {
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
    
        EvaluateExpression(expression, vars, s.cells);
    
        expect(s.getCellTOValue()).toBe({"A1": 10, "A2": 6, "B1": 8, "B2": 40});
      });
});