import axios from "axios";

import React from "react";
import PropTypes from "prop-types";

import areEqual from "Utils/areEqual";

import Info from "Icons/info";
import Close from "Icons/close";

import { actions } from "./store";

let snackbarId = {
  display: "",
  reset: "",
};
const DeleteRestaurant = ({ copyActions, dispatch }) => {
  const details = React.useRef("");

  const [open, setOpen] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    error: false,
    message: "",
  });
  const [deleting, setDeleting] = React.useState(false);

  const closeSnackbar = React.useCallback(() => {
    if (snackbarId.display) {
      clearTimeout(snackbarId.display);
    }
    if (snackbarId.reset) {
      clearTimeout(snackbarId.reset);
    }
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
    snackbarId.reset = setTimeout(() => {
      setSnackbar((prev) => ({
        ...prev,
        error: false,
        message: "",
      }));
    }, 300);
  }, []);

  const deleteRecord = React.useCallback(() => {
    setDeleting(true);
    axios
      .delete(`/server/service/${details.current}`)
      .then((response) => {
        const { code } = response.data;
        if (code === 2000) {
          dispatch({
            type: actions.REFRESH,
          });
          setOpen(false);
          setSnackbar({
            open: true,
            error: false,
            message: "Restaurant has been deleted successfully",
          });
          if (snackbarId.display) {
            clearTimeout(snackbarId.display);
          }
          if (snackbarId.reset) {
            clearTimeout(snackbarId.reset);
          }

          snackbarId.display = setTimeout(() => {
            setSnackbar((prev) => ({
              ...prev,
              open: false,
            }));
            snackbarId.reset = setTimeout(() => {
              setSnackbar((prev) => ({
                ...prev,
                error: false,
                message: "",
              }));
            }, 300);
          }, 3000);
        }
      })
      .catch((err) => {
        console.log(err);
        setDeleting(false);
        setSnackbar({
          open: true,
          error: true,
          message: "Some error occurred, unable to perform the operation.",
        });
        if (snackbarId.display) {
          clearTimeout(snackbarId.display);
        }
        if (snackbarId.reset) {
          clearTimeout(snackbarId.reset);
        }

        snackbarId.display = setTimeout(() => {
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }));
          snackbarId.reset = setTimeout(() => {
            setSnackbar((prev) => ({
              ...prev,
              error: false,
              message: "",
            }));
          }, 300);
        }, 3000);
      });
  }, [dispatch]);

  React.useEffect(() => {
    return () => {
      if (snackbarId.display) {
        clearTimeout(snackbarId.display);
      }
      if (snackbarId.reset) {
        clearTimeout(snackbarId.reset);
      }
    };
  }, []);
  React.useEffect(() => {
    const openDialog = (ROWID) => {
      setOpen(true);
      setDeleting(false);
      details.current = ROWID;
    };
    copyActions("delete", openDialog);
  }, [copyActions]);

  const closeDialog = React.useCallback(() => {
    setOpen(false);
  }, []);
  return (
    <div>
      {open && (
        <div
          className={`bg-black bg-opacity-50 absolute inset-0 flex justify-center items-center`}
        >
          <div className="bg-white px-4 py-3 rounded max-w-lg">
            <div className="flex justify-between items-center mt-3">
              <p className="text-2xl font-bold">Confirm Delete ?</p>
              <button
                className="p-1 hover:rounded-full  hover:bg-gray-200"
                onClick={closeDialog}
              >
                <Close className="w-5 h-5" />
              </button>
            </div>
            <div className="text-md mt-5">
              <p>
                The details associated with this restaurant will be deleted and
                this operation cannot be undone. Are you sure you want to
                perform this operation ?
              </p>
            </div>
            <div className="flex justify-end items-center space-x-3 mt-4">
              <button
                className="py-1 px-2 hover:text-red-900 hover:bg-red-300 hover:bg-opacity-25 rounded"
                onClick={closeDialog}
              >
                Close
              </button>
              <button
                className="py-1 px-2 text-gray-50 bg-red-600 rounded hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
                onClick={deleteRecord}
                disabled={snackbar.error || deleting}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {snackbar.open && (
        <div className="absolute bottom-5 w-full flex justify-center items-center">
          <div
            className={` p-2 rounded space-x-2 flex items-center ${
              snackbar.error
                ? "text-red-700 bg-red-50"
                : "text-navyblue-900 bg-indigo-50"
            }`}
          >
            <Info className="h-6 w-6" />
            <p>{snackbar.message}</p>
            <button
              className={`p-1 ${
                snackbar.error ? "hover:bg-red-100" : "hover:bg-indigo-100"
              } rounded-full`}
              onClick={closeSnackbar}
            >
              <Close className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

DeleteRestaurant.propTypes = {
  copyActions: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default React.memo(DeleteRestaurant, areEqual);
