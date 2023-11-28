import { SpreadSheet } from "../model/SpreadSheet";
// import '/node_modules/bootstrap/dist/css/bootstrap.min.css';
// import './styles/FileSystemStyle.css';
import db from '../db';
import React, { useContext } from "react";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { FaPlus, FaTrash, FaShare, FaSearch, FaUserCircle } from 'react-icons/fa';
import InputGroup from 'react-bootstrap/InputGroup';
import { SpreadSheetWrapper } from "../model/SpreadSheetWrapper";
import { Modal, Button, Form } from 'react-bootstrap';
import { Cell } from "../model/Cell";
import { User } from "../model/User";
import { AppContextType, AppContext } from "../../context";
import { useDispatch, useSelector } from "react-redux";
import { LoginState } from "../../redux/login";

export class FileSystemView extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        const dispatch = useDispatch();
        const userId = useSelector((state: LoginState) => state.userId);

        this.state = {
            spreadsheets: db.spreadsheets
            .filter(sheet => sheet.users.includes(userId ?? 2))
            .map(sheet => new SpreadSheetWrapper(sheet.cells, sheet.Name, sheet.Id, sheet.users)),
            modalActive: false
        };

        this._createSearchBar = this._createSearchBar.bind(this);
        this._filterSpreadsheet = this._filterSpreadsheet.bind(this);
        this._clickShareSpreadSheet = this._clickShareSpreadSheet.bind(this);
        this._clickSpreadsheet = this._clickSpreadsheet.bind(this);
        this._createbuttons = this._createbuttons.bind(this);
        this._clickAddSpreadsheet = this._clickAddSpreadsheet.bind(this);
        this._createModal  = this._createModal.bind(this);
    }


    render() {

        return (
            <div>
                {this.state.modalActive ? <this._createModal /> : null}
                <div className="bg-light py-3 pl-3 spreadsheet-header row-container">
                    <h2 className="mx-4">Your Spreadsheets</h2>
                    <h4 className="mx-4">John Doe<FaUserCircle size={40} className="mx-3" /></h4>
                </div>
                <div className="row-container mx-5 my-3">
                    <this._createSearchBar />
                    <this._createbuttons />
                </div>
                <div className="container spread-container">
                    {
                        this.state.spreadsheets.map((spreadsheet) => {
                            return this._createSpreadsheetCard(spreadsheet);
                        })
                    }
                </div>
            </div>
        );
    }

        // EVENT HANDLERS

        _clickSpreadsheet(spreadsheet: SpreadSheetWrapper) {
            this.setState({
                ...this.state,
                spreadsheets: this.state.spreadsheets.map((sheet) => {
                    if (sheet.id === spreadsheet.id && sheet.isSelected) {
                        // Route here
                        return sheet;
                    } else if (sheet.id === spreadsheet.id) {
                        sheet.isSelected = true;
                        return sheet;
                    } else {
                        sheet.isSelected = false;
                        return sheet;
                    }
                }).filter((sheet) => sheet !== undefined) as SpreadSheetWrapper[]
            });
        }
    
        _clickAddSpreadsheet(spreadsheet: SpreadSheetWrapper) {
            this.setState({
                ...this.state,
                spreadsheets: [...this.state.spreadsheets, spreadsheet]
            });
        }
    
        _clickDeleteSpreadsheet(spreadsheet: SpreadSheetWrapper) {
            const spreadSheets = this.state.spreadsheets;
            this.setState({
                ...this.state,
                spreadsheets: this.state.spreadsheets.splice(spreadSheets.indexOf(spreadsheet), 1)
            });
        }
    
        _clickShareSpreadSheet() {
            // Route here
        }
    
        _filterSpreadsheet(searchVal: string) {
            this.setState({
                ...this.state,
                spreadsheets: this.state.spreadsheets.map((sheet) => {
                    if (sheet.name.includes(searchVal)) {
                        sheet.isHidden = false;
                        return sheet;
                    } else {
                        sheet.isHidden = true;
                        return sheet;
                    }
                }).filter((sheet) => sheet !== undefined) as SpreadSheetWrapper[]
            });
        }
        

    // CREATING FUNCTIONS

    _createSpreadsheetCard(spreadsheet: SpreadSheetWrapper) {
        return (
            <div key={spreadsheet.id} className={`card mt-3 shadow dashboard-card ${spreadsheet.isSelected ? 'active' : ''} ${spreadsheet.isHidden ? 'hidden' : ''}`} onClick={() => this._clickSpreadsheet(spreadsheet)}> {spreadsheet.name} </div>
        );
    }

    _createbuttons() {
        return (
            <ButtonGroup className="">
                <Button className="rounded mx-1 mb-3 btn-sumbit" onClick={() => this.setState({...this.state, modalActive: true})}><FaPlus /></Button>
                <Button className="rounded mx-1 mb-3 btn-danger"><FaTrash/></Button>
                <Form.Label htmlFor="basic-url"><Button className="rounded mx-1 btn-secondary"><FaShare /></Button></Form.Label>
                <InputGroup className="mb-3">
                    <Form.Control id="basic-url" placeholder="example@gmail.com" />
                </InputGroup>
            </ButtonGroup>
        )
    }

    _createSearchBar() {
        const that = this;
        return (
            <form id="search-form" className="form-inline" role="form">
                <div className="input-group">
                <input type="text" className="form-control search-form" placeholder="Search" onChange={(field) => {
                    that._filterSpreadsheet(field.target.value)}}/>
                    <span className="input-group-btn">
                        <button type="submit" className="btn btn-primary search-btn disabled" data-target="#search-form">
                            <FaSearch />
                        </button>
                    </span>
                </div>
            </form>
        )
    }

    _createModal() {

        const handleClose = () => this.setState({...this.state, modalActive: false});

        const handleSubmit = (e: any) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = new Map<string, any>();
            formData.forEach((value, key) => {
              data.set(key, value.toString());
            });

            let cells = Array(data.get("numRows")).fill(undefined).map(()=>Array(data.get("numCols")).fill(undefined));

            console.log(this.state.spreadsheets);
            this.setState({
                modalActive: false,
                spreadsheets: [...this.state.spreadsheets, new SpreadSheetWrapper(cells, data.get("spreadsheetTitle"), 123, [], false) as SpreadSheetWrapper]
             });

             let spreadSheetDb: {cells: Cell[][], Name: string, Id: number, users: number[]}[] = db.spreadsheets

             spreadSheetDb.push({cells: cells, Name: data.get("spreadsheetTitle"), Id: 123, users: []});

             // writeSpreadsheet(spreadSheetDb);

             console.log(this.state.spreadsheets);

        }
      
        return (
          <>

            <Modal show={this.state.modalActive} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Create Spreadsheet</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form id="createSpreadsheetForm" onSubmit={handleSubmit}>
                  <Form.Group controlId="formBasicTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" name="spreadsheetTitle" placeholder="Enter a Title" />
                  </Form.Group>
      
                  <Form.Group controlId="formDimensions">
                    <div className="row mt-1">
                        <div className="col-sm-6">
                            <Form.Label># Rows</Form.Label>
                            <Form.Control name="numRows" type="number" placeholder="Number of Rows" />
                        </div>
                        <div className="col-sm-6">
                            <Form.Label> # Columns</Form.Label>
                            <Form.Control name="numCols" type="number" placeholder="Number of Columns" />
                        </div>
                    </div>
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" type="button" onClick={handleClose}>
                  Close
                </Button>
                <Button form="createSpreadsheetForm" type="submit" variant="primary">
                  Submit
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        );
      }



}

interface IProps {
}

interface IState {
    spreadsheets: SpreadSheetWrapper[];
    modalActive: boolean;
}




  