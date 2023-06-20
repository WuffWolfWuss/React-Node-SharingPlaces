import classes from "./UserItem.module.css";
import { Link } from "react-router-dom";
import Avatar from "../../shared/components/UI/Avatar";
import Card from "../../shared/components/UI/Card";

const UserItem = (props) => {
  return (
    <li className={classes.useritem}>
      <Card>
        <Link to={`/${props.user.id}/places`}>
          <div className={classes.useritem__image}>
            <Avatar
              image={
                props.user.image ||
                "https://pbs.twimg.com/media/Fail1REXgAAaFtC?format=jpg&name=large"
              }
              alt={props.user.name}
            ></Avatar>
          </div>
          <div className={classes.useritem__info}>
            <h2>{props.user.name}</h2>
            <h3>
              {props.user.places.length}{" "}
              {props.user.places.length === 1 ? "Place" : "Places"}{" "}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
