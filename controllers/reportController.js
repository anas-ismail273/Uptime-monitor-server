import Check from "../models/checkSchema.js";
import Report from "../models/reportSchema.js";

// Get report
const getReport = async (req, res) => {
  try {
    // Get the owner of the report
    const user = req.decodedData;
    const check = await Check.findOne({
      ownedBy: user._id,
      _id: req.params.checkId,
    });
    if (!check) return res.send("Report not found, see if check exsits");

    const report = await Report.findOne({ checkId: check._id });
    if (!report) return res.send("Report not found, see if check exists");

    res.status(200).send(report);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get check
const getReportsByTags = async (req, res) => {
  try {
    // Get the owner of the report
    const user = req.decodedData;

    var checks = await Check.find({
      ownedBy: user._id,
      tags: { $in: req.body.tags },
    });
    if (!checks) return res.send("Report not found, see if check exsits");

    let checkIds = [];
    checks.forEach((check) => {
      checkIds.push(check._id);
    });
    if (checkIds.length == 0)
      return res.send("No reports for the given tag(s)");

    const reports = await Report.find({ checkId: { $in: checkIds } });

    res.status(200).send(reports);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export { getReport, getReportsByTags };
