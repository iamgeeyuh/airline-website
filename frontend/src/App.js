import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./pages/Root/Root";
import Error from "./pages/Error/Error";
import Home from "./pages/Home/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
