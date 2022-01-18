import React from "react";

import axios from "axios";

import Food from "Icons/food";
import ChevronLeft from "Icons/chevronLeft";
import ChevronRight from "Icons/chevronRight";

import AppInfo from "./appInfo";
import Restaurant from "./restaurant";
import LikesVisit from "./likesVisit";
import EditRestaurant from "./editRestaurant";
import CreateRestaurant from "./createRestaurant";
import DeleteRestaurant from "./deleteRestaurant";
import reducer, { initialValues, actions as reducerActions } from "./store";

import { generate } from "shortid";


const Demo = () => {
  const actions = React.useRef({
    delete: null,
    create: null,
    edit: null,
  });

  const [state, dispatch] = React.useReducer(reducer, initialValues);

  //---------------------useEffect ----------

  React.useEffect(() => {
    if (state.fetchState === "loading") {
      axios
        .get("/server/service/all", {
          params: {
            rowsPerPage: state.rowsPerPage,
            currentPage: state.currentPage,
          },
        })
        .then((response) => {
          const { code, data } = response.data;
          if (code === 2000) {
            dispatch({
              type: reducerActions.SAVE,
              payload: {
                ...data,
              },
            });
          } else if (code === 4004) {
            dispatch({
              type: reducerActions.ERROR,
              payload: {
                message: "No data available in the server.",
              },
            });
          }
        })
        .catch((err) => {
          console.log(err);
          dispatch({
            type: reducerActions.ERROR,
            payload: {
              message: "Some error occurred while fetching the server.",
            },
          });
        });
    }
  }, [state.currentPage, state.fetchState, state.rowsPerPage]);

  // ---------------Functions ---------------
  const copyActions = React.useCallback((key, value) => {
    actions.current[key] = value;
  }, []);

  const performActions = React.useCallback(({ action, restaurant_id }) => {
    actions.current[action](restaurant_id);
  }, []);

  const createRestaurant = React.useCallback(() => {
    actions.current["create"]();
  }, []);

  const changePage = React.useCallback((event) => {
    const newPage = parseInt(event.currentTarget.getAttribute("data-page"));

    dispatch({
      type: reducerActions.CHANGE_PAGE,
      payload: {
        newPage,
      },
    });
  }, []);

  return (
    <div className="w-screen min-w-[900px] h-screen">
      <div className="h-16 flex items-center p-4 border-b-2 space-x-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-7 h-7"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            fill="currentColor"
            d="M4.222 3.808l6.717 6.717-2.828 2.829-3.89-3.89a4 4 0 0 1 0-5.656zm10.046 8.338l-.854.854 7.071 7.071-1.414 1.414L12 14.415l-7.071 7.07-1.414-1.414 9.339-9.339c-.588-1.457.02-3.555 1.62-5.157 1.953-1.952 4.644-2.427 6.011-1.06s.892 4.058-1.06 6.01c-1.602 1.602-3.7 2.21-5.157 1.621z"
          />
        </svg>
        <p className="text-2xl font-bold text-navyblue-900">Bites</p>

        <AppInfo />
      </div>

      <div className="my-10 mx-16">
        <div className="grid grid-cols-5 gap-x-4 gap-y-2">
          <div className="col-span-5 row-span-1 bg-navyblue-800 text-white flex items-center h-72">
            <div className="flex-1 px-5 py-3 flex items-start justify-start flex-col ">
              <p className="text-7xl my-3">
                Eat, Drink & Enjoy With Your Family.
              </p>
              <LikesVisit />
            </div>
            <Food className="w-[20rem] h-[20rem] px-5" />
          </div>
          <div className="row-span-1 col-span-5">
            <div className="flex w-full p-1 space-x-1">
              <p className="text-navyblue-900 text-xl font-bold flex-1">
                Restaurants
              </p>

              <button
                className="px-2 py-1.5 text-gray-50 bg-navyblue-800 rounded flex items-center hover:bg-navyblue-900 shadow-xl"
                onClick={createRestaurant}
              >
                Add Your Favourite Restaurant
              </button>
            </div>
          </div>
          {state.fetchState === "loading" ? (
            <div className="col-span-5 row-span-1 flex justify-center items-center h-[23.5rem]">
              <div className="animate-spin">
                <div className="w-10 h-10 rounded-full border-[6px] border-x-navyblue-900 border-y-gray-300" />
              </div>
            </div>
          ) : state.fetchState === "error" ? (
            <div className="col-span-5 row-span-1 flex justify-center items-center h-[23.5rem]">
              <p className="text-lg font-semibold">{state.message}</p>
            </div>
          ) : (
            state.data.map((item) => (
              <Restaurant
                restaurant={item}
                key={item.ROWID}
                performActions={performActions}
              />
            ))
          )}
          <div className="col-span-5">
            <div className="flex items-center mt-2">
              <button
                className="text-navyblue-900 bg-indigo-100 rounded-full p-1 mx-1 disabled:cursor-not-allowed disabled:text-indigo-300"
                disabled={!state.totalPages || state.currentPage <= 1}
                data-page={parseInt(state.currentPage) - 1}
                title="prev"
                onClick={changePage}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {new Array(state.totalPages).fill(1).map((_, index) => {
                if (index + 1 === parseInt(state.currentPage)) {
                  return (
                    <button
                      key={generate()}
                      className="text-white bg-navyblue-900 rounded-full p-1 mx-1 h-6 w-6 flex items-center justify-center font-medium"
                      data-page={index + 1}
                      onClick={changePage}
                    >
                      {index + 1}
                    </button>
                  );
                } else {
                  return (
                    <button
                      className="p-1 mx-1 h-6 w-6 flex items-center justify-center rounded-full font-medium hover:text-navyblue-900 hover:bg-indigo-100"
                      data-page={index + 1}
                      onClick={changePage}
                    >
                      {index + 1}
                    </button>
                  );
                }
              })}

              <button
                className="text-navyblue-900 bg-indigo-100 rounded-full p-1 mx-1 disabled:cursor-not-allowed disabled:text-indigo-300"
                disabled={state.currentPage >= state.totalPages}
                title="next"
                data-page={parseInt(state.currentPage) + 1}
                onClick={changePage}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <EditRestaurant copyActions={copyActions} dispatch={dispatch} />
      <CreateRestaurant copyActions={copyActions} dispatch={dispatch} />
      <DeleteRestaurant copyActions={copyActions} dispatch={dispatch} />
    </div>
  );
};

export default Demo;
