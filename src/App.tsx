import "./App.css";
import { FileSystemView } from "./spreadsheet/view/FileSystemView";
import LoginScreen from "./spreadsheet/view/LoginScreen";
import {
  Routes,
  Route,
  Navigate,
  HashRouter,
  BrowserRouter,
  useNavigate,
} from "react-router-dom";
import { SpreadsheetView } from "./spreadsheet/view/SpreadSheetView";
import { useContext, createContext, useState, ReactNode } from "react";
import { AppContext, AppContextType } from "./context";

function App() {
  return (
    <BrowserRouter>
      <AppContextProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/Spreadsheets/2" />} />
          <Route path="/Login" element={<LoginScreen />} />
          <Route path="/Dashboard" element={<FileSystemView />} />
          <Route path="/Spreadsheets/:sheetId" element={<SpreadsheetView />} />
        </Routes>
      </AppContextProvider>
    </BrowserRouter>
  );
}

interface AppContextProviderProps {
  children: ReactNode;
}

// Needed to do all this because you can't use useNavigate outside of a BrowserRouter
// and you can't just call it in a class component either :/ cause it's a hook
const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}) => {
  // when logged out, is {}
  // when logged in, is { id: ... } holds the user_id
  // for future communication with db/server
  const [login, setLogin] = useState({});
  const navigate = useNavigate();

  return (
    <AppContext.Provider value={{ login, setLogin, navigate }}>
      {children}
    </AppContext.Provider>
  );
};

/*
        <Route path="Spreadsheets" element={<Assignments/>} />
        <Route
          path="Assignments/:sheetId"
          element={<AssignmentEditor/>}
        />

*/

export default App;
