import { Component, useState } from "react";
import { SpreadSheet } from "../model/SpreadSheet";
import '/node_modules/bootstrap/dist/css/bootstrap.min.css';
import './styles/SpreadSheetStyle.css';
import './styles/FileSystemStyle.css';
import db from '../db';
import { useParams } from "react-router-dom";
import { Cell } from "../model/Cell";


export const SpreadsheetView = () => {
    let { sheetId } = useParams();
    const modelData = db.spreadsheets[sheetId ? parseInt(sheetId) : 0];
    const [cells, setCells] = useState(() => {
        const initialCells = [];
        for (let i = 0; i < modelData.rows; i++) {
            const row = [];
            for (let j = 0; j < modelData.cols; j++) {
                row.push(new Cell());
            }
            initialCells.push(row);
        }
        return initialCells;
    });

    const model = new SpreadSheet(cells, modelData.Name, modelData.Id, modelData.users);
        
        const generateGrid = () => {
            const grid = [];

            for (let i = 0; i < modelData.rows; i++) {
                const row = [];
                for (let j = 0; j < modelData.cols; j++) {
                    row.push(
                    <div key={`${i}-${j}`} className={`${j === 0 || i === 0 ? 'cell-bold' : 'cell'} input-group-text rounded-0`}>
                        <input type="text" className="form-control rounded-0" style={{width: "98px"}} onChange={(event) => {
                            cells[i][j].setValue(event.target.value);
                            setCells(cells);
                        }}></input>
                    </div>
                    );
                }
                grid.push(
                    <div key={i} className="row" style={{gridTemplateRows: `repeat(${modelData.rows}, 40px)`}}>
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
                    <div className="grid" style={{gridTemplateColumns: `repeat(${modelData.cols}, 100px)`}}>{generateGrid()}</div>
                </div>
            </div>
        );
}