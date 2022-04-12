import cron from "node-cron";
import Check from "../models/checkSchema.js";
import Report from "../models/reportSchema.js";
import axios from "axios";
import axiosRetry from "axios-retry";

class CronService {
  static taskMap = {};

  async checkAvailbilityCallback(check) {
    const client = axios.create({
      baseURL: check.url,
      timeout: check.timeout * 1000,
    });

    axiosRetry(client, { retries: check.threshold });

    const startTime = Date.now();

    client
      .get(check.path)
      .then((res) => {
        let endTime = Date.now();
        let responseTime = (endTime - startTime) / 1000;

        Report.findOne({ checkId: check._id })
          .then((report) => {
            let log = `Success: GET ${res.status} ${responseTime}sec`;
            let uptime = report.uptime + check.interval;

            let historyLog = report.history;
            if (historyLog == null) historyLog = [];
            historyLog.push(log);

            Report.findByIdAndUpdate(report._id, {
              status: res.status,
              availability: (uptime / (uptime + report.downtime)) * 100,
              uptime: uptime,
              responseTime: responseTime,
              history: historyLog,
            })
              .then((newReport) => {
                console.log(
                  `Check ID: ${newReport.checkId}, ` +
                    newReport.history[newReport.history.length - 1]
                );
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log("Check Not found");
          });
      })
      .catch((error) => {
        let endTime = Date.now();
        let responseTime = (endTime - startTime) / 1000;

        Report.findOne({ checkId: check._id })
          .then((report) => {
            let downtime = report.downtime + check.interval;
            let outages = report.outages + 1;
            let status = 400;
            let log = `Fail: GET ${status} ${responseTime}sec`;

            let historyLog = report.history;
            if (historyLog == null) historyLog = [];
            historyLog.push(log);

            Report.findByIdAndUpdate(report._id, {
              status: status,
              availability: (report.uptime / (report.uptime + downtime)) * 100,
              downtime: downtime,
              outages: outages,
              responseTime: responseTime,
              history: historyLog,
            })
              .then((newReport) => {
                console.log(
                  `Check ID: ${newReport.checkId}, ` +
                    newReport.history[newReport.history.length - 1]
                );
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      });
  }

  async start() {
    const checks = await Check.find();

    checks.forEach((check) => {
      CronService.taskMap[check._id] = cron.schedule(
        `*/${check.interval} * * * *`,
        () => {
          if (check) this.checkAvailbilityCallback(check);
        }
      );
    });
  }

  async addTask(check) {
    CronService.taskMap[check._id] = cron.schedule(
      `*/${check.interval} * * * *`,
      () => {
        if (check) this.checkAvailbilityCallback(check);
      }
    );
  }

  async removeTask(checkId) {
    CronService.taskMap[checkId].stop();
  }
}

export const cronService = new CronService();
