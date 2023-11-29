import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoginState } from "../../redux/login";
import { SpreadSheetWrapper } from "../model/SpreadSheetWrapper";
import { Modal, Button, Form } from "react-bootstrap";
import {
  FaPlus,
  FaTrash,
  FaShare,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import InputGroup from "react-bootstrap/InputGroup";
import { SpreadSheet } from "../model/SpreadSheet";
import { Cell } from "../model/Cell";
import { User } from "../model/User";
import type { RootState, store } from "../../redux/store";
import db from "../db";
import { useNavigate } from "react-router-dom";
import { pb } from "../../App";

interface IProps {}

interface IState {
  spreadsheets: SpreadSheetWrapper[] | null;
  modalActive: boolean;
}

export const FileSystemView: React.FC<IProps> = () => {
  const { userId } = useSelector((state: RootState) => state.loginUser);
  const navigate = useNavigate();

  useEffect(() => {
    const getSpreadSheet = async () => {
      try {
        // pocketbase rules do the filtering by user
        const spreadsheets = await pb
          .collection("spreadsheet")
          .getFullList({ requestKey: null });

        console.log(spreadsheets);

        const spreadSheetObjects = spreadsheets.map(
          (sheet) => new SpreadSheetWrapper(sheet.name, sheet.id, sheet.users)
        );

        setState((prevState) => {
          return {
            ...prevState,
            spreadsheets: spreadSheetObjects,
          };
        });
      } catch (error) {
        console.log("error while fetching spreadsheet");
      }
    };

    if (userId === undefined || userId === null) {
      navigate("/Login");
    } else {
      getSpreadSheet();
    }
  }, []);

  // const [state, setState] = useState<IState>({
  //     spreadsheets: db.spreadsheets
  //         .filter(sheet => sheet.users.includes(userId!))
  //         .map(sheet => new SpreadSheetWrapper(sheet.cells, sheet.Name, sheet.Id, sheet.users)),
  //     modalActive: false
  // });
  const [state, setState] = useState<IState>({
    spreadsheets: null,
    modalActive: false,
  });

  const createSearchBar = () => {
    return (
      <form id="search-form" className="form-inline" role="form">
        <div className="input-group">
          <input
            type="text"
            className="form-control search-form"
            placeholder="Search"
            onChange={(field) => {
              filterSpreadsheet(field.target.value);
            }}
          />
          <span className="input-group-btn">
            <button
              type="submit"
              className="btn btn-primary search-btn disabled"
              data-target="#search-form"
            >
              <FaSearch />
            </button>
          </span>
        </div>
      </form>
    );
  };

  const filterSpreadsheet = (searchVal: string) => {
    if (state.spreadsheets) {
      setState({
        ...state,
        spreadsheets: state.spreadsheets
          .map((sheet) => {
            if (sheet.name.includes(searchVal)) {
              sheet.isHidden = false;
              return sheet;
            } else {
              sheet.isHidden = true;
              return sheet;
            }
          })
          .filter((sheet) => sheet !== undefined) as SpreadSheetWrapper[],
      });
    }
  };

  const createSpreadsheetCard = (spreadsheet: SpreadSheetWrapper) => {
    return (
      <div
        key={spreadsheet.id}
        className={`card mt-3 shadow dashboard-card ${
          spreadsheet.isSelected ? "active" : ""
        } ${spreadsheet.isHidden ? "hidden" : ""}`}
        onClick={() => navigate("/Spreadsheets/" + spreadsheet.id)}
      >
        {" "}
        {spreadsheet.name}{" "}
      </div>
    );
  };

  const clickSpreadsheet = (spreadsheet: SpreadSheetWrapper) => {
    if (state.spreadsheets) {
      setState({
        ...state,
        spreadsheets: state.spreadsheets
          .map((sheet) => {
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
          })
          .filter((sheet) => sheet !== undefined) as SpreadSheetWrapper[],
      });
    }
  };

  const clickAddSpreadsheet = (spreadsheet: SpreadSheetWrapper) => {
    if (state.spreadsheets) {
      setState({
        ...state,
        spreadsheets: [...state.spreadsheets, spreadsheet],
      });
    }
  };

  const clickDeleteSpreadsheet = (spreadsheet: SpreadSheetWrapper) => {
    if (state.spreadsheets) {
      const spreadSheets = state.spreadsheets;
      setState({
        ...state,
        spreadsheets: state.spreadsheets.splice(
          spreadSheets.indexOf(spreadsheet),
          1
        ),
      });
    }
  };

  const clickShareSpreadSheet = () => {
    // Route here
  };

  const createButtons = () => {
    return (
      <ButtonGroup className="">
        <Button
          className="rounded mx-1 mb-3 btn-sumbit"
          onClick={() => setState({ ...state, modalActive: true })}
        >
          <FaPlus />
        </Button>
        <Button className="rounded mx-1 mb-3 btn-danger">
          <FaTrash />
        </Button>
        <Form.Label htmlFor="basic-url">
          <Button className="rounded mx-1 btn-secondary">
            <FaShare />
          </Button>
        </Form.Label>
        <InputGroup className="mb-3">
          <Form.Control id="basic-url" placeholder="example@gmail.com" />
        </InputGroup>
      </ButtonGroup>
    );
  };

  const createModal = () => {
    const handleClose = () => setState({ ...state, modalActive: false });

    const handleSubmit = async (e: any) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = new Map<string, any>();
      formData.forEach((value, key) => {
        data.set(key, value.toString());
      });

      // TODO: change this to represent form data!!!
      const newSheet = {
        name: "test",
        users: [userId],
        rows: 20,
        cols: 20,
      };

      try {
        const record = await pb.collection("spreadsheet").create(newSheet);

        console.log(state.spreadsheets);
        if (state.spreadsheets) {
          setState({
            modalActive: false,
            spreadsheets: [
              ...state.spreadsheets,
              new SpreadSheetWrapper(
                record.name,
                record.id,
                record.users
              ) as SpreadSheetWrapper,
            ],
          });
        }
      } catch (error) {
        console.log("Failed to create spreadsheet");
      }

      //   let spreadSheetDb: {
      //     cells: Cell[][];
      //     Name: string;
      //     Id: number;
      //     users: number[];
      //   }[] = db.spreadsheets;

      //   spreadSheetDb.push({
      //     cells: cells,
      //     Name: data.get("spreadsheetTitle"),
      //     Id: 123,
      //     users: [],
      //   });

      // writeSpreadsheet(spreadSheetDb);

      console.log(state.spreadsheets);
    };

    return (
      <>
        <Modal show={state.modalActive} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create Spreadsheet</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form id="createSpreadsheetForm" onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="spreadsheetTitle"
                  placeholder="Enter a Title"
                />
              </Form.Group>

              <Form.Group controlId="formDimensions">
                <div className="row mt-1">
                  <div className="col-sm-6">
                    <Form.Label># Rows</Form.Label>
                    <Form.Control
                      name="numRows"
                      type="number"
                      placeholder="Number of Rows"
                    />
                  </div>
                  <div className="col-sm-6">
                    <Form.Label> # Columns</Form.Label>
                    <Form.Control
                      name="numCols"
                      type="number"
                      placeholder="Number of Columns"
                    />
                  </div>
                </div>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" type="button" onClick={handleClose}>
              Close
            </Button>
            <Button
              form="createSpreadsheetForm"
              type="submit"
              variant="primary"
            >
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  return (
    <div>
      {state.modalActive && state.spreadsheets ? createModal() : null}
      <div className="bg-light py-3 pl-3 spreadsheet-header row-container">
        <h2 className="mx-4">Your Spreadsheets</h2>
        <h4 className="mx-4">
          John Doe
          <FaUserCircle size={40} className="mx-3" />
        </h4>
      </div>
      <div className="row-container mx-5 my-3">
        {createSearchBar()}
        {createButtons()}
      </div>
      {state.spreadsheets && (
        <div className="container spread-container">
          {state.spreadsheets.map((spreadsheet) => {
            return createSpreadsheetCard(spreadsheet);
          })}
        </div>
      )}
    </div>
  );
};
