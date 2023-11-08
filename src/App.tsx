import './App.css';
import { FileSystemView } from './spreadsheet/view/FileSystemView';
import LoginScreen from './spreadsheet/view/LoginScreen';
import { Routes, Route, Navigate, HashRouter, BrowserRouter } from "react-router-dom";
import { SpreadsheetView } from './spreadsheet/view/SpreadSheetView';

function App() {
  return (
    <BrowserRouter> 
      <Routes> 
        <Route path="/" element={<Navigate to="/Spreadsheets/2" />}/> 
        <Route path="/Login" element={<LoginScreen/>}/> 
        <Route path="/Dashboard" element={<FileSystemView/>} />
        <Route path="/Spreadsheets/:sheetId" element={<SpreadsheetView/>} />
      </Routes> 
      </BrowserRouter> 
  );
}

/*
        <Route path="Spreadsheets" element={<Assignments/>} />
        <Route
          path="Assignments/:sheetId"
          element={<AssignmentEditor/>}
        />

*/


export default App;
