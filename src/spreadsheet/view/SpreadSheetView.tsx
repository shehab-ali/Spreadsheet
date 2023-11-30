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

  // given spreadsheet from pocketbase, returns model and stateCells
  const setCellsFromDb = (
    spreadsheet: RecordModel
  ): [SpreadSheet, string[][]] => {
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
        const modelCell = model.getCell(row, col)
        if (modelCell.checkError()) {
          stateCellRow.push("#INVALID")
        } else {
          stateCellRow.push(modelCell.getDisplayedValue())
        }
      }
      stateCells.push(stateCellRow)
    }

    return [model, stateCells]
  };

  useEffect(() => {
    const setSpreadSheet = async () => {
      if (userId === undefined || userId === null) {
        navigate("/Login");
      }
      try {
        const spreadsheet = await pb
          .collection("spreadsheet")
          .getFirstListItem(`id="${sheetId}"`, { requestKey: null });

        const res = setCellsFromDb(spreadsheet)
        const model = res[0]
        const stateCells = res[1]
        
        setSpreadsheet(model)
        setCells(stateCells)
        setHighlightedCell((prevState) => {
          return {
            ...prevState,
            value: model.getCell(0, 0).getRawValue()
          }
        })
      } catch (error) {
        console.log(error);
        navigate("/Unauthorized");
      }
    };

    setSpreadSheet();

    pb.collection('spreadsheet').subscribe('*', function (e) {
      const res = setCellsFromDb(e.record)
      const model = res[0]
      const stateCells = res[1]

      setSpreadsheet(model)
      setCells(stateCells)
      setHighlightedCell((prevState) => {
        return {
          ...prevState,
          value: model.getCell(prevState.row, prevState.col).getRawValue()
        }
      })
    });

    return () => {
      pb.collection('spreadsheet').unsubscribe('*');
    };
  }, []);

  useEffect(() => {
    const persist = async () => {
      if (sheetId) {
        const cellsAsString = spreadSheetToString();
        const record = await pb
          .collection("spreadsheet")
          .update(sheetId, { cells: cellsAsString });
      }
    };

    let interval: ReturnType<typeof setInterval> | undefined = undefined;

    if (isChanging && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((seconds) => seconds - 1);
      }, 1000);
    } else if (countdown === 0) {
      // persist changes to database and reset frontend
      console.log("persisting");
      persist();

      setIsChanging(false);
      setCountdown(2); // Reset the timer automatically
    }

    return () => clearInterval(interval);
  }, [isChanging, countdown]);

  const resetTimer = () => {
    setIsChanging(false);
    setCountdown(2);
  };

  const startTimer = () => {
    setIsChanging(true);
  };

  // converts a spreadsheet's cells into a string for database storage
  // NOTE: only need to store raw values in db
  function spreadSheetToString(): string {
    if (spreadsheet) {
      return spreadsheet.cells
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
    return ""
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

  const handleChangeRawEditor = (event: React.ChangeEvent<HTMLInputElement>,
    rowIdx: number,
    colIdx: number) => {
      if (spreadsheet) {
        const modelCell = spreadsheet.getCell(rowIdx, colIdx)
        spreadsheet.setCellValue(modelCell, event.target.value)

        if (isChanging) {
          resetTimer();
          startTimer();
        } else {
          startTimer();
        }

        setHighlightedCell((prevState: HighlightedCell) => {
          return {
            ...prevState,
            value: modelCell.getRawValue()
          };
        });

        setCells((prevCells: string[][]) => {
          return prevCells.map((row: string[], i) =>
            i === rowIdx
              ? row.map((cell: string, j) =>
                  j === colIdx
                    ? (() => {
                      if (modelCell.checkError()) {
                        return "#INVALID"
                      } else {
                        return modelCell.getDisplayedValue()
                      }
                    })()
                    : cell
                )
              : row
          );
        });
        
      }
    }

  const handleChangeCell = (
    event: React.ChangeEvent<HTMLInputElement>,
    rowIdx: number,
    colIdx: number
  ) => {
    if (spreadsheet) {
      const modelCell = spreadsheet.getCell(rowIdx, colIdx)
      // refCells are all the cells that reference this current cell
      const refCells = spreadsheet.setCellValue(modelCell, event.target.value)

      // TODO: for every refCell, update displayed value in the front end
      // need cells to have their location in the spreadsheet though
      // for (let i = 0; i < refCells.length; i++) {
        
      // }

      const newCellValue = modelCell.getRawValue()

      if (isChanging) {
        resetTimer();
        startTimer();
      } else {
        startTimer();
      }

      setHighlightedCell((prevState: HighlightedCell) => {
        return {
          ...prevState,
          value: modelCell.getRawValue()
        };
      });

      setCells((prevCells: string[][]) => {
        return prevCells.map((row: string[], i) =>
          i === rowIdx
            ? row.map((cell: string, j) =>
                j === colIdx
                  ? (() => {
                    return newCellValue
                  })()
                  : cell
              )
            : row
        );
      });
    }
  };

  const handleInsertFormula = (
    forumula: string,
    rowIdx: number,
    colIdx: number
  ) => {
    if (spreadsheet) {
      const modelCell = spreadsheet.getCell(rowIdx, colIdx)
      spreadsheet.setCellValue(modelCell, modelCell.getRawValue() + forumula)

      // TODO: check if this triggers handleCellChange, if not put starttimer stuff here too

      setHighlightedCell((prevState: HighlightedCell) => {
        return {
          ...prevState,
          value: modelCell.getRawValue()
        };
      });

      setCells((prevCells: string[][]) => {
        return prevCells.map((row: string[], i) =>
          i === rowIdx
            ? row.map((cell: string, j) =>
                j === colIdx
                  ? (() => {
                    return modelCell.getDisplayedValue()
                  })()
                  : cell
              )
            : row
        );
      });
    }
  };

  const handleDoubleClick = (
    event: React.MouseEvent<HTMLInputElement, MouseEvent>,
    rowIdx: number,
    colIdx: number
  ) => {
    (event.target as HTMLInputElement).focus();
    if (spreadsheet) {
      const modelCell = spreadsheet.getCell(rowIdx, colIdx)

      setCells((prevCells: string[][]) => {
        return prevCells.map((row: string[], i) =>
          i === rowIdx
            ? row.map((cell: string, j) =>
                j === colIdx
                  ? (() => {
                    return modelCell.getRawValue()
                  })()
                  : cell
              )
            : row
        );
      });
    }
    
  };

  const handleClick = (
    event: React.MouseEvent<HTMLInputElement, MouseEvent>,
    row: number,
    col: number
  ) => {
    (event.target as HTMLInputElement).blur();
    if (spreadsheet) {
      setHighlightedCell((prevState: HighlightedCell) => {
        return {
          ...prevState,
          row: row,
          col: col,
          value: spreadsheet.getCell(row, col).getRawValue()
        };
      });
    }
  };
  // this value changes when cells are clicked
  // initialized to A1, which is 0,0
  interface HighlightedCell {
    row: number;
    col: number;
    value: string
  }
  const [highlightedCell, setHighlightedCell] = useState<HighlightedCell>({
    row: 0,
    col: 0,
    value: ""
  }); // holds index of highlighted cell and

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
                    i - 1 === highlightedCell["row"] &&
                    j - 1 === highlightedCell["col"]
                      ? "highlighted-cell"
                      : ""
                  }`}
                  style={{ width: "98px" }}
                  onDoubleClick={(event) =>
                    handleDoubleClick(event, i - 1, j - 1)
                  }
                  onBlur={() => {
                    const rowIdx = i - 1
                    const colIdx = j - 1
                    const modelCell = spreadsheet.getCell(rowIdx, colIdx)

                    setCells((prevCells: string[][]) => {
                      return prevCells.map((row: string[], i) =>
                        i === rowIdx
                          ? row.map((cell: string, j) =>
                              j === colIdx
                                ? (() => {
                                  if (modelCell.checkError()) {
                                    return "#INVALID"
                                  } else {
                                    return modelCell.getDisplayedValue()
                                  }
                                })()
                                : cell
                            )
                          : row
                      );
                    });
                  }}
                  value={cells[i - 1][j - 1]}
                  onChange={(event) => handleChangeCell(event, i - 1, j - 1)}
                  onClick={(event) => handleClick(event, i - 1, j - 1)}
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
              <DropdownButton
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
              </DropdownButton>
              <input
                type="text"
                className="form-control rounded-0"
                style={{ width: "400px", marginBottom: 10 }}
                value={highlightedCell.value}
                onChange={(event) =>
                  handleChangeRawEditor(
                    event,
                    highlightedCell.row,
                    highlightedCell.col
                  )
                }
              ></input>
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
