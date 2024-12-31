// reservation-reducer.js
export const initialState = {
  currentReservation: {
    name: "",
    plateau: "",
    equipment: [],
    day: "",
    startTime: "",
    endTime: "",
  },
  isReservationStarted: false,
};

export const UPDATE_RESERVATION = "UPDATE_RESERVATION";
export const RESET_RESERVATION = "RESET_RESERVATION";

// done : Implémenter la gestion des 2 actions du Reducer
export const reservationReducer = (state, action) => {
  switch (action.type) {
    case UPDATE_RESERVATION:
      return {
        ...state,
        currentReservation: {
          ...state.currentReservation,
          ...action.payload,
        },
        isReservationStarted: true,
      };
    case RESET_RESERVATION:
      return {
        ...state,
        currentReservation: initialState.currentReservation,
        isReservationStarted: initialState.isReservationStarted,
      };
    default:
      return state;
  }
};
