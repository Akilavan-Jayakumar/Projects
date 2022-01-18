import React from "react";
import axios from "axios";
import Heart from "Icons/heart";
import People from "Icons/people";
import HeartSolid from "Icons/heart-solid";

const LikesVisit = () => {
  const box = React.useRef(null);
  const initialized = React.useRef(false);

  const [likes, setLikes] = React.useState({
    count: 0,
    liked: false,
  });
  const [visits, setVisits] = React.useState({
    count: 0,
    visited: false,
  });

  const saveLike = React.useCallback(() => {
    setLikes((prev) => ({
      count: prev.count + 1,
      liked: true,
    }));
    initialized.current = true;
  }, []);

  const saveVisit = React.useCallback(() => {
    setVisits((prev) => ({
      count: prev.count + 1,
      visited: true,
    }));
    initialized.current = true;
  }, []);

  React.useEffect(() => {
    if (initialized.current) {
      axios
        .post("/server/service/updateLikesVisits", {
          visits: visits.count,
          likes: likes.count,
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [likes.count, visits.count]);

  React.useEffect(() => {
    axios
      .get("/server/service/likes_visits")
      .then((response) => {
        const { code, data } = response.data;
        if (code === 2000) {
          setVisits((prev) => ({
            ...prev,
            count: parseInt(data.visits),
          }));
          setLikes((prev) => ({
            ...prev,
            count: parseInt(data.likes),
          }));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div ref={box} className="flex text-xl items-center space-x-3 px-1">
      <div className="flex items-center ">
        <button
          className={`p-1 rounded-full ${
            likes.liked ? "" : "hover:bg-gray-50 hover:bg-opacity-20"
          } mx-0.5 disabled:cursor-default`}
          disabled={likes.liked}
          onClick={saveLike}
        >
          {likes.liked ? (
            <HeartSolid className="w-6 h-6" />
          ) : (
            <Heart className="w-6 h-6" />
          )}
        </button>
        <p>{likes.count}</p>
      </div>
      <div className="flex items-center ">
        <button
          className={`p-1 rounded-full ${
            visits.visited ? "" : "hover:bg-gray-50 hover:bg-opacity-20"
          } mx-0.5 disabled:cursor-default`}
          disabled={visits.visited}
          onClick={saveVisit}
        >
          <People className="w-6 h-6" />
        </button>
        <p>{visits.count}</p>
      </div>
    </div>
  );
};

export default LikesVisit;
