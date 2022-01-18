const fs = require("fs");
const express = require("express");
const fileupload = require("express-fileupload");
const catalystSDK = require("zcatalyst-sdk-node");

const codes = require("./codes");

const app = express();

const CACHE_EXPIRY = 24;

app.use(fileupload());
app.use(express.json());

app.get("/all", async (req, res) => {
  try {
    const rowsPerPage = req.query.rowsPerPage;
    let currentPage = req.query.currentPage;

    const catalyst = catalystSDK.initialize(req);

    const zcql = catalyst.zcql();

    const countQuery = `SELECT COUNT(ROWID) FROM Restaurants`;
    const countResponse = await zcql.executeZCQLQuery(countQuery);

    const total = parseInt(countResponse[0].Restaurants.ROWID);
    if (total) {
      const totalPages = Math.ceil(total / rowsPerPage);
      if (currentPage > totalPages) {
        currentPage = totalPages;
      }
      const startIndex = (currentPage - 1) * rowsPerPage + 1;

      const dataQuery = `SELECT ROWID,name,description,rating,city,country,coordinates,image_id
                         FROM Restaurants 
                         LIMIT ${startIndex},${rowsPerPage}`;
      const dataResponse = await zcql.executeZCQLQuery(dataQuery);

      res.status(200).send({
        code: codes.SUCCESS,
        info: "Data fetched successfully",
        data: {
          data: dataResponse.map((item) => ({ ...item.Restaurants })),
          currentPage,
          total,
        },
      });
    } else {
      res.status(200).send({
        code: codes.NO_DATA,
        info: "No data available",
        data: {},
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      err,
      code: codes.SERVER_ERROR,
      info: "Server Error",
      data: {},
    });
  }
});
app.get("/details", async (req, res) => {
  try {
    const ROWID = req.query.ROWID;
    const catalyst = catalystSDK.initialize(req);

    const datastore = catalyst.datastore();
    const table = datastore.table("Restaurants");

    const { name, description, rating, city, country, coordinates } =
      await table.getRow(ROWID);
    res.status(200).send({
      code: codes.SUCCESS,
      info: "Fetched Successfully",
      data: {
        name,
        description,
        rating,
        city,
        country,
        coordinates,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      err,
      code: codes.SERVER_ERROR,
      info: "Server Error",
      data: {},
    });
  }
});

app.post("/create", async (req, res) => {
  try {
    const catalyst = catalystSDK.initialize(req);

    const datastore = catalyst.datastore();
    const table = datastore.table("Restaurants");

    const filestore = catalyst.filestore();

    const folder_id = await getFolderId(filestore);
    const folder = filestore.folder(folder_id);

    const image = req.files.image;
    const data = req.body;

    await image.mv(`${__dirname}/tmp/${image.name}`);

    const config = {
      code: fs.createReadStream(`${__dirname}/tmp/${image.name}`),
      name: image.name,
    };

    const { id: image_id } = await folder.uploadFile(config);

    const { ROWID } = await table.insertRow({
      ...data,
      image_id,
    });
    res.status(200).send({
      code: codes.SUCCESS,
      info: "Inserted Successfully",
      data: {
        ROWID: ROWID.toString(),
        ...data,
        image_id,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      err,
      code: codes.SERVER_ERROR,
      info: "Server Error",
      data: {},
    });
  }
});

app.put("/update", async (req, res) => {
  try {
    const ROWID = req.query.ROWID;
    const data = req.body;
    const catalyst = catalystSDK.initialize(req);

    const datastore = catalyst.datastore();
    const table = datastore.table("Restaurants");

    const { image_id } = await table.updateRow({
      ROWID,
      ...data,
    });
    res.status(200).send({
      code: codes.SUCCESS,
      info: "Updated Successfully",
      data: {
        ROWID: ROWID.toString(),
        ...data,
        image_id,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      err,
      code: codes.SERVER_ERROR,
      info: "Server Error",
      data: {},
    });
  }
});

app.delete("/:ROWID", async (req, res) => {
  try {
    const ROWID = req.params.ROWID;
    const catalyst = catalystSDK.initialize(req);

    const datastore = catalyst.datastore();
    const table = datastore.table("Restaurants");

    const filestore = catalyst.filestore();

    const folder_id = await getFolderId(filestore);
    const folder = filestore.folder(folder_id);

    const { image_id } = await table.getRow(ROWID);

    if (image_id) {
      await folder.deleteFile(image_id);
    }
    await table.deleteRow(ROWID);
    res.status(200).send({
      code: codes.SUCCESS,
      info: "Deleted Successfully",
      data: {},
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      err,
      code: codes.SERVER_ERROR,
      info: "Server Error",
      data: {},
    });
  }
});

app.get("/image/:file_id", async (req, res) => {
  try {
    const file_id = req.params.file_id;

    const catalyst = catalystSDK.initialize(req);

    const filestore = catalyst.filestore();

    const folder_id = await getFolderId(filestore);
    const folder = filestore.folder(folder_id);

    const buffer = await folder.downloadFile(file_id);

    res.status(200).contentType("png").send(buffer);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      err,
      code: codes.SERVER_ERROR,
      info: "Server Error",
      data: {},
    });
  }
});

app.get("/likes_visits", async (req, res) => {
  try {
    const catalyst = catalystSDK.initialize(req);

    const cache = catalyst.cache();

    const segment_id = await getSegmentId(cache);
    const segment = cache.segment(segment_id);

    let visits = await segment.getValue("visits");
    let likes = await segment.getValue("likes");

    if (visits === null) {
      await segment.put("visits", 0, CACHE_EXPIRY);
      visits = 0;
    }

    if (likes === null) {
      await segment.put("likes", 0, CACHE_EXPIRY);
      likes = 0;
    }

    res.status(200).send({
      code: codes.SUCCESS,
      info: "Retrieved from cache",
      data: {
        visits,
        likes,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      err,
      code: codes.SERVER_ERROR,
      info: "Server Error",
      data: {},
    });
  }
});

app.post("/updateLikesVisits", async (req, res) => {
  try {
    const { likes, visits } = req.body;

    const catalyst = catalystSDK.initialize(req);
    const cache = catalyst.cache();

    const segment_id = await getSegmentId(cache);
    const segment = cache.segment(segment_id);

    await segment.update("likes", likes.toString());
    await segment.update("visits", visits.toString());

    res.status(200).send({
      code: codes.SUCCESS,
      info: "Updated Likes",
      data: parseInt(likes),
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      err,
      code: codes.SERVER_ERROR,
      info: "Server Error",
      data: {},
    });
  }
});

const getFolderId = async (filestore) => {
  const folders = await filestore.getAllFolders();

  for (const folder of folders) {
    const { folder_name, id } = JSON.parse(folder);
    if (folder_name === "Images") {
      return id;
    }
  }
  const {
    _folderDetails: { id },
  } = await filestore.createFolder("Images");

  return id;
};

const getSegmentId = async (cache) => {
  const segments = await cache.getAllSegment();
  for (const segment of segments) {
    const { segmentName, id } = JSON.parse(segment);
    if (segmentName === "Default") {
      return id;
    }
  }
};

module.exports = app;
