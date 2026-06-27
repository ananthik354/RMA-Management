import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

import {
 useParams
} from "react-router-dom";

const UpdateStatus = () => {

 const { id } = useParams();

 const [statusText,
 setStatusText] = useState("");

 const [statusDate,
 setStatusDate] = useState("");

 const [data,setData] = useState([]);

 useEffect(() => {

   axios.get(
   `http://localhost:5000/api/status/${id}`
   )
   .then((res) => {
      setData(res.data);
      console.log(res.data)
   });

 }, [id]);

 const saveStatus = async () => {

    try {

        await axios.post(
        "http://localhost:5000/api/status",
        {
            rma_id: id,
            status_text:
            statusText,

            status_date:
            statusDate
        });

        alert(
        "Status Updated"
        );

    } catch(err){

        console.log(err);
    }
};

 return (

<div>

<h2>Status Update</h2>

<input
type="text"
placeholder="Enter Status"
value={statusText}
onChange={(e)=>
setStatusText(
e.target.value
)}
/>

<input
type="date"
value={statusDate}
onChange={(e)=>
setStatusDate(
e.target.value
)}
/>

<button
onClick={saveStatus}
>
Update Status
</button>

<h3>Status History</h3>

<table border="1">

<thead>
<tr>
<th>Status</th>
<th>Date</th>
</tr>
</thead>

<tbody>

{Array.isArray(data) &&
data.map((item) => (

<tr key={item.status_id}>

<td>
{item.status_text}
</td>

<td>
{item.status_date}
</td>

</tr>

))}

</tbody>
</table>

</div>
 );
};

export default UpadateStatus;