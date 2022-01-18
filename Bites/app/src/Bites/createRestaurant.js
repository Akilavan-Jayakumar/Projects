import axios from "axios";

import React from "react";
import PropTypes from "prop-types";

import Info from "Icons/info";
import Close from "Icons/close";

import { useForm } from "react-hook-form";
import validator from "validator";

import { actions } from "./store";

import areEqual from "Utils/areEqual";

const labelClass = "font-medium block mb-1";
const inputClass = `form-input border-[1px] border-neutral-600 w-full focus:border-navyblue-700 focus:border-[2px] focus:ring-transparent resize-none px-2 py-1.5 rounded focus:outline-none`;
const errorInputClass = `form-input border-[1px] border-red-600 w-full focus:border-red-700 focus:ring-transparent focus:border-[2px] px-2 py-1.5 focus:outline-none rounded `;
const textareaClass = `form-textarea border-[1px] border-neutral-600 w-full focus:border-navyblue-700 focus:border-[2px] focus:ring-transparent resize-none px-2 py-1.5 rounded focus:outline-none`;
const errorTextareaClass = `form-textarea border-[1px] border-red-600 w-full focus:border-red-600 focus:border-red-700 focus:border-2 focus:ring-transparent resize-none focus:outline-none px-2 py-1.5 rounded`;
const selectClass = `form-select border-[1px] appearance-none w-full rounded  border-neutral-600 focus:border-2 focus:ring-transparent  focus:border-navyblue-900  px-2 py-1.5`;
const errorSelectClass = `"form-select border-[1px] appearance-none w-full rounded  border-red-600 focus:border-2 focus:ring-transparent focus:border-red-600 focus:border-b-red-700  px-2 py-1.5"`;

const FILE_LIMIT = 5000000;

let snackbarId = {
  display: "",
  reset: "",
};

const CreateRestaurant = ({ copyActions, dispatch }) => {
  const subRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [create, setCreate] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    error: false,
    message: "",
  });

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
  const closeDialog = React.useCallback(() => {
    setOpen(false);
  }, []);
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      rating: "",
      city: "",
      country: "",
      coordinates: "",
      image: "",
    },
    shouldUnregister: true,
  });

  React.useEffect(() => {
    const openDialog = () => {
      setOpen(true);
      setCreate(false);
    };
    copyActions("create", openDialog);
  }, [copyActions]);

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
  const submitForm = React.useCallback(() => {
    subRef.current.click();
  }, []);

  const save = React.useCallback(
    (data) => {
      if (!data.name) {
        setError("name", {
          type: "manual",
          message: "Name cannot be empty.",
        });
        return;
      }
      if (!data.description) {
        setError("description", {
          type: "manual",
          message: "Description cannot be empty.",
        });
        return;
      }
      if (!data.rating) {
        setError("rating", {
          type: "manual",
          message: "Rating cannot be empty.",
        });
        return;
      }
      if (!data.city) {
        setError("city", {
          type: "manual",
          message: "City cannot be empty.",
        });
        return;
      }
      if (!data.country) {
        setError("country", {
          type: "manual",
          message: "Country cannot be empty.",
        });
        return;
      }
      if (!data.coordinates) {
        setError("coordinates", {
          type: "manual",
          message: "Coordinates cannot be empty.",
        });
        return;
      }
      if (!validator.isLatLong(data.coordinates)) {
        setError("coordinates", {
          type: "manual",
          message: "Invalid coordinates.",
        });
        return;
      }

      if (!data.image) {
        setError("image", {
          type: "manual",
          message: "Select an image",
        });
        return;
      }
      if (data.image[0].size > FILE_LIMIT) {
        setError("image", {
          type: "manual",
          message: "Image size should be less than 5MB",
        });
        return;
      }

      const formData = new FormData();

      for (const [key, value] of Object.entries(data)) {
        if (key === "image") {
          formData.append(key, value[0]);
        } else {
          formData.append(key, value);
        }
      }

      setCreate(true);
      axios({
        method: "POST",
        url: "/server/service/create",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((response) => {
          const { code, data: record } = response.data;
          if (code === 2000) {
            dispatch({
              type: actions.NEW,
              payload: {
                data: { ...record },
              },
            });
            setOpen(false);
            setSnackbar({
              open: true,
              error: false,
              message: "Restaurant has been created successfully",
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
          setCreate(false);
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
    },
    [dispatch, setError]
  );

  return (
    <div>
      {open && (
        <div
          className={`absolute bg-black bg-opacity-50 inset-0 flex items-center justify-center`}
        >
          <div className="bg-white px-4 py-3 rounded max-w-3xl w-full">
            <div className="flex justify-between items-center mt-3">
              <p className="text-2xl font-bold">Create</p>
              <button
                className="p-1 hover:rounded-full  hover:bg-gray-200"
                onClick={closeDialog}
              >
                <Close className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 px-2">
              <form autoComplete="off" onSubmit={handleSubmit(save)}>
                <div className="mb-5">
                  <label className={labelClass} htmlFor="name">
                    Name
                  </label>
                  <input
                    id="name"
                    {...register("name")}
                    className={
                      Boolean(errors.name) ? errorInputClass : inputClass
                    }
                  />
                  <p className="mt-1 pl-1 text-red-700 text-sm font-medium">
                    {errors.name ? errors.name.message : ""}
                  </p>
                </div>
                <div className="mb-4">
                  <label className={labelClass} htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    className={
                      Boolean(errors.description)
                        ? errorTextareaClass
                        : textareaClass
                    }
                    rows="5"
                    {...register("description")}
                  />
                  <p className="mt-1 pl-1 text-red-700 text-sm font-medium">
                    {errors.description ? errors.description.message : ""}
                  </p>
                </div>
                <div className="grid grid-flow-row-dense grid-rows-1 grid-cols-3 space-x-4">
                  <div className="mb-4">
                    <label className={labelClass} htmlFor="rating">
                      Rating
                    </label>
                    <select
                      id="rating"
                      {...register("rating")}
                      className={
                        Boolean(errors.rating) ? errorSelectClass : selectClass
                      }
                    >
                      <option value="1">1 Star</option>
                      <option value="2">2 Star</option>
                      <option value="3">3 Star</option>
                      <option value="4">4 Star</option>
                      <option value="5">5 Star</option>
                    </select>
                    <p className="mt-1 pl-1 text-red-700 text-sm font-medium">
                      {errors.rating ? errors.rating.message : ""}
                    </p>
                  </div>
                  <div className="mb-4">
                    <label className={labelClass} htmlFor="city">
                      City
                    </label>
                    <input
                      id="city"
                      {...register("city")}
                      className={
                        Boolean(errors.city) ? errorInputClass : inputClass
                      }
                    />
                    <p className="mt-1 pl-1 text-red-700 text-sm font-medium">
                      {errors.city ? errors.city.message : ""}
                    </p>
                  </div>
                  <div className="mb-4">
                    <label className={labelClass} htmlFor="country">
                      Country
                    </label>
                    <input
                      id="country"
                      {...register("country")}
                      className={
                        Boolean(errors.country) ? errorInputClass : inputClass
                      }
                    />
                    <p className="mt-1 pl-1 text-red-700 text-sm font-medium">
                      {errors.country ? errors.country.message : ""}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <label className={labelClass} htmlFor="coordinates">
                    Coordinates
                  </label>
                  <input
                    id="coordinates"
                    {...register("coordinates")}
                    className={
                      Boolean(errors.coordinates) ? errorInputClass : inputClass
                    }
                  />
                  <p
                    className={`mt-1 pl-1 ${
                      Boolean(errors.coordinates) ? "text-red-700" : ""
                    } text-sm font-medium`}
                  >
                    {errors.coordinates
                      ? errors.coordinates.message
                      : "Latitude, Longitude"}
                  </p>
                </div>
                <div className="mb-4">
                  <label className={labelClass} htmlFor="image">
                    Image
                  </label>
                  <input
                    type="file"
                    id="image"
                    {...register("image")}
                    className={
                      Boolean(errors.image) ? errorInputClass : inputClass
                    }
                    accept=".png,.jpg"
                  />
                  <p className="mt-1 pl-1 text-red-700 text-sm font-medium">
                    {errors.image ? errors.image.message : ""}
                  </p>
                </div>
                <input type="submit" className="hidden" ref={subRef} />
              </form>
            </div>

            <div className="flex justify-end items-center space-x-3 mt-4">
              <button
                className="py-1 px-2 hover:text-navyblue-900 hover:bg-navyblue-200 hover:bg-opacity-25 rounded"
                onClick={closeDialog}
              >
                Close
              </button>
              <button
                className="py-1 px-2 text-gray-50 bg-navyblue-800 rounded hover:bg-navyblue-900 disabled:bg-navyblue-700 disabled:bg-opacity-60 disabled:cursor-not-allowed"
                onClick={submitForm}
                disabled={create || snackbar.error}
              >
                Save
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

CreateRestaurant.propTypes = {
  copyActions: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default React.memo(CreateRestaurant, areEqual);
