import { createContext } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";

export interface AppContextType {
  login: any;
  setLogin: React.Dispatch<React.SetStateAction<any>>;
  navigate: NavigateFunction;
}

export const AppContext = createContext<AppContextType>({
  login: {},
  setLogin: () => {},
  navigate: () => {},
});
