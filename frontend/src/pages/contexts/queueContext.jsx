import { createContext, useReducer, useContext } from "react";

// Initial state: Two queues
const initialState = {
  next: [],
  prev: [],
};

// Reducer function for managing queue actions
const queueReducer = (state, action) => {
  switch (action.type) {
    case "ENQUEUE_1":
      return { ...state, next: [...state.next, action.payload] };
    case "DEQUEUE_1":
      return { ...state, next: state.next.slice(1) };
    case "CLEAR_1":
      return { ...state, next: [] };

    case "ENQUEUE_2":
      return { ...state, prev: [...state.prev, action.payload] };
    case "DEQUEUE_2":
      return { ...state, prev: state.prev.slice(1) };
    case "CLEAR_2":
      return { ...state, prev: [] };

    default:
      return state;
  }
};

// Create context
const QueueContext = createContext();

// QueueProvider component
export const QueueProvider = ({ children }) => {
  const [state, dispatch] = useReducer(queueReducer, initialState);

  // Queue 1 functions
  const enqueuenext = (item) => {dispatch({ type: "ENQUEUE_1", payload: item });}
  const dequeuenext = () => dispatch({ type: "DEQUEUE_1" });
  const clearnext = () => dispatch({ type: "CLEAR_1" });
  const peeknext = () => (state.next.length > 0 ? state.next[0] : null);
  const sizenext = () => state.next.length;

  // Queue 2 functions
  const enqueueprev = (item) => dispatch({ type: "ENQUEUE_2", payload: item });
  const dequeueprev = () => dispatch({ type: "DEQUEUE_2" });
  const clearprev = () => dispatch({ type: "CLEAR_2" });
  const peekprev = () => (state.prev.length > 0 ? state.prev[0] : null);
  const sizeprev = () => state.prev.length;

  return (
    <QueueContext.Provider
      value={{
        next: state.next,
        prev: state.prev,
        enqueuenext,
        dequeuenext,
        clearnext,
        peeknext,
        sizenext,
        enqueueprev,
        dequeueprev,
        clearprev,
        peekprev,
        sizeprev,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};

// Custom hook to use queue context
export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error("useQueue must be used within a QueueProvider");
  }
  return context;
};
