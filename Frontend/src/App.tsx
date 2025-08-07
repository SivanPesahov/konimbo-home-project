import { Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import NotFoundPage from "./pages/NotFoundPage";
import Home from "./pages/Home";

// import { Provider } from "react-redux";
// import { store } from "./store/store";

function App() {
  return (
    // -- redux
    // <Provider store={store}>

    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>

    // </Provider>
  );
}

export default App;
