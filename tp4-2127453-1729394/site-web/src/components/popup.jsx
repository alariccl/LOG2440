import { useReservationSystem } from "../hooks/useReservationSystem";
import "./popup.css";
import { useNavigate } from "react-router-dom"; // rajout pour bonus

/**
 * done : Compléter la composante pour permettre l'annulation d'une réservation.
 * @param {string} reservationId : identifiant de la réservation à annuler
 * @param {HTMLElement} content : contenu du popup sous forme de contenu HTML arbitraire
 * @param {Function} handleClose : fonction à appeler pour fermer le popup 
 * @returns {JSX.Element} : Popup pour annuler une réservation
 */
const Popup = ({ reservationId, content, handleClose }) => {
  const { cancelReservation, error } = useReservationSystem();
  const navigate = useNavigate(); // rajout pour bonus

  const handleModify = () => { // rajout pour bonus
    navigate(`/reservation/${reservationId}`);
  };
  // DONE : envoyer une requête pour annuler la réservation.
  // Recharger la page après une annulation réussie.
  const handleCancel = async () => {
    await cancelReservation(reservationId);
    window.location.reload();
  };

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="title-container">
          <h2>Réservation</h2>
          <button className="close-btn" onClick={handleClose}> &times; </button>
        </div>
        {content}
        <div className="button-group">
          <button className="modify-btn" onClick={handleModify}>Modifier</button> {/* rajout pour bonus */}
          <button className="cancel-btn" onClick={handleCancel}>Annuler</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
