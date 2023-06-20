import { useState, useContext } from "react";
import Card from "../../shared/components/UI/Card";
import Button from "../../shared/components/UI/Button";
import Modal from "../../shared/components/UI/Modal";
import { AuthContext } from "../../shared/components/context/auth-context";
import { useHttpClient } from "../../shared/components/hooks/http-hook";

import Map from "../../shared/components/UI/Map";

import "./PlaceItem.css";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";

const PlaceItem = (props) => {
  const ctx = useContext(AuthContext);
  const { isLoading, sendReq } = useHttpClient();

  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setConfirmModal] = useState(false);
  const showMapHandler = () => setShowMap((prevState) => !prevState);
  const showDeleteHandler = () => setConfirmModal((prevState) => !prevState);

  const comfirmDeleteHandler = async () => {
    setConfirmModal(false);
    try {
      await sendReq(`http://localhost:5000/${props.place.id}`, "DELETE");
      props.onDelete(props.place.id);
    } catch (error) {}
  };
  return (
    <>
      <Modal
        show={showMap}
        onCancel={showMapHandler}
        header={props.place.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={showMapHandler}>Close</Button>}
      >
        <div className="map-container">
          {Map ? <Map center={props.place.location} zoom={16} /> : "MAP"}
        </div>
      </Modal>

      <Modal
        show={showConfirmModal}
        onCancel={showDeleteHandler}
        header="Comfirm?"
        footerClass="place-item__modal-actions"
        footer={
          <>
            <Button inverse onClick={showDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={comfirmDeleteHandler}>
              DELETE
            </Button>
          </>
        }
      >
        <p>Do you want to delete?</p>
      </Modal>

      <li className="place-item">
        <Card>
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img src={props.place.image} alt={props.place.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.place.title}</h2>
            <h3>{props.place.address}</h3>
            <p>{props.place.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={showMapHandler}>
              View on map
            </Button>
            {ctx.userId === props.place.creator && (
              <Button to={`/places/${props.place.id}`}>Edit</Button>
            )}
            {ctx.userId === props.place.creator && (
              <Button danger onClick={showDeleteHandler}>
                Delete
              </Button>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};

export default PlaceItem;
