import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams,Link } from "react-router-dom";


function RmaIn_Update() {

  const { rma_no } = useParams();

  console.log("rma_no =", rma_no);

  const [data, setData] = useState([]);

  useEffect(() => {

    axios
      .get(`http://localhost:5000/rma-details_r/${rma_no}`)
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

  }, [rma_no]);

const handleChange = (
  index,
  field,
  value
) => {

  const updatedData = [...data];

  updatedData[index][field] = value;

  setData(updatedData);

};

const updateData = async () => {

  try {

    await axios.put(
      `http://localhost:5000/update-rma_in/${rma_no}`,
      data
    );

    alert("Updated Successfully");

  } catch (err) {

    console.log(err);

  }

};

const updateStatus = async () => {

    try {

        await axios.put(
            `http://localhost:5000/update-rma-status/${rma_no}`,
            {
                status: "Completed"
            }
        );

        alert("RMA Completed");

        window.location.reload();

    } catch (err) {

        console.log(err);

        alert("Update Failed");

    }

};

  if (data.length === 0) {
    return <h4>No Data Found</h4>;
  }

  return (
    <div className="container mt-4">

      <h3>RMA Details</h3>

      {/* Header Details */}
      <div className="card p-3 mb-3">
        <p>
          <strong>Customer :</strong>{" "}
          {data[0].customer_name}
        </p>


      </div>

      {/* <div className="mb-3">

    <button
        className="btn btn-success"
        onClick={updateStatus}
    >
        Complete RMA
    </button> */}

{/* </div> */}

      {/* Serial Details */}
      <table className="table table-bordered">
 <thead>
          <tr>

            <th>S.No</th>
            <th>product Name</th>
            <th>model Number</th>
           
            <th>Serial No</th>
            <th>Accessory</th>
            <th>Issues</th>
          </tr>
        </thead>
        <tbody>
  {data.map((item, index) => (
    <tr key={item.id}>

      <td>{index + 1}</td>
      <td>
        <input
  value={item.product_name || ""}
  onChange={(e) =>
    handleChange(index, "product_name", e.target.value)
  }
/>
      </td>
      <td>
        <input
  value={item.model_number || ""}
  onChange={(e) =>
    handleChange(index, "model_number", e.target.value)
  }
/>

      </td>
      

      <td>
        <input
          type="text"
          className="form-control"
          value={item.serial_no || ""}
          onChange={(e) =>
            handleChange(
              index,
              "serial_no",
              e.target.value
            )
          }
        />
      </td>

      <td>
        <input
          type="text"
          className="form-control"
          value={item.accessory || ""}
          onChange={(e) =>
            handleChange(
              index,
              "accessory",
              e.target.value
            )
          }
        />
      </td>

      <td>
        <input
          type="text"
          className="form-control"
          value={item.issues || ""}
          onChange={(e) =>
            handleChange(
              index,
              "issues",
              e.target.value
            )
          }
        />
      </td>

    </tr>
  ))}
</tbody>

<button
  className="btn btn-primary"
  onClick={updateData}
>
  Update
</button>

<Link to="/home/home_l">
                    <button className="back-btn">
                        Go Back
                    </button>
                </Link>

      </table>

    </div>
  );
}

export default RmaIn_Update;