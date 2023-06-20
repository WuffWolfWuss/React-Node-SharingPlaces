import { NavLink } from "react-router-dom";
import classes from "./Navigation.module.css";

import { useContext } from "react";
import { AuthContext } from "../context/auth-context";

const MainNavigation = () => {
  const ctx = useContext(AuthContext);
  return (
    <header className={classes.header}>
      <nav>
        <ul className={classes.list}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              end
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/events"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              All users
            </NavLink>
          </li>
          {ctx.isLoggedIn && (
            <li>
              <NavLink
                to={`/${ctx.userId}/places`}
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                My Places
              </NavLink>
            </li>
          )}
          {ctx.isLoggedIn && (
            <li>
              <NavLink
                to="/places/new"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                Add Places
              </NavLink>
            </li>
          )}
          {!ctx.isLoggedIn && (
            <li>
              <NavLink
                to="/auth"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                Authenticate
              </NavLink>
            </li>
          )}
          {ctx.isLoggedIn && (
            <li>
              <NavLink onClick={ctx.logout}>Logout</NavLink>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};
export default MainNavigation;
