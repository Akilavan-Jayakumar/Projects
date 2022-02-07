"use strict";
const express = require("express");
const catalystSDK = require("zcatalyst-sdk-node");

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  const catalyst = catalystSDK.initialize(req);
  res.locals.catalyst = catalyst;
  next();
});
app.get("/all", async (req, res) => {
  try {
    const completed = req.query.completed === "true";
    const rowsPerPage = parseInt(req.query.rowsPerPage);
    let currentPage = parseInt(req.query.currentPage) + 1;

    const catalyst = res.locals.catalyst;
    const zcql = catalyst.zcql();

    const countQuery = `SELECT COUNT(ROWID) FROM ToDo ${
      completed ? "WHERE completed = true " : ""
    }
    `;

    const countResult = await zcql.executeZCQLQuery(countQuery);
    const total = parseInt(countResult[0].ToDo.ROWID);
    const totalPages = Math.ceil(total / rowsPerPage);
    if (currentPage > totalPages) {
      currentPage = totalPages;
    }
    if (total) {
      const startIndex = (currentPage - 1) * rowsPerPage + 1;
      const dataQuery = `SELECT ROWID,title,due_date,completed FROM ToDo ${
        completed ? "WHERE completed = true " : ""
      }ORDER BY completed,due_date
      LIMIT ${startIndex},${rowsPerPage}`;
      const dataResult = await zcql.executeZCQLQuery(dataQuery);

      res.status(200).send({
        message: "Fetched successfully",
        data: {
          data: dataResult.map((item) => item.ToDo),
          currentPage: Math.max(0, currentPage - 1),
          total,
        },
      });
    } else {
      res.status(200).send({
        message: "Fetched successfully",
        data: {
          data: [],
          currentPage,
          total,
        },
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server Error",
      err: err,
    });
  }
});
app.post("/create", async (req, res) => {
  try {
    const data = req.body;
    const catalyst = res.locals.catalyst;
    const table = catalyst.datastore().table("ToDo");
    const { ROWID } = await table.insertRow({
      ...data,
    });

    res.status(200).send({
      message: "Inserted successfully",
      data: {
        ROWID: ROWID.toString(),
        completed: false,
        ...data,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server Error",
      err: err,
    });
  }
});
app.post("/finish/:ROWID", async (req, res) => {
  try {
    const ROWID = req.params.ROWID;
    const catalyst = res.locals.catalyst;
    const table = catalyst.datastore().table("ToDo");
    await table.updateRow({
      ROWID,
      completed: true,
    });
    res.status(200).send({
      message: "Updated successfully",
      data: {
        ROWID,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server Error",
      err: err,
    });
  }
});
app.delete("/:ROWID", async (req, res) => {
  try {
    const ROWID = req.params.ROWID;
    const catalyst = res.locals.catalyst;
    const table = catalyst.datastore().table("ToDo");
    await table.deleteRow(ROWID);
    res.status(200).send({
      message: "Deleted successfully",
      data: {
        ROWID,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server Error",
      err: err,
    });
  }
});
module.exports = app;
