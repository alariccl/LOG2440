import { PiNumberCircleOneFill } from "react-icons/pi";
import { Link } from "react-router-dom";
import "./header.css";
import { useContext } from "react";
import { ReservationContext } from "../context/reservation-context";

const Header = () => {
  const { state }  = useContext(ReservationContext);
  const isReservationStarted = state?.isReservationStarted;

  return (
    <header className="homepage-header">
      <Link to="/" className="homepage-link">
        <h1 className="homepage-title">PolyCourt</h1>
      </Link>
      <div className="link-container">
        <Link to="/reservation" className="reservation-link">
          {isReservationStarted && (
            <PiNumberCircleOneFill className="notification" />
          )}
          Réserver
        </Link>
      </div>
    </header>
  );
};

export default Header;
