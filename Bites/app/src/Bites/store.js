export const initialValues = {
  data: [],
  currentPage: 1,
  rowsPerPage: 5,
  total: 0,
  fetchState: "loading",
  message: "",
  totalPages: 1,
};

export const actions = {
  SAVE: "SAVE",
  NEW: "NEW",
  CHANGE_PAGE: "CHANGE_PAGE",
  ERROR: "ERROR",
  REFRESH: "REFRESH",
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case actions.SAVE: {
      const totalPages = Math.ceil(parseInt(payload.total) / state.rowsPerPage);
      return {
        ...state,
        fetchState: "fetched",
        totalPages,
        ...payload,
      };
    }
    case actions.ERROR: {
      return {
        ...state,
        fetchState: "error",
        message: payload.message,
        totalPages: 1,
      };
    }
    case actions.NEW: {
      const newData = payload.data;
      let total = parseInt(state.total);
      let temp = [...state.data];
      const index = temp.findIndex((item) => item.ROWID === newData.ROWID);

      if (index === -1) {
        total += 1;
        if (temp.length >= state.rowsPerPage) {
          temp = temp.slice(0, state.rowsPerPage - 1);
        }
        temp = [{ ...newData }].concat(temp);
      } else {
        temp[index] = { ...newData };
      }
      const totalPages = Math.ceil(total / state.rowsPerPage);

      return {
        ...state,
        data: temp,
        fetchState: "fetched",
        total: total,
        totalPages,
      };
    }
    case actions.CHANGE_PAGE: {
      return {
        ...state,
        fetchState: "loading",
        currentPage: payload.newPage,
      };
    }
    case actions.REFRESH: {
      return {
        ...state,
        fetchState: "loading",
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
};

export default reducer;
