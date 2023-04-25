import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./pages/Root/Root";
import Error from "./pages/Error/Error";
import Home from "./pages/Home/Home";
import CustomerRegistration from "./pages/Registration/CustomerRegistration";
import StaffRegistration from "./pages/Registration/StaffRegistration";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/StaffRegistration", element: <StaffRegistration /> },
      { path: "/CustomerRegistration", element: <CustomerRegistration /> },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
