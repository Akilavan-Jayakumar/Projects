import React from "react";

import Info from "Icons/info";
import Close from "Icons/close";

const AppInfo = () => {
  const [open, setOpen] = React.useState(false);

  const openDialog = React.useCallback(() => {
    setOpen(true);
  }, []);

  const closeDialog = React.useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <div className="flex-1">
      <button
        className="p-1 hover:bg-neutral-200 rounded-full text-navyblue-900 "
        onClick={openDialog}
      >
        <Info className="h-6 w-6" />
      </button>
      <div
        className={`${
          open ? "visible" : "invisible"
        } bg-black inset-0 absolute z-20 bg-opacity-50`}
      >
        <div className="flex items-center justify-center h-screen">
          <div className="bg-gray-50 w-7/12 py-5 px-4 rounded">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center space-x-1 text-navyblue-900">
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
                <p className="text-2xl font-bold flex-1">Bites</p>
                <button
                  className="p-1 hover:bg-neutral-200 rounded-full"
                  onClick={closeDialog}
                >
                  <Close className="h-5 w-5" />
                </button>
              </div>
              <div className="px-4 py-3 overflow-auto h-[50rem]">
                <div
                  id="serverless_concept"
                  className="flex flex-col space-y-2 mb-10"
                  name="sections"
                >
                  <p className="text-2xl font-bold">Serverless Concept</p>
                  <p className="text-[17px] ml-4">
                    Serverless is a cloud-native development model that allows
                    developers to build and run applications without having to
                    manage servers. You can build your application without
                    worrying about maintenance and just focus on your core
                    business logic alone.
                  </p>
                </div>
                <div
                  id="serverless_website"
                  className="flex flex-col space-y-2 mb-10"
                  name="sections"
                >
                  <p className="text-2xl font-bold">Serverless Website</p>
                  <p className="text-[17px] ml-4">
                    This is a website which is used for viewing the best
                    restaurants in whatever places you like along with ratings
                    and other details. This is a serverless website which is
                    built on Catalyst by Zoho, which is a full stack serverless
                    platform. This website uses various components from Catalyst
                    in order to complete its core functionality
                  </p>
                </div>
                <div
                  id="components"
                  className="flex flex-col space-y-2 mb-10"
                  name="sections"
                >
                  <p className="text-2xl font-bold">Components</p>
                  <p className="text-[17px] ml-4">
                    What would be the key requirements of a website that
                    provides restaurant data to people who want to hangout? Let
                    us consider the following ones :
                  </p>
                  <div className="ml-8">
                    <ol className="space-y-3 list-decimal ml-8">
                      <li>
                        The details of the restaurant - A database to store the
                        details.
                      </li>
                      <li>
                        Images of the restaurant - A file storage to keep all
                        the restaurant images.
                      </li>

                      <li>
                        Ratings of the restaurant - A temporary storage space
                        (Cache) to keep all the ratings.
                      </li>
                      <li>
                        A server side computation to group all the data and view
                        it or create new data.
                      </li>
                      <li>
                        A client side hosting solution for hosting the web
                        client
                      </li>
                    </ol>
                  </div>
                </div>
                <p className="text-2xl font-bold mb-5">
                  Now what will be the Catalyst Components that go along with
                  these requirements?
                </p>
                <div
                  id="datastore"
                  className="flex flex-col space-y-2 mb-10"
                  name="sections"
                >
                  <p className="text-2xl font-bold">Datastore</p>
                  <p className="text-[17px] ml-4">
                    Catalyst Datastore is a relational database management
                    system which you can use for all your database needs. Now in
                    our serverless website, we need to store the restaurant
                    details and query them whenever required. We can use the
                    Catalyst Datastore along with ZCQL (Zoho Catalyst Querying
                    Language) to fetch the data and show it on the website.
                  </p>
                  <br />
                  <p className="text-[17px] ml-4">
                    Table Structure - We have one table in the Catalyst
                    Datastore which contains the details of the restaurant such
                    as name address etc. The tabe structure is as follows :
                  </p>
                  <div className="ml-8">
                    <ol className="space-y-3 list-decimal ml-8">
                      <li>name - varchar</li>
                      <li>city - varchar</li>
                      <li>rating - int</li>
                      <li>description - text</li>
                      <li>country - varchar</li>
                      <li>coordinates - text</li>
                      <li>image_id - varchar</li>
                    </ol>
                  </div>
                  <p className="ml-4">
                    Refer{" "}
                    <a
                      href="https://catalyst.zoho.com/help/data-store.html"
                      target="_blank"
                      className="underline text-navyblue-900"
                      rel="noreferrer"
                    >
                      here
                    </a>{" "}
                    to know more about <b>Datastore</b>
                  </p>
                </div>
                <div
                  id="filestore"
                  className="flex flex-col space-y-2 mb-10"
                  name="sections"
                >
                  <p className="text-2xl font-bold">Filestore</p>
                  <p className="text-[17px] ml-4">
                    Catalyst Filestore is a scalable and secure file storage
                    management feature which can keep all your files in one
                    place. In our serverless website, we need to store the
                    restaurant images, thumbnails of restaurant logo etc. For
                    this case, we can use the Catalyst Filestore where we can
                    upload, download and stream all kinds of images/files
                    wherever required.
                  </p>
                  <br />
                  <p className="text-[17px] ml-4">
                    Folder Structure - We have one folder in the Catalyst
                    Filestore for storing all the restaurant related images. The
                    folder's name will be Images.
                  </p>
                  <p className="ml-4">
                    Refer{" "}
                    <a
                      href="https://catalyst.zoho.com/help/file-store.html"
                      target="_blank"
                      className="underline text-navyblue-900"
                      rel="noreferrer"
                    >
                      here
                    </a>{" "}
                    to know more about <b>Filestore</b>
                  </p>
                </div>
                <div
                  id="cache"
                  className="flex flex-col space-y-2 mb-10"
                  name="sections"
                >
                  <p className="text-2xl font-bold">Cache</p>
                  <p className="text-[17px] ml-4">
                    The cache available in Catalyst can be used to store and
                    retrieve data at high speed, irrespective of the main data
                    storage component. We need to track the number of likes and
                    website visits per day and the cache can be used for the
                    same.
                  </p>
                  <br />
                  <p className="text-[17px] ml-4">
                    Cache Segments - We have two cache segments in order to
                    track the likes and number of visits to the website. The key
                    names of the two cache segments will be :
                  </p>
                  <div className="ml-8">
                    <ol className="space-y-3 list-decimal ml-8">
                      <li>visits</li>
                      <li>likes</li>
                    </ol>
                  </div>
                  <p className="ml-4">
                    Refer{" "}
                    <a
                      href="https://catalyst.zoho.com/help/cache.html"
                      target="_blank"
                      className="underline text-navyblue-900"
                      rel="noreferrer"
                    >
                      here
                    </a>{" "}
                    to know more about <b>Cache</b>
                  </p>
                </div>
                <div
                  id="functions"
                  className="flex flex-col space-y-2 mb-10"
                  name="sections"
                >
                  <p className="text-2xl font-bold">Functions</p>
                  <p className="text-[17px] ml-4">
                    Now that we have all the components for performing the
                    operations, we need a location where we can write our
                    business logic and host the same through which we can make
                    our application work. We can use the Catalyst functions for
                    the same. You can write your business logic in either
                    Java/Node.js.
                  </p>
                  <p className="ml-4">
                    Refer{" "}
                    <a
                      href="https://catalyst.zoho.com/help/functions.html"
                      target="_blank"
                      className="underline text-navyblue-900"
                      rel="noreferrer"
                    >
                      here
                    </a>{" "}
                    to know more about <b>Functions</b>
                  </p>
                </div>
                <div
                  id="web_client_hosting"
                  className="flex flex-col space-y-2 mb-10"
                  name="sections"
                >
                  <p className="text-2xl font-bold">Web Client Hosting</p>
                  <p className="text-[17px] ml-4">
                    Catalyst Web Client Hosting is a normal web hosting service
                    that can be used for hosting your web client. In order to
                    host our serverless website, we can use this feature of
                    Catalyst accordingly.
                  </p>
                  <p className="ml-4">
                    Refer{" "}
                    <a
                      href="https://catalyst.zoho.com/help/web-client-hosting.html"
                      target="_blank"
                      className="underline text-navyblue-900"
                      rel="noreferrer"
                    >
                      here
                    </a>{" "}
                    to know more about <b>Web Client Hosting</b>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppInfo;
