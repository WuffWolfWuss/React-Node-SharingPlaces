import PlaceList from "../components/PlaceList";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/components/hooks/http-hook";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";

const UserPlaces = (props) => {
  const params = useParams();
  const userId = params.userId;
  const [loadedPlaces, setLoadedPlaces] = useState();
  const { isLoading, sendReq } = useHttpClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await sendReq(`http://localhost:5000/user/${userId}`);
        setLoadedPlaces(response.places);
      } catch (err) {}
    };
    fetchData();
  }, [sendReq, userId]);
  //console.log(loadedPlaces);

  const placeDeleteHandler = (deletePlaceId) => {
    setLoadedPlaces((prevState) =>
      prevState.filter((place) => place.id !== deletePlaceId)
    );
  };
  return (
    <>
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && (
        <PlaceList items={loadedPlaces} onDeletePlace={placeDeleteHandler} />
      )}
    </>
  );
};

export default UserPlaces;
