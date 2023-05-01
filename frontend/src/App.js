import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./pages/Root/Root";
import Error from "./pages/Error/Error";
import Home from "./pages/Home/Home";
import CustomerRegistration from "./pages/Registration/CustomerRegistration";
import StaffRegistration from "./pages/Registration/StaffRegistration";
import ViewFlights from "./pages/ViewFlights/ViewFlights";
import CreateFlight from "./pages/Staff/CreateFlight";
import AddAirport from "./pages/Staff/AddAirport";
import AddPlane from "./pages/Staff/AddPlane";
import ChangeFlightStatus from "./pages/Staff/ChangeFlightStatus";
import ViewCustomers from "./pages/Staff/ViewCustomers/ViewCustomers";
import Revenue from "./pages/Staff/Revenue/Revenue";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/StaffRegistration", element: <StaffRegistration /> },
      { path: "/CustomerRegistration", element: <CustomerRegistration /> },
      { path: "/ViewFlights", element: <ViewFlights /> },
      { path: "/CreateFlight", element: <CreateFlight /> },
      { path: "/AddAirport", element: <AddAirport /> },
      { path: "/AddPlane", element: <AddPlane /> },
      { path: "/ChangeFlightStatus", element: <ChangeFlightStatus /> },
      { path: "/ViewCustomers", element: <ViewCustomers /> },
      { path: "/Revenue", element: <Revenue /> },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
