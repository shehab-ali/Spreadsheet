import { Component, useState, useEffect } from "react";
import { SpreadSheet } from "../model/SpreadSheet";
import "/node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./styles/SpreadSheetStyle.css";
import "./styles/FileSystemStyle.css";
import db from "../db";
import { useParams } from "react-router-dom";
import { Cell } from "../model/Cell";

export const SpreadsheetView = () => {
  let { sheetId } = useParams();

  const modelData = db.spreadsheets[sheetId ? parseInt(sheetId) - 1 : 0];

  const modelCells = [];
  for (let i = 0; i < modelData.rows; i++) {
    const row = [];
    for (let j = 0; j < modelData.cols; j++) {
      row.push(new Cell());
    }
    modelCells.push(row);
  }

  const model = new SpreadSheet(
    modelCells,
    modelData.Name,
    modelData.Id,
    modelData.users
  );
  const [cells, setCells] = useState<Cell[][]>(modelCells);

  const handleChangeCell = (
    event: React.ChangeEvent<HTMLInputElement>,
    rowIdx: number,
    colIdx: number
  ) => {
    setCells((prevCells: Cell[][]) => {
      return prevCells.map((row: Cell[], i) =>
        i === rowIdx
          ? row.map((cell: Cell, j) =>
              j === colIdx ? new Cell(event.target.value) : cell
            )
          : row
      );
    });
  };

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
  }
  const [highlightedCell, setHighlightedCell] = useState<HighlightedCell>({
    row: 0,
    col: 0,
    focused: false,
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
    const grid = [];

    for (let i = 0; i < modelData.rows + 1; i++) {
      const row = [];
      for (let j = 0; j < modelData.cols + 1; j++) {
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
                onDoubleClick={(event) =>
                  handleDoubleClick(event, j - 1, i - 1)
                }
                onBlur={() =>
                  setHighlightedCell((prevState) => {
                    return { ...prevState, focused: false };
                  })
                }
                value={
                  highlightedCell.focused &&
                  highlightedCell.row === j - 1 &&
                  highlightedCell.col === i - 1
                    ? cells[j - 1][i - 1].getRawValue()
                    : cells[j - 1][i - 1].getDisplayedValue()
                }
                onChange={(event) => handleChangeCell(event, j - 1, i - 1)}
                onClick={(event) => handleClick(event, j - 1, i - 1)}
              ></input>
            )}
          </div>
        );
      }
      grid.push(
        <div
          key={i}
          className="row"
          style={{ gridTemplateRows: `repeat(${modelData.rows + 1}, 40px)` }}
        >
          {row}
        </div>
      );
    }
    return grid;
  };

  return (
    <div>
      <div className="bg-light py-5 mb-5 spreadsheet-header row-container"></div>
      <div className="scrollable-container">
        <input
          type="text"
          className="form-control rounded-0"
          style={{ width: "400px", marginBottom: 10 }}
          value={cells[highlightedCell.row][highlightedCell.col].getRawValue()}
          onChange={(event) =>
            handleChangeCell(event, highlightedCell.row, highlightedCell.col)
          }
        ></input>
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${modelData.cols + 1}, 100px)`,
          }}
        >
          {generateGrid()}
        </div>
      </div>
    </div>
  );
};
