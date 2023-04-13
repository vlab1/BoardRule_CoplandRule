import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { useRoutes } from "./routes";
import Header from "./components/layout/header/Header";
const App = () => {
  const routes = useRoutes();
  return (
    <>
      <BrowserRouter>
      <Header></Header>
        {routes}
      </BrowserRouter>
    </>
  );
};

export default App;
