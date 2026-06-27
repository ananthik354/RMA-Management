import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams,Link } from "react-router-dom";


function RMADetails() {
  
  const { rma_no } = useParams();

  console.log("rma_no =", rma_no);

  const [data, setData] = useState([]);

  useEffect(() => {

    axios
      .get(`https://rma-management.onrender.com/rma-details_r/${rma_no}`)
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

  }, [rma_no]);



const updateStatus = async () => {

    try {

        await axios.put(
            `https://rma-management.onrender.com/update-rma-status/${rma_no}`,
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
    </button>

</div> */}

      {/* Serial Details */}
      <table className="table table-bordered">

        <thead>
          <tr>

            <th>S.No</th>
            <th>product Name</th>
            <th>model Number</th>
            <th>quantity</th>
            <th>Serial No</th>
            <th>Accessory</th>
            <th>Issues</th>
            <th>statusHistory</th>
            <th>status update</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={item.serial_no || index}
            >
              <td>{index + 1}</td>
              <td style={{
        backgroundColor:
            item.status?.trim().toLowerCase() === "completed"
                ? "#99970f"
                : "white"
    }}>{item.product_name}</td>
              <td>{item.model_number}</td>
              <td>
  {index === 0 ||
  data[index - 1].id !== item.id
    ? item.quantity_no
    : ""}
</td>
              <td>{item.serial_no}</td>
              <td>{item.accessory}</td>
              <td>{item.issues}</td>
              <td> <Link

                to={`/serial-history/${item.serial_no}`}
              >
                View
              </Link>
              
              </td>
              <td>
                <Link

                to={`/statuspage/${item.item_id}`}
              >
                status
              </Link>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
      <Link to="/home/home_l">
                          <button className="back-btn">
                              Go Back
                          </button>
                      </Link>

    </div>
  );
}

export default RMADetails;