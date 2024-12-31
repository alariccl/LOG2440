import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { useReservationSystem } from "../hooks/useReservationSystem";
import { ReservationContext } from "../context/reservation-context";
import { availableTimes } from "../utils/timeConvert";
import { RESET_RESERVATION, UPDATE_RESERVATION } from "../reducers/reservation-reducer";
import { days } from "../utils/constants";
import { convertToTimestamp } from "../utils/timeConvert";
import "./reservation.css";

function ReservationPage() {
  const { selectedPlateau } = useParams();
  const { plateaus, items, error, createReservation } = useReservationSystem();
  const { state, dispatch } = useContext(ReservationContext);
  const [name, setName] = useState(state.currentReservation.name);
  const [plateau, setPlateau] = useState(selectedPlateau || state.currentReservation.plateau);
  const [equipment, setEquipment] = useState(state.currentReservation.equipment);
  const [day, setDay] = useState(state.currentReservation.day);
  const [startTime, setStartTime] = useState(state.currentReservation.startTime);
  const [endTime, setEndTime] = useState(state.currentReservation.endTime);
  const [errorMessage, setErrorMessage] = useState("");

  const uniquePlateaus = Array.from(new Set(plateaus.map((p) => p.id)))
  .map((id) => plateaus.find((p) => p.id === id));

  const getAllowedEquipment = () => {
    const selectedPlateau = plateaus.find((p) => p.id === plateau);
    return selectedPlateau?.allowedItems.map((itemId) =>
      items.find((item) => item.id === itemId)
    ) || [];
  };

  if (!state || !plateaus || !items) {
    return <div>Loading...</div>;
  }

  const handleNameChange = (event) => {
    const newName = event.target.value;
    setName(newName);
    dispatch({
      type: UPDATE_RESERVATION,
      payload: { name: newName, plateau, equipment, day, startTime, endTime }, 
    });
  };

  const handlePlateauChange = (event) => {
    const newPlateau = event.target.value;
    setPlateau(newPlateau);
    dispatch({
      type: UPDATE_RESERVATION,
      payload: { name, plateau: newPlateau, equipment, day, startTime, endTime },
    });
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    const newEquipment = checked
      ? [...equipment, value]
      : equipment.filter((item) => item !== value);
    setEquipment(newEquipment);
    dispatch({
      type: UPDATE_RESERVATION,
      payload: { name, plateau, equipment: newEquipment, day, startTime, endTime }, 
    });
  };

  const handleDayChange = (event) => {
    const newDay = event.target.value;
    setDay(newDay);
    dispatch({
      type: UPDATE_RESERVATION,
      payload: { name, plateau, equipment, day: newDay, startTime, endTime }, 
    });
  };

  const handleStartTimeChange = (event) => {
    const newTime = event.target.value;
    setStartTime(newTime);
    dispatch({
      type: UPDATE_RESERVATION,
      payload: { name, plateau, equipment, day, startTime: newTime, endTime }, 
    });
  };

  const handleEndTimeChange = (event) => {
    const newTime = event.target.value;
    setEndTime(newTime);
    dispatch({
      type: UPDATE_RESERVATION,
      payload: { name, plateau, equipment, day, startTime, endTime: newTime },
    });
  };

  const handleReservation = async () => {
    // done : Vérifier que tous les champs sont remplis et afficher un message d'erreur si ce n'est pas le cas
    if (!name || !plateau) {
      setErrorMessage("Veuillez remplir tous les champs");
      return;
    }

    const startDateTime = convertToTimestamp(day, startTime);
    const endDateTime = convertToTimestamp(day, endTime);

    // done : Vérifier que l'heure de fin est après l'heure de début et afficher un message d'erreur si ce n'est pas le cas
    
    if (endDateTime <= startDateTime) {
      setErrorMessage("L'heure de fin doit être après l'heure de début");
      return;
    }

    try {
      await createReservation({ clientName: name, plateauId: plateau, itemIds: equipment, startTime: startDateTime, endTime: endDateTime });
      alert(`Réservation effectuée avec succès!`);
      setErrorMessage("");
      handleReset();
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  /**
   * done : Réinitialiser le formulaire et l'état de la réservation en cours
   */
  const handleReset = () => {
    setName("");
    setPlateau("");
    setEquipment([]);
    setDay("");
    setStartTime("");
    setEndTime("");
    // done : Réinitialiser l'état de la réservation en cours
    dispatch({
      type: RESET_RESERVATION, isReservationStarted: false,
    });

  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="reservation-container">
      <div className="reservation-form">
        <h2>Réserver un plateau</h2>
        <div className="flex-container">
          <div className="form-field">
            <label htmlFor="name">Votre nom</label>
            <input type="text" id="name" value={name} onChange={handleNameChange} placeholder="Entrez votre nom" />
          </div>
          <div className="form-field">
            <label htmlFor="plateau">Plateau</label>
            <select id="plateau" value={plateau} onChange={handlePlateauChange}>
              <option value="">Sélectionner un plateau</option>
              {uniquePlateaus.map((plateau) => (<option key={plateau.id} value={plateau.id}>{plateau.name}</option>))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="day">Jour</label>
            <select id="day" value={day} onChange={handleDayChange}>
              <option value="">Sélectionnez un jour</option>
              {days.map((d) => (<option key={d} value={d}> {d} </option>))}
            </select>
          </div>
        </div>

        <div className="flex-container">
          <div className="form-field">
            <label htmlFor="time">Heure de début</label>
            <select id="time" value={startTime} onChange={handleStartTimeChange}>
              <option value="">Sélectionnez une heure de début</option>
              {availableTimes.map((t) => (<option key={t} value={t}> {t} </option>))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="time">Heure de fin</label>
            <select id="time" value={endTime} onChange={handleEndTimeChange}>
              <option value="">Sélectionnez une heure de fin</option>
              {availableTimes.map((t) => (<option key={t} value={t}> {t} </option>))}
            </select>
          </div>
        </div>

        {getAllowedEquipment()?.length > 0 && (
          <div className="form-field">
            <label htmlFor="equipment">Équipement</label>
            <div className="checkbox-group">
              {getAllowedEquipment()?.map((item) => (
                <label key={item.id} className="checkbox-label">
                  <input className="checkbox" type="checkbox" value={item.id} checked={equipment.includes(item.id)} onChange={handleCheckboxChange} />
                  {item.name}
                </label>
              ))}
            </div>
          </div>
        )}

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className="action-buttons">
          <button className="reserve-btn" onClick={handleReservation}> Réserver </button>
          <button className="reset-btn" onClick={handleReset}> Réinitialiser </button>
        </div>
      </div>
    </div>
  );
}

export default ReservationPage;