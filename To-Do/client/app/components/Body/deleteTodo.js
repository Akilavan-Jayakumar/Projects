import axios from "axios";
import React from "react";

//Icons
import Close from "../../public/close.svg";

const DeleteTodo = ({ dispatch, deleteRef }) => {
  const details = React.useRef("");
  const [open, setOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    const openModal = (ROWID) => {
      details.current = ROWID;
      setOpen(true);
    };
    deleteRef.current = openModal;
  }, [deleteRef]);

  const closeModal = React.useCallback(() => {
    setOpen(false);
  }, []);

  const deleteTodo = React.useCallback(() => {
    setDeleting(true);
    axios
      .delete(`/server/service/${details.current}`)
      .then(() => {
        setOpen(false);
        dispatch({
          type: "REFRESH",
        });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setDeleting(false);
      });
  }, [dispatch]);
  return (
    <>
      {open && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-gray-50 w-[35rem] h-[15rem] rounded shadow-xl p-5 flex flex-col space-y-3">
            {/* Header */}
            <div className="text-gray-800 flex items-center">
              <p className="text-2xl font-bold flex-1">Confirm Delete</p>
              <button
                className="p-1 rounded-full hover:bg-gray-100 hover:border-gray-200 border  border-transparent"
                onClick={closeModal}
              >
                <Close className="h-5 w-5" />
              </button>
            </div>
            {/* Body */}
            <p className="flex-1 text-xl">
              Are you sure you want to delete this <b>ToDo</b> ?
            </p>
            {/* Footer */}
            <div className="flex items-center justify-end p-1 space-x-5">
              <button
                className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className={`flex items-center justify-center px-3 py-1 w-16 rounded text-gray-50 bg-red-600 border border-red-600 ${
                  deleting
                    ? "disabled:bg-opacity-70 cursor-wait"
                    : "hover:bg-opacity-90"
                }`}
                onClick={deleteTodo}
                disabled={deleting}
              >
                {deleting ? (
                  <div className="animate-spin h-6 w-6 border-gray-50 rounded-full border-4 border-t-red-300 border-l-red-300" />
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteTodo;
