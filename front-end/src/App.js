import React, { useState, useCallback } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Users from "./user/pages/User";
import NewPlaces from "./places/pages/NewPlace";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import RootLayout from "./shared/components/UI/Root";
import Auth from "./user/pages/Auth";
import { AuthContext } from "./shared/components/context/auth-context";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <Navigate to="/" />,
    children: [
      { index: true, element: <Users /> },
      { path: "auth", element: <Auth /> },
      {
        path: "places",
        children: [
          { path: "new", element: <NewPlaces /> },
          { path: ":placeId", element: <UpdatePlace /> },
        ],
      },
      { path: ":userId/places", element: <UserPlaces /> },
    ],
  },
]);
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState();

  //use call back to avoid infinite loop
  const login = useCallback((uid) => {
    setIsLoggedIn(true);
    setUserId(uid);
  }, []);
  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
  }, []);
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <RouterProvider router={router} />;
    </AuthContext.Provider>
  );
}

export default App;
