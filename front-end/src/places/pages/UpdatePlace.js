import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Input from "../../shared/components/UI/Input";
import Button from "../../shared/components/UI/Button";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/components/util/validators";
import "./NewPlace.css";
import { useForm } from "../../shared/components/hooks/form-hook";
import { useHttpClient } from "../../shared/components/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import ErrorModal from "../../shared/components/UI/ErrorModal";

const UpdatePlace = () => {
  const navigate = useNavigate();
  const { isLoading, error, sendReq, clearError } = useHttpClient();
  const [loadedPlaces, setLoadedPlaces] = useState();
  const Id = useParams().placeId;
  //console.log(Id);

  //init value
  const [formState, inputHandle, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendReq(`http://localhost:5000/${Id}`);
        setLoadedPlaces(responseData.place);
        setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: true,
            },
            description: {
              value: responseData.place.description,
              isValid: true,
            },
          },
          true
        );
      } catch (error) {}
    };
    fetchPlace();
  }, [sendReq, Id, setFormData]);

  const Updatehandler = async (event) => {
    event.preventDefault();
    //console.log(formState.inputs);
    try {
      await sendReq(
        `http://localhost:5000/${Id}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      navigate("/"); //may changed to url of post
    } catch (error) {}
  };

  if (!loadedPlaces && !error) {
    return (
      <div className="center">
        <h2>No data available</h2>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={Updatehandler}>
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Invalid title."
          onInput={inputHandle}
          initialValue={loadedPlaces.title}
          initialValid={formState.inputs.title.isValid}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Invalid title."
          onInput={inputHandle}
          initialValue={formState.inputs.description.value}
          initialValid={formState.inputs.description.isValid}
        />
        <Button type="submit" disabled={!formState.isValid}>
          UPDATE
        </Button>
      </form>
    </>
  );
};

export default UpdatePlace;
