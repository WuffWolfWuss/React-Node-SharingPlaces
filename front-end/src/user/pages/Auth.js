import { useState, useContext } from "react";
import { Navigate } from "react-router-dom";

import Input from "../../shared/components/UI/Input";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/components/util/validators";
import { useForm } from "../../shared/components/hooks/form-hook";
import Button from "../../shared/components/UI/Button";
import Card from "../../shared/components/UI/Card";
import ErrorModal from "../../shared/components/UI/ErrorModal";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import { useHttpClient } from "../../shared/components/hooks/http-hook";
import { AuthContext } from "../../shared/components/context/auth-context";

import "./Auth.css";

const Auth = () => {
  const ctx = useContext(AuthContext);
  const [loginMode, setLoginMode] = useState(true);
  const { isLoading, error, sendReq, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  if (ctx.isLoggedIn) {
    return <Navigate to="/" />;
  }

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (loginMode) {
      try {
        const responseData = await sendReq(
          "http://localhost:5000/api/user/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        ctx.login(responseData.user.id);
      } catch (err) {}
    } else {
      try {
        const responseData = await sendReq(
          "http://localhost:5000/api/user/signup",
          "POST",
          JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        ctx.login(responseData.user.id);
      } catch (err) {}
    }
  };

  const switchModeHandler = () => {
    //sign up to login -> drop name field
    if (!loginMode) {
      setFormData(
        { ...formState.inputs, name: undefined },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }
    setLoginMode((prevMode) => !prevMode);
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>{loginMode ? "Login" : "SIGNUP"}</h2>
        <hr></hr>
        <form onSubmit={authSubmitHandler}>
          {!loginMode && (
            <Input
              id="name"
              element="input"
              type="text"
              label="Your name"
              onInput={inputHandler}
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter your name"
            />
          )}
          <Input
            id="email"
            element="input"
            type="email"
            label="E-mail"
            onInput={inputHandler}
            validators={[VALIDATOR_EMAIL()]}
            errorText="Invalid email."
          />
          <Input
            id="password"
            element="input"
            type="text"
            label="Password"
            onInput={inputHandler}
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Password must atleast 6 characters."
          />
          <Button type="submit" disabled={!formState.isValid}>
            {loginMode ? "LOGIN" : "SIGNUP"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          {!loginMode ? "Switch to LOGIN" : "Swith to SIGNUP"}
        </Button>
      </Card>
    </>
  );
};

export default Auth;
