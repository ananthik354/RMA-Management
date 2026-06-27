import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate,useParams ,Link} from "react-router-dom";

function History1() {
    const navigate = useNavigate();
    // const { item_id } = useParams();
     const { serial_no } = useParams();

    const [history, setHistory] = useState([]);

   useEffect(() => {

    axios
        .get(`https://rma-management.onrender.com/serial-history/${serial_no}`)
        .then(res => {

            console.log("HISTORY RESPONSE:", res.data);

            setHistory(res.data);

        })
        .catch(err => {
            console.log(err);
        });

}, [serial_no]);

    return (

        <div className="container mt-4">

            <h3>Status History</h3>

            <table className="table table-bordered">

                <thead>
                    <tr>
                        <th>table</th>
                        {/* <th>created_by</th> */}
                        <th>Updated_by</th>
                        <th>Status</th>
                        <th>Status Text</th>
                        <th>Updated At</th>
                        
                    </tr>
                </thead>

                <tbody>

                    {history.length > 0 ? (

                        history.map((row, index) => (

                            <tr key={index}>
                                <td>{row.source}</td>
                                {/* <td>{row.created_by_name}</td> */}
                                <td>{row.updated_by}</td>
                                <td>{row.status}</td>

                                <td>{row.status_text}</td>

                                <td>
                                    {new Date(
                                        row.updated_at
                                    ).toLocaleString()}
                                </td>

                            </tr>

                        ))

                    ) : (

                        <tr>
                            <td colSpan="3">
                                No History Found
                            </td>
                        </tr>

                    )}

                </tbody>
                <button
    className="btn btn-secondary mb-3"
    onClick={() => navigate(-1)}
>
    Back
</button>


            </table>

        </div>

    );
}

export default History1;