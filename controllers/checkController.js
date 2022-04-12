import Check from "../models/checkSchema.js";
import Report from "../models/reportSchema.js";
import { cronService } from "../services/cron-service.js";

import {
  createCheckValidationSchema,
  updateCheckValidationSchema,
} from "../shcemas/check-schemas.js";

// Get all checks
const getAllChecks = async (req, res) => {
  try {
    // Get the owner of the check
    const user = req.decodedData;
    const checks = await Check.find({ ownedBy: user._id });
    if (checks.length == 0) return res.status(200).send("No URLs to check");
    res.status(200).send(checks);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get check
const getCheck = async (req, res) => {
  try {
    // Get the owner of the check
    const user = req.decodedData;
    const check = await Check.findOne({
      ownedBy: user._id,
      _id: req.params.id,
    });
    if (!check) return res.status(200).send("Check not found");
    res.status(200).send(check);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Create a check
const createCheck = async (req, res) => {
  try {
    // Validate the data
    const { error } = createCheckValidationSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if check exists
    const isCheckExists = await Check.findOne({
      name: req.body.name,
      url: req.body.url,
    });
    if (isCheckExists) return res.status(400).send("Check already exists");

    // Get the owner of the check
    const user = req.decodedData;

    // Create a new check
    const check = new Check({
      ownedBy: user._id,
      name: req.body.name,
      url: req.body.url,
      protocol: req.body.protocol,
      path: req.body.path,
      port: req.body.port,
      timeout: req.body.timeout,
      interval: req.body.interval,
      threshold: req.body.threshold,
      authentication: req.body.authentication,
      httpHeaders: req.body.httpHeaders,
      tags: req.body.tags,
    });

    await check.save();

    // Create the report
    const report = new Report({
      checkId: check._id,
      status: 200,
      availability: 0,
    });

    await report.save();

    cronService.addTask(check);

    res.send(
      `Check: ${check._id} has been created by ${user.email}, with report: ${report._id}`
    );
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Update a check
const updateCheck = async (req, res) => {
  try {
    // Validate the data
    const { error } = updateCheckValidationSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Get the owner of the check
    const user = req.decodedData;

    const check = await Check.findOneAndUpdate(
      { ownedBy: user._id, _id: req.params.id },
      {
        $set: {
          ...req.body,
        },
      }
    );
    if (!check) return res.send("Check not found");

    res.status(200).send("Check updated successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Delete check
const deleteCheck = async (req, res) => {
  try {
    // Get the owner of the check
    const user = req.decodedData;

    // Delete the check and its corresponding report
    const check = await Check.findOneAndDelete({
      ownedBy: user._id,
      _id: req.params.id,
    });
    if (!check) return res.send("Check not found");
    await Report.findOneAndDelete({ checkId: req.params.id });
    await cronService.removeTask(check._id);
    res.status(200).send("Check and its report have been deleted successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export { getCheck, getAllChecks, createCheck, updateCheck, deleteCheck };
