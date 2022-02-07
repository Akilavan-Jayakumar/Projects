import axios from "axios";
import React from "react";
import moment from "moment";

import Calendar from "../../public/calendar.svg";

const Task = ({ title, completed, ROWID, due_date, deleteToDo }) => {
  const date = new Date();

  const [updating, setUpdating] = React.useState(false);
  const [currentCompletionStatus, setCurrentCompletionStatus] =
    React.useState(false);

  React.useLayoutEffect(() => {
    setCurrentCompletionStatus(completed);
  }, [completed]);

  const completeTask = React.useCallback(() => {
    setUpdating(true);
    axios
      .post(`/server/service/finish/${ROWID}`, {
        completed: true,
      })
      .then(() => {
        setCurrentCompletionStatus(true);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setUpdating(false);
      });
  }, [ROWID]);

  if (currentCompletionStatus) {
    return (
      <div className="h-auto w-full min-w-[20rem] shadow-lg border rounded border-gray-200  py-1 px-4 flex flex-col space-y-1 text-gray-700">
        <p className="font-bold text-xl flex-1 truncate line-through decoration-gray-600">
          {title[0].toUpperCase() + title.slice(1)}
        </p>
        <div className="flex items-center py-1 w-full space-x-1  font-bold text-xs">
          <Calendar className="h-5 w-5" />
          <p className="flex-1">{moment(due_date).format("DD-MM-YYYY")}</p>
          <button
            className="bg-red-600 w-16 text-gray-100 py-1 px-2 rounded font-medium hover:bg-opacity-90 flex justify-center disabled:bg-opacity-70 disabled:cursor-wait"
            onClick={() => deleteToDo(ROWID)}
          >
            Delete
          </button>
        </div>
      </div>
    );
  } else if (moment(due_date).isBefore(date)) {
    return (
      <div className="h-auto w-full min-w-[20rem] shadow-lg border rounded border-gray-200  py-1 px-4 flex flex-col space-y-1 bg-red-100 text-red-600">
        <p className="font-bold text-xl flex-1 truncate">
          {title[0].toUpperCase() + title.slice(1)}
        </p>
        <div className="flex items-center py-1 w-full space-x-1  font-bold text-red-600 text-xs">
          <Calendar className="h-5 w-5" />
          <p className="flex-1">{moment(due_date).format("DD-MM-YYYY")}</p>
          <button
            className="bg-green-600 w-16 text-gray-100 py-1 px-2 rounded font-medium hover:bg-opacity-90 flex justify-center disabled:bg-opacity-70 disabled:cursor-wait"
            disabled={updating}
            onClick={completeTask}
          >
            {updating ? (
              <div className="h-4 w-4 border-2 rounded-full border-t-green-600 border-l-green-600 animate-spin" />
            ) : (
              <p>Finish</p>
            )}
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="h-auto w-full min-w-[20rem] shadow-lg border rounded border-gray-200  py-1 px-4 flex flex-col space-y-1 text-gray-700">
        <p className="font-bold text-xl flex-1 truncate">
          {title[0].toUpperCase() + title.slice(1)}
        </p>
        <div className="flex items-center py-1 w-full space-x-1  font-bold text-red-600 text-xs">
          <Calendar className="h-5 w-5" />
          <p className="flex-1">{moment(due_date).format("DD-MM-YYYY")}</p>
          <button
            className="bg-green-600 w-16 text-gray-100 py-1 px-2 rounded font-medium hover:bg-opacity-90 flex justify-center disabled:bg-opacity-70 disabled:cursor-wait"
            disabled={updating}
            onClick={completeTask}
          >
            {updating ? (
              <div className="h-4 w-4 border-2 rounded-full border-t-green-600 border-l-green-600 animate-spin" />
            ) : (
              <p>Finish</p>
            )}
          </button>
        </div>
      </div>
    );
  }
};

export default Task;
