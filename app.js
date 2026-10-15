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

  sensorForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = {
      id: crypto.randomUUID(),
      title: inputTitle.value,
      ph: parseFloat(inputPh.value),
      temp: parseFloat(inputTemp.value),
      ec: parseFloat(inputEc.value),
      rh: parseFloat(inputRh.value),
    };

    const validationErrors = validateInput(formData);

    if (validationErrors.length > 0) {
      displayError(validationErrors.join(" "));
      return;
    }

    hideError();

    formData.risk = evaluateRisk(
      formData.ph,
      formData.temp,
      formData.ec,
      formData.rh,
    );

    records.unshift(formData);
    saveRecords();
    render();
    sensorForm.reset();
    inputTitle.focus();
  });

  recordsList.addEventListener("click", (event) => {
    const target = event.target;
    if (target.classList.contains("btn-secondary")) {
      const recordId = target.dataset.id;
      records = records.filter(function (record) {
        return record.id !== recordId;
      });
      saveRecords();
      render();
    }
  });

  btnPurge.addEventListener("click", (event) => {
    if (records.length === 0) return;
    if (confirm("Are you sure you want to delete all greenhouse data?")) {
      records = [];
      saveRecords();
      render();
    }
  });

  function render() {
    totalCount.textContent = records.length;

    if (records.length === 0) {
      emptyState.classList.remove("hidden");
      recordsList.innerHTML = "";
      return;
    }

    emptyState.classList.add("hidden");
    const fragment = document.createDocumentFragment();

    records.forEach(function (rec) {
      const li = document.createElement("li");
      li.className = "data-card status-" + rec.risk.level;

      li.innerHTML = `<div class="card-header">
            <div>
                <div class="data-title">${escapeHtml(rec.title)} </div>
                <span class="risk-badge ${rec.risk.level}">${rec.risk.label}</span>            
            </div>
            <div class="data-fields">
              <div class="data-item"><span>pH</span>${rec.ph.toFixed(1)}</div>
              <div class="data-item"><span>Temperature</span>${rec.temp.toFixed(1)} F</div>
              <div class="data-item"><span>Electrical Conductivity (mS/cm)</span>${rec.ec.toFixed(1)} mS/cm</div>
              <div class="data-item"><span>Relative Humidity (%)</span>${rec.rh.toFixed(1)}%</div> 
            </div>
            <button class="btn-secondary" data-id="${rec.id}">Remove Record</button>        
        </div>`;

      fragment.appendChild(li);
    });

    recordsList.innerHTML = "";
    recordsList.appendChild(fragment);
  }
})();
