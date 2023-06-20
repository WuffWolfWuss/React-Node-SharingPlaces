import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./NewPlace.css";
import Input from "../../shared/components/UI/Input";
import Button from "../../shared/components/UI/Button";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/components/util/validators";
import { useForm } from "../../shared/components/hooks/form-hook";
import { useHttpClient } from "../../shared/components/hooks/http-hook";
import { AuthContext } from "../../shared/components/context/auth-context";
import ErrorModal from "../../shared/components/UI/ErrorModal";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";

const NewPlaces = () => {
  const navigate = useNavigate();
  const ctx = useContext(AuthContext);
  const { isLoading, error, sendReq, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    //console.log(formState.inputs);
    try {
      await sendReq(
        "http://localhost:5000/",
        "POST",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          address: formState.inputs.address.value,
          creator: ctx.userId,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      //redirect
      navigate("/");
    } catch (err) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <form className="place-form" onSubmit={placeSubmitHandler}>
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          onInput={inputHandler}
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Invalid title."
        />
        <Input
          id="address"
          element="input"
          type="text"
          label="Address"
          onInput={inputHandler}
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Invalid address."
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          onInput={inputHandler}
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Description atleast 5 characters."
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </>
  );
};

export default NewPlaces;
