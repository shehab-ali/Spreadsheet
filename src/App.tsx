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
import { Provider } from "react-redux";
import { store } from "./redux/store";
import PocketBase from "pocketbase";
import UnauthorizedView from "./spreadsheet/view/UnathorizedView";

export const pb = new PocketBase("https://spreadsheetdatabase.fly.dev");

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/Login" />} />
          <Route path="/Login" element={<LoginScreen />} />
          <Route path="/Dashboard" element={<FileSystemView />} />
          <Route path="/Spreadsheets/:sheetId" element={<SpreadsheetView />} />
          <Route path="/Unauthorized" element={<UnauthorizedView />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
