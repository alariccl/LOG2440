import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Popup from "../components/popup";
import { useReservationSystem } from "../hooks/useReservationSystem";
import images from "../utils/imageSource";
import "./plateau.css";
import Calendar from "../components/calendar";

/**
 * done : Compléter l'affichage des informations du plateau et l'affichage du calendrier
 * @returns {JSX.Element} Page d'un plateau spécifique
 */
function PlateauPage() {
  const { plateauId } = useParams();
  const { plateaus } = useReservationSystem();
  const [isOpen, setIsOpen] = useState(false);
  const imageSrc = images[plateauId];
  const [displayedReservation, setDisplayedReservation] = useState(null);

  const plateau = plateaus.find((p) => p.id === plateauId);

  const togglePopup = (reservation) => {
    setDisplayedReservation(reservation);
    setIsOpen(!isOpen);
  };

  if (!plateau) {
    return;
  }

  return (
    <div className="facility-container">
      <div className="info-container">
        <div className="facility-image">
          {/* Done : Afficher le nom, description et capacité du plateau */}
          <img src={imageSrc} alt="Basketball Court" />
          <div className="plateau-info">
          <h2>{plateau.name}</h2>
            <p>{plateau.description}</p>
            <p>{`Capacité maximale : ${plateau.maxCapacity}`}</p>
            <div className="reservation-link">
              <Link to={`/reservation/${plateau.id}`} className="reserve-btn">Réserver</Link>
            </div>
          </div>
        </div>
        <div className="calendar-container">
          {/* done : Afficher le calendrier et lui donner la fonction de fermeture */}
          <Calendar togglePopup={togglePopup} plateauName={plateau.name} />
        </div>
      </div>
      {isOpen && (
        // done : Charger les informations de la réservation dans le popup
        <Popup
          reservationId={displayedReservation._id}
          content={
            <div>
              <p>Plateau : {plateau.name}</p>
              <p>Client : {displayedReservation.clientName}</p>
            </div>
          }
          handleClose={togglePopup}
        />
      )}
    </div>
  );
}

export default PlateauPage;
