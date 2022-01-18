import React from "react";

import Star from "Icons/star";
import Info from "Icons/info";
import Close from "Icons/close";
import Trash from "Icons/trash";
import Pencil from "Icons/pencil";
import Location from "Icons/location";
import StarSolid from "Icons/star-solid";

import areEqual from "Utils/areEqual";

import { generate } from "shortid";

const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=%cor%";

const Restaurant = ({ restaurant, performActions }) => {
  const [showInfo, setShowInfo] = React.useState(false);

  const toggleInfo = React.useCallback(() => {
    setShowInfo((c) => !c);
  }, []);

  const onClick = React.useCallback(
    (event) => {
      const action = event.currentTarget.getAttribute("data-action");
      const restaurant_id = restaurant.ROWID;
      performActions({
        action,
        restaurant_id,
      });
    },
    [performActions, restaurant.ROWID]
  );
  const openLocation = React.useCallback(() => {
    window.open(MAPS_URL.replace("%cor%", restaurant.coordinates));
  }, [restaurant.coordinates]);
  return (
    <div>
      <div className="bg-gray-50 rounded min-h-[375px] max-h-[375px] min-w-[8.5rem] max-w-[20rem] mx-2 shadow-xl relative border-[1px] border-neutral-200">
        {showInfo ? (
          <div className="relative p-3 max-w-full max-h-full">
            <button
              className="absolute right-3 top-2 p-1 hover:rounded-full  hover:bg-gray-200"
              onClick={toggleInfo}
            >
              <Close className="h-5 w-5" />
            </button>
            <div className="overflow-auto break-all my-3  max-h-[350px]">
              <p className="font-bold mb-2">{restaurant.name}</p>
              <p>{restaurant.description}</p>
            </div>
          </div>
        ) : (
          <div>
            <div>
              <img
                src={`/server/service/image/${restaurant.image_id}`}
                alt="hotel"
                className="h-52 w-full mb-2"
              />
            </div>

            <div className="px-3 pb-3 ">
              <p className="text-lg font-medium mb-2 truncate">
                {restaurant.name}
              </p>
              <p className="text-md overflow-hidden break-words line-clamp-2 mb-2 h-12">
                {restaurant.description}
              </p>
              <div className="flex items-center mb-3">
                {new Array(5).fill(1).map((_, index) => {
                  if (index <= parseInt(restaurant.rating) - 1) {
                    return (
                      <StarSolid
                        className="w-4 h-4 text-yellow-500 mx-[1px]"
                        key={generate()}
                      />
                    );
                  } else {
                    return (
                      <Star
                        className="w-4 h-4 text-neutral-400 mx-[1px]"
                        key={generate()}
                      />
                    );
                  }
                })}
              </div>
              <div className="flex items-center text-neutral-500">
                <button
                  className="p-1 hover:rounded-full  hover:bg-gray-200"
                  onClick={openLocation}
                >
                  <Location className="w-5 h-5" />
                </button>
                <p className="text-sm flex-1 truncate">
                  {restaurant.city}, {restaurant.country}
                </p>
                <button
                  onClick={toggleInfo}
                  className="p-1 hover:rounded-full  hover:bg-gray-200"
                >
                  <Info className="h-5 w-5" />
                </button>
                <button
                  className="p-1 hover:rounded-full  hover:bg-gray-200"
                  onClick={onClick}
                  data-action="edit"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={onClick}
                  className="p-1 hover:rounded-full  hover:bg-gray-200"
                  data-action="delete"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Restaurant, areEqual);
