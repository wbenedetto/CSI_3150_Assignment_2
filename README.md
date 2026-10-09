# 3150: Assignment 2A

Bryce Benedetto  
Professor Amartya Sen  
10-11-26

## Section 1: The Less-than-equal-4-Click User Journey Funnel

- **Starting State:** User enters the webpage and sees a header with company branding and an input section for pH, Electrical Conductivity, Air Temperature, and Relative Humidity. The user also sees an output box, which will initially be blank, unless there are records stored in localStorage.
- **Action 1:** User will input data into the form boxes, where numerical bounds will apply to prevent faulty data entry. Fields marked as problematic will instantly show a visual error to alert the user.
- **Action 2:** User selects the Submit button, triggering JavaScript to validate the entered values (if the inputs are invalid, they will be rejected). JavaScript will calculate the correct tag for the input, store the record an array, then save the data to localStorage.
- **Action 3:** Upon submission, the output panel will switch from the start state to displaying the inputs, displaying the submitted sensor record along with its calculated status tag of "Optimal", "Warning", or "Critical Hazard" depending on the inputted pH, Temp, EC, and RH values.
- **Action 4:** User will be given the option to delete individual records from the output panel using a Delete button or clear the entire records panel using a Purge button.
- **Terminal State:** The output panel will display all remaining sensor records along with their "Optimal", "Warning", or "Critical Hazard" tags. Any deleted records will no longer appear, and the remaining data will be saved in localStorage so that it can be accessed after refreshing the webpage.

## Section 2: Don Norman Usability & Constraint Audit

| Norman Principle / Concept | System Context                                                                 | Implementation Mechanism (DOM / HTML / JS)                                                                                                                                                                                                                                                |
| -------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gulf of Execution          | Typing numeric sensor metrics (pH, ElectricalConductivity[EC], Temp, Humidity) | A label describes what type of input is expected (e.g. Temperature), a unit further clarifies how the input is measured (e.g. F, C, Kelvin), and a placeholder gives an example of what the input should look like (e.g. 71).                                                             |
| Gulf of Evaluation         | Ingesting sensor values after clicking "Record Reading"                        | When the user submits the form, JavaScript will check the values against predefined thresholds for each of the "Optimal", "Warning", and "Critical Hazard" tags evaluate the entered sensor to organize it correctly. From here, the output panel will reflect that tag back to the user. |
| System Constraint          | E.g. Water pH Boundaries (0.0 <= pH <= 14.0)                                   | In the HTML form, we can use min, max, and type. For example, the pH input will use `type="number"`, `min="0"`, and `="14"` to restrict accepted values. JavaScript will perform additional checks to ensure the data fall in the correct bounds.                                         |
| Visual Feedback State      | Real-Time Input Error / Out-of-Bounds                                          | When JavaScript detects that an incorrected input is provided, it will apply an error CSS class to the input field to alert the user.                                                                                                                                                     |
| Error Recovery             | Accidental or test data submissions                                            | When a user selects the Delete button, JavaScript will update both the displayed records and localStorage to ensure deleted data does not reappear when the webpage is refreshed. If the user wants to clear all records, there is also the option of the Purge button.                   |

## Section 3: Component, DOM Tree & Event Target Architecture

**Index.html**

```text
● <html lang="en"> [STATIC]
  ○ <head> [STATIC]
    ▪ <meta> [STATIC]
    ▪ <link> [STATIC]

  ○ <body> [STATIC] (CSS: display=flex, flex-direction=column)
    ▪ <header class="portal-header"> [STATIC]
      (CSS: display=flex, align-items=center)
      • <span class="icon-logo"> [STATIC]
      • <h1>GreenView [STATIC]

    ▪ <main class="portal-container"> [STATIC]
      (CSS: display=grid, grid-template-columns=380px 1fr)

      • <section class="panel form-panel"> [STATIC]
        ○ <h2 class="panel-title">Sensor Data Input [STATIC]
        ○ <p class="error-banner" id="form-error-banner"> [STATIC]
        ○ <form id="sensor-form"> [STATIC]
          ▪ <label class="form-label" for="title">Title [STATIC]
          ▪ <input class="form-input" id="title" name="title"
              type="text" placeholder="Greenhouse A" required>
              [STATIC] (Event: input)

          ▪ <div class="form-row"> [STATIC] (CSS: display=flex)
            • <div class="form-group"> [STATIC]
              ○ <label class="form-label" for="ph">pH [STATIC]
              ○ <input class="form-input" type="number" id="ph"
                  name="ph" min="0" max="14" step="0.1"
                  placeholder="7.0" required> [STATIC] (Event: input)
              ○ <p class="input-desc">Enter pH value [STATIC]

            • <div class="form-group"> [STATIC]
              ○ <label class="form-label" for="temp">Temperature (F) [STATIC]
              ○ <input class="form-input" type="number" id="temp"
                  name="temp" min="-100" max="150" step="0.1"
                  placeholder="70.3" required> [STATIC] (Event: input)
              ○ <p class="input-desc">Enter Temperature [STATIC]

          ▪ <div class="form-row"> [STATIC] (CSS: display=flex)
            • <div class="form-group"> [STATIC]
              ○ <label class="form-label" for="ec">EC (mS/cm) [STATIC]
              ○ <input class="form-input" type="number" id="ec"
                  name="ec" min="0" max="20" step="0.1"
                  placeholder="10.5" required> [STATIC] (Event: input)
              ○ <p class="input-desc">Enter EC Value [STATIC]

            • <div class="form-group"> [STATIC]
              ○ <label class="form-label" for="rh">RH (%) [STATIC]
              ○ <input class="form-input" type="number" id="rh"
                  name="rh" min="0" max="100" step="0.1"
                  placeholder="50.3" required> [STATIC] (Event: input)
              ○ <p class="input-desc">Enter Humidity Percetage [STATIC]

          ▪ <button id="btn-submit" class="btn btn-primary"
              type="submit">Submit Data [STATIC] (Event: submit)

      • <section class="panel records-panel"> [STATIC]
        ○ <header class="records-header"> [STATIC]
          (CSS: display=flex, justify-content=space-between)
          ▪ <h2 class="panel-title">Sensor Logs [STATIC]
          ▪ <div class="output-data"> [STATIC]
            • <button id="btn-purge" class="btn btn-secondary">
                Purge [STATIC] (Event: click)
            • <p class="total-count-label">Total:
                <span class="total-count" id="total-count">0
              [STATIC]

        ○ <p id="empty-state" class="empty-state">
            Nothing to show here. [STATIC]

        ○ <ul id="records-list"> [STATIC]
          (CSS: display=grid,
           grid-template-columns=repeat(auto-fill, minmax(180px, 1fr)))
          ▪ <li> [DYNAMIC]
            • <article class="sensor-card"> [DYNAMIC]
              (CSS: display=flex, flex-direction=column)
              ○ <header class="card-top"> [DYNAMIC]
                (CSS: display=flex, justify-content=space-between)
                ▪ <h3 class="card-title"> [DYNAMIC]
                ▪ <button class="btn btn-delete">Delete
                    [DYNAMIC] (Event: click)
              ○ <p class="status-tag"> [DYNAMIC]
                (Optimal or Warning or Critical Hazard)
              ○ <ul class="sensor-stats"> [DYNAMIC]
                (CSS: display=grid, grid-template-columns=1fr 1fr)
                ▪ <li> [DYNAMIC]
                  • <span class="list-title">pH [DYNAMIC]
                  • <p class="list-value">Recorded Value [DYNAMIC]
                ▪ <li> [DYNAMIC]
                  • <span class="list-title">EC [DYNAMIC]
                  • <p class="list-value">Recorded Value [DYNAMIC]
                ▪ <li> [DYNAMIC]
                  • <span class="list-title">RH (%) [DYNAMIC]
                  • <p class="list-value">Recorded Value [DYNAMIC]
                ▪ <li> [DYNAMIC]
                  • <span class="list-title">Temperature (F) [DYNAMIC]
                  • <p class="list-value">Recorded Value [DYNAMIC]

    ▪ <footer class="portal-footer"> [STATIC]
      • <p>2026 GreenView Inc [STATIC]
    ▪ <script src="app.js"> [STATIC]
```

## Section 4: Data Schema

```javascript
const sensorRecordSchema = {
  id: "String", //Unique identifier for each record
  title: "String", //User inputted name for each record
  ph: "Number", //User inputted pH for each record
  temp: "Number", //User inputted temperature (F) for each record
  ec: "Number", //User inputted electrical conductivity (mS/cm) for each record
  rh: "Number", //User inputted relative humidity (%) for each record
  status: "String", //Optimal, Warning, or Critical Hazzard based on provided data
};
```
