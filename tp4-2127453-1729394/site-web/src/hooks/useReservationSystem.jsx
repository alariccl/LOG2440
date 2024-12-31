import { useState, useEffect } from "react";

/**
 * @typedef {Object} Reservation
 * @property {string} clientName - Nom du client.
 * @property {string} plateauId - Id du plateau réservé.
 * @property {string[]} itemIds - Items à réserver
 * @property {number} startTime - Début de la réservation en millisecondes.
 * @property {number} endTime - Fin de la réservation en millisecondes.
 */

const API_BASE_URL = "http://localhost:5020";

export const useReservationSystem = () => {
  const [plateaus, setPlateaus] = useState([]);
  // done : Créer un état pour les réservations et les items
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState();
  const [items, setItems] = useState();


  // done : Récupérer les plateaux, les réservations et les items du serveur
  useEffect(() => {
    fetchPlateaus();
    fetchReservations();
    fetchItems();
  }, []);



  /**
   * Récupère les plateaux depuis le serveur
   */
  const fetchPlateaus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reservations/plateaus`);
      if (!response.ok) throw new Error("Failed to fetch plateaus");
      const data = await response.json();
      setPlateaus(data);
    } catch (err) {
      setError(err.message);
    }
  };

  /**
   * done : Récupérer les réservations depuis le serveur
   */
  const fetchReservations = async () => { 
    try {
      const response = await fetch(`${API_BASE_URL}/reservations`);
      if (!response.ok) throw new Error("Failed to fetch reservations");
      const data = await response.json();
      setReservations(data);
    } catch (err) {
      setError(err.message);
    }
  };

  /**
   * done : Récupérer les items depuis le serveur
   */
  const fetchItems = async () => { 
    try {
      const response = await fetch(`${API_BASE_URL}/reservations/items`);
      if (!response.ok) throw new Error("Failed to fetch items");
      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError(err.message);
    }
  };

  /**
   * Crée une réservation sur le serveur
   * @param {Reservation} reservationData - Données de la réservation
  */
  const createReservation = async (reservationData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservationData),
      });
      // done : Gérer le cas de conflit de réservation (status 409)
      if (response.status === 409)
        throw new Error("Conflit de réservation");

      if (!response.ok) throw new Error("Erreur lors de la réservation");
      return await response.json();
    } finally {
      setLoading(false);
    }
  };

  /**
   * Annule une réservation sur le serveur
   * @param {string} reservationId - Id de la réservation
   */
  const cancelReservation = async (reservationId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/reservations/${reservationId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to cancel reservation");
      await fetchReservations();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateReservation = async (reservationId, updatedData) => { // rajout pour bonus
    try {
      const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) throw new Error("Failed to update reservation");
      return await response.json();
    } catch (err) {
      throw new Error(err.message);
    }
  };

  return {
    plateaus,
    reservations,
    items,
    loading,
    error,
    createReservation,
    fetchReservations,
    cancelReservation,
    updateReservation,  // rajout pour bonus
  };
};
