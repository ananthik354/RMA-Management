import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function HistoryPage1() {

  const { rma_id } = useParams();

  const [data, setData] = useState([]);

  useEffect(() => {

    axios
      .get(`http://localhost:5000/history_l/${rma_id}`)
      .then((res) => {

        setData(res.data);

      });

  }, [rma_id]);

  return (

    <div className="container mt-3">

      <h2>Status History</h2>

      <table border="1">

        <thead>

          <tr>

            <th>RMA ID</th>
            <th>Customer Name</th>
            <th>Status Reason</th>
            <th>Updated Date</th>

          </tr>

        </thead>

        <tbody>

          {data.map((item) => (

            <tr key={item.history_id}>

              <td>{item.rma_id}</td>

              <td>{item.customer_name}</td>

              <td>{item.status_text}</td>

              <td>
                {
                  new Date(item.updated_date)
                    .toLocaleString()
                }
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default HistoryPage1;

