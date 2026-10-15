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
})();
