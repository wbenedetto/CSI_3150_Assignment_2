(function () {
  "use strict";

  const STORAGE_KEY = "greenview_records";

  const sensorForm = dovcument.getElementById("sensor-form");
  const errorBanner = document.getElementById("error-banner");
  const recordsList = document.getElementById("records-list");
  const totalCount = document.getElementById("total-count");
  const emptyState = document.getElementById("empty-state");
  const btnPurge = document.getElementById("btn-purge");

  const inputTitle = document.getElementById("title");
  const inputPh = document.getElementById("ph");
  const inputTemp = document.getElementById("temp");
  const inputEc = document.getElementById("ec");
  const inputRh = document.getElementById("rh");

  let records = loadRecords();
  render();

  function loadRecords() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to load sensor data from your data store", error);
      return [];
    }
  }

  function saveRecords() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (error) {
      console.error("Failed to write to your data store", error);
    }
  }

  function evaluateRisk(ph, temp, ec, rh) {
    if (
      (ph < 5.0 || ph > 7.5) &&
      (temp < 55 || temp > 95) &&
      (ec < 0.2 || ec > 4.5) &&
      (rh < 30 || rh > 90)
    ) {
      return { level: "critical-hazard", label: "Critical Hazard" };
    }
    if (
      ph >= 5.5 &&
      ph <= 6.5 &&
      temp >= 64.4 &&
      temp <= 71.6 &&
      ec >= 1.0 &&
      ec <= 2.0 &&
      rh >= 50 &&
      rh <= 70
    ) {
      return { level: "optimal", label: "Optimal" };
    }
    return { level: "warning", label: "Warning" };
  }

  function validateInput(data) {
    const errors = [];

    if (!data.title.trim()) {
      errors.push("Input title is a required field");
    }
    if (isNaN(data.ph) || data.ph < 0 || data.ph > 14) {
      errors.push("pH must be a number and between 0 to 14");
    }
    if (isNaN(data.temp) || data.temp < -100 || data.temp > 150) {
      errors.push("Temperature must be a number and between -100 to 150 F");
    }
    if (isNaN(data.ec) || data.ec < 0 || data.ec > 20) {
      errors.push(
        "Electrical conductivity must be a number and between 0 to 20 mS/cm",
      );
    }
    if (isNaN(data.rh) || data.rh < 0 || data.rh > 100) {
      errors.push("Relative humidity must be a number and between 0 to 100 %");
    }

    return errors;
  }
})();
