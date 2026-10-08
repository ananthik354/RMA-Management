
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function RMADetails({ rma_no }) {

  const [data, setData] = useState([]);

  // Notes popup
  const [showNotesPopup, setShowNotesPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  // --------------------------------
  // Load RMA Details
  // --------------------------------

  useEffect(() => {

    if (!rma_no) return;

    axios
      .get(
        `https://rma-management.onrender.com/rma-details_r/${rma_no}`
      )
      .then((res) => {

        console.log("RMA Details:", res.data);

        setData(res.data);

      })
      .catch((err) => {

        console.log("Error loading RMA details:", err);

      });

  }, [rma_no]);

  
  // --------------------------------
  // Open Notes Popup
  // --------------------------------

  const openNotesPopup = (item) => {

    setSelectedItem(item);

    // Load existing note
    setNotes(item.notes || "");

    setShowNotesPopup(true);
  };


  // --------------------------------
  // Close Notes Popup
  // --------------------------------

  const closeNotesPopup = () => {

    if (savingNotes) return;

    setShowNotesPopup(false);
    setSelectedItem(null);
    setNotes("");

  };


  // --------------------------------
  // Save Notes
  // --------------------------------

  const saveNotes = async () => {

    if (!selectedItem) {
      return;
    }

    try {

      setSavingNotes(true);

      // Remove unnecessary spaces
      const cleanedNotes = notes.trim();

      console.log("Saving notes for item:", selectedItem.item_id);
      console.log("Notes:", cleanedNotes);

      await axios.put(
        `https://rma-management.onrender.com/update-rma-item-notes/${selectedItem.item_id}`,
        {
          notes: cleanedNotes
        }
      );


      // --------------------------------
      // Update only the selected row
      // --------------------------------

      setData((previousData) => {

        return previousData.map((item) => {

          if (item.item_id === selectedItem.item_id) {

            return {
              ...item,
              notes: cleanedNotes
            };

          }

          return item;

        });

      });


      alert("Notes saved successfully");

      closeNotesPopup();

    } catch (err) {

      console.log("Save notes error:", err);

      alert("Failed to save notes");

    } finally {

      setSavingNotes(false);

    }

  };


  // --------------------------------
  // No RMA Data
  // --------------------------------

  if (data.length === 0) {

    return <h4>No Data Found</h4>;

  }


  return (

    <div className="container mt-3 mb-3">

      <h3>RMA Details</h3>


      {/* -------------------------------- */}
      {/* Customer Details */}
      {/* -------------------------------- */}

      <div className="card p-3 mb-3">

        <p className="mb-0">

          <strong>Customer Name:</strong>{" "}

          {data[0].customer_name}

        </p>

      </div>


      {/* -------------------------------- */}
      {/* RMA Items Table */}
      {/* -------------------------------- */}

      <div className="table-responsive">

        <table className="table table-bordered">

          <thead>

            <tr>

              <th>S.No</th>

              <th>Product Name</th>

              <th>Model Number</th>

              <th>Quantity</th>

              <th>Serial No</th>

              <th>Accessory</th>

              <th>Issues</th>

              {/* Notes is immediately after Issues */}
              <th>Notes</th>

              <th>Status History</th>

              <th>Status Update</th>

            </tr>

          </thead>


          <tbody>

            {data.map((item, index) => {

              // Check whether this particular item has notes
              const hasNotes =
                item.notes &&
                item.notes.trim() !== "";


              return (

                <tr
                  key={
                    item.item_id ||
                    item.serial_no ||
                    index
                  }
                >

                  {/* S.No */}

                  <td>
                    {index + 1}
                  </td>


                  {/* Product Name */}

                  <td
                    style={{
                      backgroundColor:
                        item.outward_status
                          ?.trim()
                          .toLowerCase() === "completed"
                          ? "#ADD8E6" // Blue - RMA Out completed
                          : item.sent_to_outward
                            ? "#FFD700" // Yellow - Sent to RMA Out, pending
                            : item.status
                              ?.trim()
                              .toLowerCase() === "completed"
                              ? "#99970f" // Green - RMA Entry completed
                              : "white", // Pending and not sent

                      color:
                        item.outward_status
                          ?.trim()
                          .toLowerCase() === "completed"
                          ? "black"
                          : "black",
                    }}
                  >
                    {item.product_name}
                  </td>


                  {/* -------------------------------- */}
                  {/* Model Number */}
                  {/* -------------------------------- */}

                  <td
                    style={{
                      backgroundColor: hasNotes
                        ? "#ffb6c1"
                        : "white",

                      fontWeight: hasNotes
                        ? "600"
                        : "normal",

                      transition:
                        "background-color 0.2s ease",
                    }}
                  >

                    {item.model_number}

                  </td>


                  {/* Quantity */}

                  <td>

                    {index === 0 ||
                      data[index - 1].id !== item.id
                      ? item.quantity_no
                      : ""}

                  </td>


                  {/* Serial Number */}

                  <td>
                    {item.serial_no}
                  </td>


                  {/* Accessory */}

                  <td>
                    {item.accessory}
                  </td>


                  {/* Issues */}

                  <td>
                    {item.issues}
                  </td>


                  {/* -------------------------------- */}
                  {/* Notes */}
                  {/* -------------------------------- */}

                  <td>

                    <button
                      type="button"
                      className={
                        hasNotes
                          ? "btn btn-sm btn-outline-danger"
                          : "btn btn-sm btn-outline-primary"
                      }
                      onClick={() =>
                        openNotesPopup(item)
                      }
                    >

                      {hasNotes
                        ? "View / Edit"
                        : "Add Note"}

                    </button>

                  </td>


                  {/* -------------------------------- */}
                  {/* Status History */}
                  {/* -------------------------------- */}

                  <td>

                    <Link
                      to={`/serial-history/${item.serial_no}`}
                    >
                      View
                    </Link>

                  </td>


                  {/* -------------------------------- */}
                  {/* Status Update */}
                  {/* -------------------------------- */}

                  <td>

                    <Link
                      to={`/statuspage/${item.item_id}`}
                    >
                      Status
                    </Link>

                  </td>

                </tr>

              );

            })}

          </tbody>

        </table>

      </div>


      {/* ================================================== */}
      {/* NOTES POPUP */}
      {/* ================================================== */}

      {showNotesPopup && selectedItem && (

        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,

            backgroundColor:
              "rgba(0, 0, 0, 0.5)",

            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            zIndex: 9999,
          }}
        >

          <div
            className="card p-4"
            style={{
              width: "450px",
              maxWidth: "90%",
              boxShadow:
                "0 5px 20px rgba(0,0,0,0.3)",
            }}
          >

            {/* Popup Title */}

            <h5 className="mb-3">
              RMA Item Notes
            </h5>


            {/* Product */}

            <div className="mb-2">

              <strong>
                Product:
              </strong>{" "}

              {selectedItem.product_name}

            </div>


            {/* Model */}

            <div className="mb-2">

              <strong>
                Model:
              </strong>{" "}

              {selectedItem.model_number}

            </div>


            {/* Serial */}

            <div className="mb-3">

              <strong>
                Serial No:
              </strong>{" "}

              {selectedItem.serial_no}

            </div>


            {/* Notes Input */}

            <label className="form-label">

              <strong>
                Notes
              </strong>

            </label>

            <textarea
              className="form-control"
              rows="5"
              placeholder="Enter notes..."
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              disabled={savingNotes}
            />


            {/* Buttons */}

            <div className="mt-3 d-flex gap-2">

              <button
                type="button"
                className="btn btn-success"
                onClick={saveNotes}
                disabled={savingNotes}
              >

                {savingNotes
                  ? "Saving..."
                  : "Save"}

              </button>


              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeNotesPopup}
                disabled={savingNotes}
              >

                Cancel

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

export default RMADetails;

