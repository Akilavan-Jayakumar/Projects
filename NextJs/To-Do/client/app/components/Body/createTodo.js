import React from "react";

import axios from "axios";
//Icons
import Plus from "../../public/plus.svg";
import Close from "../../public/close.svg";

import moment from "moment";

import { useForm } from "react-hook-form";

const CreateToDo = ({ dispatch }) => {
  const submitRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      due_date: "",
    },
    shouldUnregister: true,
  });

  const openModal = React.useCallback(() => {
    setOpen(true);
    setSubmitting(false);
  }, []);

  const closeModal = React.useCallback(() => {
    setOpen(false);
  }, []);

  const saveTask = React.useCallback(
    (data) => {
      setSubmitting(true);
      axios
        .post("/server/service/create", {
          ...data,
          due_date: moment(data.due_date).format("YYYY-MM-DD"),
        })
        .then((response) => {
          dispatch({
            type: "NEW_TODO",
            payload: { ...response.data.data },
          });
          setOpen(false);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
    [dispatch]
  );
  return (
    <div>
      <div className="fixed bottom-5 right-5">
        <button
          className="p-1 rounded-full bg-indigo-600 text-gray-50 hover:bg-opacity-90"
          onClick={openModal}
        >
          <Plus className="h-12 w-12" />
        </button>
      </div>
      {open && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-gray-50 w-[35rem] h-[22rem] rounded shadow-xl p-5 flex flex-col space-y-3">
            {/* Header */}
            <div className="text-gray-800 flex items-center">
              <p className="text-2xl font-bold flex-1">New Task</p>
              <button
                className="p-1 rounded-full hover:bg-gray-100 hover:border-gray-200 border  border-transparent"
                onClick={closeModal}
              >
                <Close className="h-5 w-5" />
              </button>
            </div>
            {/* Body */}
            <form
              className="flex-1 space-y-5"
              onSubmit={handleSubmit(saveTask)}
            >
              <div className="space-y-0.5">
                <label className="text-sm text-gray-700">Title</label>
                <input
                  {...register("title", {
                    required: "Title cannot be empty",
                  })}
                  type="text"
                  className={`w-full rounded ${
                    errors.title?.message
                      ? "border-red-600 focus:ring-red-600 focus:border-red-600"
                      : "border-gray-300 focus:ring-indigo-600 focus:border-indigo-600"
                  }`}
                />
                <p className="text-xs text-red-600">{errors.title?.message}</p>
              </div>
              <div className="space-y-0.5">
                <label className="text-sm text-gray-700">Due Date</label>
                <input
                  {...register("due_date", {
                    required: "Due date cannot be empty",
                  })}
                  type="date"
                  className={`w-full rounded ${
                    errors.due_date?.message
                      ? "border-red-600 focus:ring-red-600 focus:border-red-600"
                      : "border-gray-300 focus:ring-indigo-600 focus:border-indigo-600"
                  }`}
                />
                <p className="text-xs text-red-600">
                  {errors.due_date?.message}
                </p>
              </div>
              <input type="submit" className="hidden" ref={submitRef} />
            </form>
            {/* Footer */}
            <div className="flex items-center justify-end p-1 space-x-5">
              <button
                className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className={`flex items-center justify-center px-3 py-1 w-16 rounded text-gray-50 bg-indigo-600 border border-indigo-600 ${
                  submitting
                    ? "disabled:bg-opacity-70 cursor-wait"
                    : "hover:bg-opacity-90"
                }`}
                onClick={() => {
                  submitRef.current.click();
                }}
                disabled={submitting}
              >
                {submitting ? (
                  <div className="animate-spin h-6 w-6 border-gray-50 rounded-full border-4 border-t-indigo-300 border-l-indigo-300"></div>
                ) : (
                  <span>Save</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateToDo;
