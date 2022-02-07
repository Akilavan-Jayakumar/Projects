import axios from "axios";
import React from "react";

import CreateToDo from "./createTodo";
import DeleteTodo from "./deleteTodo";
import Pagination from "./pagination";

//Reducer
import { reducer, initialValues } from "./store";
import Task from "./task";

const Body = () => {
  const deleteRef = React.useRef(null);
  const [state, dispatch] = React.useReducer(reducer, initialValues);

  const toggleCompleted = React.useCallback((event) => {
    dispatch({
      type: "TOGGLE_COMPLETED",
      payload: {
        completed: event.target.checked,
      },
    });
  }, []);
  const changePage = React.useCallback((newPage) => {
    dispatch({
      type: "CHANGE_PAGE",
      payload: {
        newPage,
      },
    });
  }, []);

  React.useEffect(() => {
    if (state.fetchState === "loading") {
      axios
        .get("/server/service/all", {
          params: {
            currentPage: state.currentPage,
            rowsPerPage: state.rowsPerPage,
            completed: state.completed,
          },
        })
        .then((response) => {
          const { data } = response.data;
          dispatch({
            type: "SAVE_TODOS",
            payload: {
              ...data,
            },
          });
        })
        .catch((err) => {
          console.log(err);
          dispatch({
            type: "ERROR",
          });
        });
    }
  }, [state.completed, state.currentPage, state.fetchState, state.rowsPerPage]);

  const deleteToDo = React.useCallback((ROWID) => {
    deleteRef.current(ROWID);
  }, []);
  return (
    <div className="flex-1 p-10 overflow-auto">
      <div className="container mx-auto flex flex-col space-y-5 h-full">
        <div className="flex justify-start items-center text-gray-700">
          {/* Switch */}
          <input
            type="checkbox"
            className="hidden"
            id="switch"
            checked={state.completed}
            onChange={toggleCompleted}
          />
          <label htmlFor="switch">
            <div className="switch-slider w-12 h-5 flex items-center bg-gray-400 rounded-full p-0 cursor-pointer">
              <div className="switch-dot w-6 h-6 rounded-full bg-gray-50 border shadow-xl transform duration-300 ease-in-out" />
            </div>
          </label>
          <p className="text-sm ml-1">Completed</p>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex-1 py-3 ">
            {state.fetchState === "loading" ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin border-x-8 w-12 h-12 border-x-indigo-600 border-y-8 rounded-full duration-300" />
              </div>
            ) : state.fetchState === "error" ? (
              <div className="flex justify-center items-center h-full">
                <p className="text-xl font-bold">
                  Some error occurred while fetching the data.
                </p>
              </div>
            ) : state.data.length ? (
              <div className="space-y-5 w-full">
                {state.data.map((item) => (
                  <Task key={item.ROWID} {...item} deleteToDo={deleteToDo} />
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-xl font-bold">
                  No data available in the server.
                </p>
              </div>
            )}
          </div>
          <Pagination
            currentPage={state.currentPage}
            total={state.total}
            rowsPerPage={state.rowsPerPage}
            changePage={changePage}
          />
          <CreateToDo dispatch={dispatch} />
          <DeleteTodo dispatch={dispatch} deleteRef={deleteRef} />
        </div>
      </div>
    </div>
  );
};

export default Body;
