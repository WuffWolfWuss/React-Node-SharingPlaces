import { useState, useCallback, memo } from "react";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import "./Map.css";

const Map = (prop) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: `Your google map Api key`,
  });
  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerClassName="map"
      center={prop.center}
      zoom={prop.zoom}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {<MarkerF position={prop.center} />}
      <></>
    </GoogleMap>
  ) : (
    <></>
  );
};

export default memo(Map);
