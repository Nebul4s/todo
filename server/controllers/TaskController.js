import { emptyOrRows } from "../helper/utils.js";
import { pool } from "../helper/db.js";
import { selectAllTasks, insertTask, deleteTask } from "../models/Task.js";

const getTasks = async (req, res, next) => {
  try {
    const result = await selectAllTasks();

    return res.status(200).json(emptyOrRows(result));
  } catch (err) {
    return next(err);
  }
};

const postTask = async (req, res, next) => {
  try {
    if (!req.body.description || req.body.description.length === 0) {
      const error = new Error("Invalid description for task");
      error.statusCode = 400;
      return next(error);
    }
    const result = await insertTask(req.body.description);
    return res.status(200).json({ id: result.rows[0].id });
  } catch (err) {
    return next(err);
  }
};

const deleteATask = async (req, res, next) => {
  try {
    await deleteTask(parseInt(req.params.id));

    return res.status(200).json({ id: req.params.id });
  } catch (err) {
    return next(err);
  }
};

export { getTasks, postTask, deleteATask };
