export const initialValues = {
  data: [],
  total: 0,
  currentPage: 0,
  rowsPerPage: 8,
  fetchState: "loading",
  completed: false,
};

export const reducer = (state, { type, payload }) => {
  switch (type) {
    case "SAVE_TODOS":
      return {
        ...state,
        ...payload,
        fetchState: "fetched",
      };
    case "TOGGLE_COMPLETED":
      return {
        ...state,
        completed: payload.completed,
        fetchState: "loading",
      };
    case "CHANGE_PAGE":
      return {
        ...state,
        currentPage: parseInt(payload.newPage),
        fetchState: "loading",
      };
    case "NEW_TODO": {
      const temp = [...state.data];
      return {
        ...state,
        completed: false,
        total: state.total + 1,
        data: [{ ...payload }].concat(temp.slice(0, state.rowsPerPage - 1)),
      };
    }
    case "REFRESH":
      return {
        ...state,
        fetchState: "loading",
      };
    case "ERROR":
      return {
        ...state,
        fetchState: "error",
      };
    default:
      new Error("Invalid Operation");
  }
};
