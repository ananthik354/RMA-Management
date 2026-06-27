import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


function SearchModel() {
    const [modelNumber, setModelNumber] = useState("");
    const [data, setData] = useState([]);

    const handleSearch = async () => {

        try {

            const res = await axios.get(
                `http://localhost:5000/search-model/${modelNumber}`
            );

            setData(res.data);

        } catch (err) {
            console.log(err);
        }

    };
    const generatePDF = async (item) => {

        try {

            const resp = await axios.get(
                `http://localhost:5000/api/pdf/${item.id}`
            );

            const pdfData = resp.data;
            const entryDate = pdfData.entry_date.substring(0, 10);

            const doc = new jsPDF({
            orientation:"landscape",
            unit: "mm",
            format:"a4"
           });
        doc.rect(5,5,287,200);

            // Company Header
            doc.setFontSize(22);
            doc.setFont(undefined, "bold");

            doc.text(
                "M K ELECTRONICS",
                105,
                15,
                { align: "center" }
            );

            doc.setFontSize(10);
            doc.setFont(undefined, "normal");

            doc.text(
            "36B, Chakra Complex, Nalli Hospital Road, Near Erode Bus Stand, Erode - 638011",
            148,
            23,
            { align: "center" }
        );

        doc.text(
            "GSTIN: 33DSEPK8530C1Z1",
            148,
            29,
            { align: "center" }
        );

        doc.text(
            "Contact: 9003838352, 9500508118, 9003866653, 9566672229",
            148,
            35,
            { align: "center" }
        );
      doc.text(
           "E-Mail:mkelectronicsservices@gmail.com",
                148,
                40,
            { align: "center" }

            );

// RMA
 
   doc.rect(210, 50, 75, 40);

doc.setFont(undefined, "bold");
// doc.text("RMA DETAILS", 215, 58);

doc.setFont(undefined, "normal");

doc.text(`RMA No : ${pdfData.id}`, 215, 55);

doc.text(
  ` Cus DC No : ${pdfData.customer_dc_no}`,
  215,
  65
);

doc.text(
  `Entry Date : ${entryDate}`,
  215,
  75
);

doc.text(
  `Staff Name : ${pdfData.staff_name|| ""}`,
  215,
  85
);

            // Customer Details Table
            // -------- Customer Details (Text Format) --------
            doc.rect(10, 50, 190, 40);
            doc.setFontSize(11);
            doc.setFont(undefined, "bold");

            doc.text("Center Details", 15,58);

            doc.setFont(undefined, "normal");

            doc.text(
                `Customer Name : ${pdfData.customer_name || ""}`,
                 15,
                 68
                 );
                doc.text(
                   `phone : ${pdfData.phone_no || ""}`,
                    110,
                    68
                 );
                doc.text(
                ` Email : ${pdfData.email}`,
                 15,
                 78
                );
               doc.text(
 
               `Address: ${pdfData.address}`,
                110,
                78
            );


            // RMA Details Table
             autoTable(doc, {
  startY: 95,

  theme: "grid",

  head: [[
    "Product Name",
    "Model No",
    "Qty",
    "Serial No",
    "Accessory",
    "Issue"
  ]],

  body: [[
    pdfData.product_name || "",
    pdfData.model_number || "",
    pdfData.quantity_no || "",
    pdfData.serial_no || "",
    pdfData.accessory || "",
    pdfData.issues || ""
  ]],

  styles: {
    halign: "center",
    valign: "middle",
    fontSize: 10
  },

  headStyles: {
    fillColor: [220, 220, 220],
    textColor: [0, 0, 0]
  }
});     


          // Signature
            const finalY =
                doc.lastAutoTable
                    ? doc.lastAutoTable.finalY + 35
                    : 160;

            doc.text(
                "Customer Signature",
                20,
                finalY
            );

            doc.text(
                "Authorized Signature",
                135,
                finalY
            );

            // Save PDF
            doc.save(
                `RMA_${item.id}.pdf`
            );

        } catch (err) {
            console.log(err);
        }
    };



    return (
        <div style={{ padding: "20px" }}>

            <h2>Search By Model Number</h2>

            <input
                type="text"
                placeholder="Enter Model Number"
                value={modelNumber}
                onChange={(e) =>
                    setModelNumber(e.target.value)
                }
            />

            <button
                onClick={handleSearch}
                style={{ marginLeft: "10px" }}
            >
                Search
            </button>

            <br />
            <br />

            <table
                border="1"
                cellPadding="10"
                style={{
                    width: "100%",
                    borderCollapse: "collapse"
                }}
            >
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Product Name</th>
                        <th>Model Number</th>
                        <th>Quantity</th>
                        <th>Serial No</th>
                        <th>Accessory</th>
                        <th>Issues</th>
                        <th>Entry Date</th>
                        <th>pdf</th>
                    </tr>
                </thead>

                <tbody>

                    {data.length > 0 ? (

                        data.map((item) => (

                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.product_name}</td>
                                <td>{item.model_number}</td>
                                <td>{item.quantity_no}</td>
                                <td>{item.serial_no}</td>
                                <td>{item.accessory}</td>
                                <td>{item.issues}</td>
                                <td>
                                    {item.entry_date
                                        ? item.entry_date.substring(0, 10)
                                        : ""}
                                </td>
                                <td>
                                    <button
                                        className="view-btn"
                                        onClick={() => generatePDF(item)}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>

                        ))

                    ) : (

                        <tr>
                            <td
                                colSpan="9"
                                style={{
                                    textAlign: "center"
                                }}
                            >
                                No Data Found
                            </td>
                        </tr>

                    )}

                </tbody>
                

            </table>

        </div>
    );
}

export default SearchModel;