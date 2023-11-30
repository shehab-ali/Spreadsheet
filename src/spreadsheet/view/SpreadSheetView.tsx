import { Component, useState, useEffect } from "react";
import { SpreadSheet } from "../model/SpreadSheet";
import "/node_modules/bootstrap/dist/css/bootstrap.min.css";
import { FaSave } from "react-icons/fa";
import "./styles/SpreadSheetStyle.css";
import "./styles/FileSystemStyle.css";
import db from "../db";
import { useNavigate, useParams } from "react-router-dom";
import { Cell } from "../model/Cell";
import { DropdownButton, Dropdown, Button } from "react-bootstrap";
import { IoIosArrowBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { pb } from "../../App";
import { start } from "repl";
import { RecordModel } from "pocketbase";


export const SpreadsheetView = () => {
  let { sheetId } = useParams();
  const navigate = useNavigate();
  const { userId } = useSelector((state: RootState) => state.loginUser);

  const [cells, setCells] = useState<string[][]>([]);
  const [spreadsheet, setSpreadsheet] = useState<SpreadSheet>();

  const [countdown, setCountdown] = useState(2);
  const [isChanging, setIsChanging] = useState(false);

  // const setCellsFromDb = (
  //   model: SpreadSheet
  // ) => {
  //   const cellObjs = stringToSpreadSheet(spreadsheet.cells);
  //   if (model) {
  //     model.setCells(cellObjs.map((row) => row.map((cell) => new Cell(cell, model))));
  //     setCells(model.cells);
  //   }
  //   else if (modelData) {
  //     modelData.model.setCells(cellObjs.map((row) => row.map((cell) => new Cell(cell, modelData.model))));
  //     setCells(modelData.model.cells);
  //   } 

  // };

  useEffect(() => {
    const setSpreadSheet = async () => {
      if (userId === undefined || userId === null) {
        navigate("/Login");
      }
      try {
        const spreadsheet = await pb
          .collection("spreadsheet")
          .getFirstListItem(`id="${sheetId}"`, { requestKey: null });

        const cellObjs = stringToSpreadSheet(spreadsheet.cells);

        const model = new SpreadSheet(
          spreadsheet.name,
          spreadsheet.id,
          spreadsheet.users,
          spreadsheet.rows,
          spreadsheet.cols
        );

        let stateCells = []

        for (let row = 0; row < cellObjs.length; row++) {
          let stateCellRow = []
          for (let col = 0; col < cellObjs[row].length; col++) {
            model.addCell(row, col, cellObjs[row][col])
            stateCellRow.push(cellObjs[row][col])
          }
          stateCells.push(stateCellRow)
        }
        
        setSpreadsheet(model)
        setCells(stateCells)
        setHighlightedCell((prevState) => {
          return {
            ...prevState,
            value: model.getCell(0, 0).getRawValue()
          }
        })
      
        //setCellsFromDb(model);
      } catch (error) {
        console.log(error);
        navigate("/Unauthorized");
      }
    };

    setSpreadSheet();

    // else if (
    //   !db.spreadsheets[parseInt(sheetId!) - 1].users.includes(userId)
    // ) {
    //   navigate("/Unauthorized");
    // }
  }, []);

  // useEffect(() => {
  //   const persist = async () => {
  //     if (sheetId) {
  //       const cellsAsString = spreadSheetToString(cells);
  //       const record = await pb
  //         .collection("spreadsheet")
  //         .update(sheetId, { cells: cellsAsString });

  //       setCellsFromDb(record, null);
  //     }
  //   };

  //   let interval: ReturnType<typeof setInterval> | undefined = undefined;

  //   if (isChanging && countdown > 0) {
  //     interval = setInterval(() => {
  //       setCountdown((seconds) => seconds - 1);
  //     }, 1000);
  //   } else if (countdown === 0) {
  //     // persist changes to database and reset frontend
  //     console.log("persisting");
  //     persist();

  //     setIsChanging(false);
  //     setCountdown(2); // Reset the timer automatically
  //   }

  //   return () => clearInterval(interval);
  // }, [isChanging, countdown]);

  const resetTimer = () => {
    setIsChanging(false);
    setCountdown(2);
  };

  const startTimer = () => {
    setIsChanging(true);
  };

  // converts a spreadsheet's cells into a string for database storage
  // NOTE: only need to store raw values in db
  function spreadSheetToString(listOfLists: Cell[][]): string {
    return listOfLists
      .map(
        (subList) =>
          "[" +
          subList
            .map((element) => {
              // Replace any commas in the raw value with \,
              const rawValue = element.getRawValue().replace(/,/g, "\\,");
              return `'${rawValue}'`;
            })
            .join(",") +
          "]"
      )
      .join("");
  }

  // converts the string representation of a spreadsheet's cells back into
  // a list of list of strings
  function stringToSpreadSheet(input: string): string[][] {
    // Split the input into sublists using a regex that matches the '[]' brackets
    const subLists = input.split(/(?<=\])(?=\[)/);

    return subLists.map((subList) => {
      // Remove the enclosing brackets
      subList = subList.slice(1, -1);

      // Split by commas not preceded by a backslash
      const elements = subList.split(/(?<!\\),/);

      return elements.map((element) => {
        // Remove the single quotes and unescape any escaped commas
        return element.slice(1, -1).replace(/\\,/g, ",");
      });
    });
  }

  // const handleChangeCell = (
  //   event: React.ChangeEvent<HTMLInputElement>,
  //   rowIdx: number,
  //   colIdx: number
  // ) => {
  //   if (modelData) {
  //     if (isChanging) {
  //       resetTimer();
  //       startTimer();
  //     } else {
  //       startTimer();
  //     }
  //     setCells((prevCells: Cell[][]) => {
  //       return prevCells.map((row: Cell[], i) =>
  //         i === rowIdx
  //           ? row.map((cell: Cell, j) =>
  //               j === colIdx
  //                 ? (() => {
  //                   const updatedCell = new Cell(event.target.value, modelData.model);
  //                   modelData.model.cells[rowIdx][colIdx] = updatedCell;
  //                   return updatedCell;
  //                 })()
  //                 : cell
  //             )
  //           : row
  //       );
  //     });
  //   }
  // };

  // const handleInsertFormula = (
  //   forumula: string,
  //   rowIdx: number,
  //   colIdx: number
  // ) => {
  //   if (modelData) {
  //     setCells((prevCells: Cell[][]) => {
  //       return prevCells.map((row: Cell[], i) =>
  //         i === rowIdx
  //           ? row.map((cell: Cell, j) =>
  //               j === colIdx
  //               ? (() => {
  //                 const updatedCell = new Cell(cell.getRawValue() + forumula, modelData.model)
  //                 modelData.model.cells[rowIdx][colIdx] = updatedCell;
  //                 return updatedCell;
  //               })()
  //               : cell
  //             )
  //           : row
  //       );
  //     });
  //   }
  // };

  const handleDoubleClick = (
    event: React.MouseEvent<HTMLInputElement, MouseEvent>,
    row: number,
    col: number
  ) => {
    (event.target as HTMLInputElement).focus();
    setHighlightedCell((prevState) => {
      return {
        ...prevState,
        focused: true,
      };
    });
  };

  const handleClick = (
    event: React.MouseEvent<HTMLInputElement, MouseEvent>,
    row: number,
    col: number
  ) => {
    (event.target as HTMLInputElement).blur();
    setHighlightedCell((prevState) => {
      return {
        ...prevState,
        row: row,
        col: col,
      };
    });
  };

  /* 
  Need a way of tracking highlighted cells (needs to be separate from "focus" because then then when you
  click edit cell focus will change)
  When you click on a cell, it becomes highlighted. When you click on edit cell, it does not change highlighted cell
  When you click on a cell, it becomes highlighted 
  You have to double click a cell for it to become focused, when focused, it shows the formula, when just
    highlighted, it shows the displayed value

  When a cell is highlighted, highlightedCell is set to highlighted cell's value
  When highlightedCell is edited, the highlighted cell's value changes
  When highlighted cell is edited, highlightedCell changes

  
  */
  // this value changes when cells are clicked
  // initialized to A1, which is 0,0
  interface HighlightedCell {
    row: number;
    col: number;
    focused: boolean;
    value: string | null
  }
  const [highlightedCell, setHighlightedCell] = useState<HighlightedCell>({
    row: 0,
    col: 0,
    focused: false,
    value: null
  }); // holds index of highlighted cell and

  /* 
  React may act weird with rerendering if we are directly changing the class objects Cells within the useState
  (some rerenders may not happen)

  What we should do is store the cell model data in useState in regular objects ({}/[]).

  Whenever a change happens, we update the model, then get the new state data from the model,
  and then use this to update react state

  We also initialize all useState from the model

  The model should be initialized from the database
  */

  const generateGrid = () => {
    if (spreadsheet) {
      const grid = [];

      for (let i = 0; i < spreadsheet.rows + 1; i++) {
        const row = [];
        for (let j = 0; j < spreadsheet.cols + 1; j++) {
          row.push(
            <div
              key={`${i}-${j}`}
              className={`${
                j === 0 || i === 0 ? "cell-bold" : "cell"
              } input-group-text rounded-0`}
            >
              {j == 0 && i == 0 ? (
                ""
              ) : i === 0 ? (
                j
              ) : j === 0 ? (
                String.fromCharCode("A".charCodeAt(0) + ((i - 1) % 26))
                  .toString()
                  .repeat((i - 1) / 26 + 1)
              ) : (
                <input
                  type="text"
                  className={`form-control rounded-0 ${
                    j - 1 === highlightedCell["row"] &&
                    i - 1 === highlightedCell["col"]
                      ? "highlighted-cell"
                      : ""
                  }`}
                  style={{ width: "98px" }}
                  /*
                  On double click, get raw value from model and set cell to raw value in frontend
                  Onblur, get displayed value from model and set cell in Cells to this value
                  On change, get cell in model, set cell in the model, get raw value and set that
                    to current cell in Cells
                  
                  OnClick, set highlightedCell to raw value from model of current highlighted cell,
                  and set row, col, and focused
                  
                  Highlighted Cell {
                    row,
                    col,
                    value,
                    focused
                  }

                  Highlighted Cell Editor
                  OnChange, get cell in model, set cell in model, get raw value and set that
                    to highlightedCell.value and Cells

                  */
                  // onDoubleClick={(event) =>
                  //   handleDoubleClick(event, j - 1, i - 1)
                  // }
                  // onBlur={() =>
                  //   setHighlightedCell((prevState) => {
                  //     return { ...prevState, focused: false };
                  //   })
                  // }
                  // value={
                  //   highlightedCell.focused &&
                  //   highlightedCell.row === j - 1 &&
                  //   highlightedCell.col === i - 1
                  //     ? cells[j - 1][i - 1].getRawValue()
                  //     : cells[j - 1][i - 1].getDisplayedValue()
                  // }
                  value={cells[j - 1][i - 1]}
                  // onChange={(event) => handleChangeCell(event, j - 1, i - 1)}
                  // onClick={(event) => handleClick(event, j - 1, i - 1)}
                ></input>
              )}
            </div>
          );
        }
        grid.push(
          <div
            key={i}
            className="row"
            style={{ gridTemplateRows: `repeat(${spreadsheet.rows + 1}, 40px)` }}
          >
            {row}
          </div>
        );
      }
      return grid;
    }
  };

  interface SaveIconProps {
    isChanging: boolean;
  }

  const SaveIcon: React.FC<SaveIconProps> = ({ isChanging }) => {
    const iconClass = isChanging ? "flashing" : "";

    return <FaSave className={iconClass} />;
  };

  return (
    <>
      {cells.length > 0 && spreadsheet && (
        <div>
          <div className="bg-light py-5 mb-5 spreadsheet-header row-container">
            <IoIosArrowBack
              className="back-arrow"
              onClick={() => navigate(-1)}
            />
          </div>
          <div className="scrollable-container">
            <div style={{ display: "flex" }}>
              <Button
                className="bg-success"
                style={{ height: "38px", border: "none" }}
              >
                <SaveIcon isChanging={isChanging} />
              </Button>
              {/* <DropdownButton
                className="mx-1"
                id="file-dropdown"
                title="Insert"
              >
                <Dropdown.Item
                  onClick={() =>
                    handleInsertFormula(
                      "+SUM()",
                      highlightedCell.row,
                      highlightedCell.col
                    )
                  }
                >
                  sum
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() =>
                    handleInsertFormula(
                      "+COUNT()",
                      highlightedCell.row,
                      highlightedCell.col
                    )
                  }
                >
                  count
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() =>
                    handleInsertFormula(
                      "+AVERAGE()",
                      highlightedCell.row,
                      highlightedCell.col
                    )
                  }
                >
                  average
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() =>
                    handleInsertFormula(
                      "+MIN()",
                      highlightedCell.row,
                      highlightedCell.col
                    )
                  }
                >
                  min
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() =>
                    handleInsertFormula(
                      "+MAX()",
                      highlightedCell.row,
                      highlightedCell.col
                    )
                  }
                >
                  max
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() =>
                    handleInsertFormula(
                      "+CONCAT()",
                      highlightedCell.row,
                      highlightedCell.col
                    )
                  }
                >
                  concat
                </Dropdown.Item>
              </DropdownButton> */}
              {/* <input
                type="text"
                className="form-control rounded-0"
                style={{ width: "400px", marginBottom: 10 }}
                value={cells[highlightedCell.row][
                  highlightedCell.col
                ].getRawValue()}
                onChange={(event) =>
                  handleChangeCell(
                    event,
                    highlightedCell.row,
                    highlightedCell.col
                  )
                }
              ></input> */}
            </div>
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${spreadsheet.cols + 1}, 100px)`,
              }}
            >
              {generateGrid()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
