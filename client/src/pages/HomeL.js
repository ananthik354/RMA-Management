import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Home_l.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const HomeL = () => {

    const [data, setData] = useState([]); // MUST BE []
const role=localStorage.getItem("role")
    useEffect(() => {
        loadData();
    }, []);

    const reminderDate =
        new Date();

    reminderDate.setDate(
        reminderDate.getDate() + 3
    );

    const formattedDate =
        reminderDate
            .toISOString()
            .split("T")[0];

    const loadData = async () => {
        try {
            const response = await axios.get(
                "https://rma-management.onrender.com/api/get_P"
            );

            console.log(response.data);

            // Safety check
            setData(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {
            console.log(error);
        }
    };


    const deleteRMA = async (rma_no) => {

        if (!window.confirm("Are you sure you want to delete this RMA?")) {
            return;
        }

        try {

            await axios.delete(
                `https://rma-management.onrender.com/delete-rma_r/${rma_no}`
            );

            alert("Deleted Successfully");

            loadData(); // reload table

        } catch (err) {

            console.log(err);

        }

    };

    const generatePDF = async (item) => {

        try {

            const resp = await axios.get(
                `https://rma-management.onrender.com/api/pdf/${item.rma_no}`
            );

            const pdfData = resp.data;

            console.log("RESP DATA:", pdfData);

            if (!pdfData || pdfData.length === 0) {
                alert("No Data Found");
                return;
            }

            const headerData = pdfData[0];

          const entryDate = headerData.entry_date || "";



            const doc = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: "a5"
            });
            doc.rect(5, 5, 200, 138);

            // Company Header
            doc.setFontSize(16);
            doc.setFont(undefined, "bold");

            doc.text("M K Electronics", 105, 15, {
                align: "center"
            });
            doc.setFontSize(8);
            doc.setFont(undefined, "normal");
            doc.text(
                "GSTIN: 33DSEPK8530C1Z1",
                195,
                15,
                { align: "right" }
            );

            doc.setFontSize(9);
            doc.setFont(undefined, "bold");
            
            doc.text(
                "36B, Chakra Complex, Nalli Hospital Road, Near Erode Bus Stand, Erode - 638011,  Email: mkelectronicservices@gmail.com",
                105,
                22,
                { align: "center" }
            );

            // doc.text(
            //     "GSTIN: 33DSEPK8530C1Z1",
            //     105,
            //     27,
            //     { align: "center" }
            // );

            doc.text(
                "Contact: 9003838352, 9500508118, 9003866653",
                105,
                27,
                { align: "center" }
            );

            
            // RMA

            // doc.rect(10, 45, 120, 35);
            doc.rect(138, 35, 58, 27);
            doc.setFontSize(8);
            doc.setFont(undefined, "normal");

            doc.text(
                `RMA No : ${headerData.rma_no}`,
                142,
                45
            );

            doc.text(
                `Entry Date : ${entryDate}`,
                142,
                50
            );

            doc.text(
                `Staff Name : ${headerData.created_by_name || ""}`,
                142,
                55
            );


            const drawMiniHeader = () => {

                

                  doc.setLineWidth(0.2);
    // doc.rect(5, 5, 200, 25);
    doc.setFontSize(12);
                doc.setFont(undefined, "bold");

                doc.text(
                    "MK Electronics",
                    100,
                    9,
                    { align: "center" }
                );

                doc.setFontSize(8);
                doc.setFont(undefined, "normal");

                // Single Line
                doc.text( `Customer Name : ${headerData.customer_name || ""}`,11,16);

                doc.text(`Phone : ${headerData.phone_no || ""}`, 60, 16);

                doc.text( `RMA No : ${headerData.rma_no || ""}`,110, 16);

                doc.text(`Entry Date : ${entryDate}`, 155, 16);
                // doc.line(10, 13, 200, 13);
            };

            autoTable(doc, {
                startY: 65,
                margin: {
                    top: 45
                },

                didDrawPage: function (data) {
                    if (data.pageNumber > 1) {
                        drawMiniHeader();
                        
                    }
                },

                

            });

            // Customer Details Table
            // -------- Customer Details (Text Format) --------
            doc.rect(13, 35, 120, 28);
            doc.setFontSize(11);
            doc.setFont(undefined, "bold");

            doc.text(
                "Customer Details",
                17,
                41
            );

            doc.setFont(undefined, "normal");
            doc.setFontSize(9);

            doc.text(
                `Customer Name: ${headerData.customer_name || ""}`,
                17,
                48
            );

            doc.text(
                `Phone : ${headerData.phone_no || ""}`,
                75,
                48
            );

            doc.text(
                `Company Name : ${headerData.company_name || "null"}`,
                17,
                54
            );

            doc.text(
                `Address : ${headerData.address || ""}`,
                75,
                54,
                {
        maxWidth: 110
    }
            );
            doc.text(
                `Email : ${headerData.email || "null"}`,
                17,
                60
            );

            // RMA Details Table
            autoTable(doc, {
                startY: 68,

                theme: "grid",

                head: [[
                    "Product Name",
                    "Model No",
                    "Qty",
                    "Serial No",
                    "Accessory",
                    "Issue"
                ]],

                body: pdfData.map((row, index) => {
                    const prevRow = pdfData[index - 1];

                    const showQty =
                        index === 0 ||
                        !prevRow ||
                        prevRow.product_name !== row.product_name ||
                        prevRow.model_number !== row.model_number;

                    return [
                        row.product_name || "",
                        row.model_number || "",
                        showQty ? row.quantity_no : "",
                        row.serial_no || "",
                        row.accessory || "",
                        row.issues || ""
                    ];
                }),

                // didDrawPage: function (data) {

                //     if (data.pageNumber > 1) {
                //         drawMiniHeader();
                //     }
                // },
                margin: {
        top: 25   // space reserved for header on every page
    },

    willDrawPage: function (data) {

        if (data.pageNumber > 1) {

            drawMiniHeader();

            // move table below header
            data.settings.margin.top = 25;
        }
    },


                styles: {
                    fontSize: 9,
                    halign: "center",
                    valign: "middle"
                },

                headStyles: {
                    fillColor: [220, 220, 220],
                    textColor: [0, 0, 0]
                }
            });
            // Signature
            const pageHeight = doc.internal.pageSize.height;

            doc.setFontSize(8);

            doc.text(
                "Customer Signature",
                15,
                 pageHeight - 20
            );

            doc.text(
                "Authorized Signature",
                140,
                 pageHeight - 20
                // finalY+20
            );




            // Save PDF
            doc.save(
                `RMA_${item.rma_no}.pdf`
            );

        } catch (err) {
            console.log(err);
        }
    };


    const shareWhatsApp = (item) => {

        const message = `
RMA Details

RMA No: ${item.id}
Product Name: ${item.product_name}
Model Number: ${item.model_number}
Quantity: ${item.quantity_no}
Serial No: ${item.serial_no}
Accessory: ${item.accessory}

Reminder Date: ${item.reminder_date}
`;

        const whatsappUrl =
            `http://wa.me/?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, "_blank");

    };

    return (
        <div className="top-btns">
            <div className="top-buttons">

                <Link to="/Dashboard">
                    <button className="back-btn">
                        Go Back
                    </button>
                </Link>


                <Link to="/home/add">
                    <button className="btn-phone">
                        Add RMA Entry
                    </button>
                </Link>

            </div>

            <table className="rma-table">
                <thead>
                    <tr>
                        <th>RMA NO</th>
                        <th>Customer Name</th>
                        <th>Product Name</th>
                        <th>Model Number</th>
                        <th>Quantity</th>
                        {/* <th>Serial No</th>
                        <th>Accessory</th> */}
                        <th>Status</th>
                        <th>Entry Date</th>
                        <th>status</th>
                        <th>Summary</th>
                        {role === "admin" && (
                      <>
                        <th>Action</th>
                        </>)}

                        <th>View</th>
                        <th>Share</th>

                    </tr>
                </thead>

                <tbody>
                    {data.map((item, index) => {
                        return (
                            <tr key={item.id}>
                                <td>{item.rma_no}</td>
                                <td>{item.customer_name}</td>
                                <td>{item.product_name}</td>
                                <td>{item.model_number}</td>
                                <td>{item.quantity_no}</td>
                                {/* <td>{item.serial_no}</td>
                                <td>{item.accessory}</td> */}
                                <td>{item.status}</td>

                                <td>
                                    {item.entry_date
                                        ? new Date(item.entry_date).toLocaleDateString("en-GB")
                                        : "-"}
                                </td>

                                <td>{item.status}</td>
                                <td>
                                    <Link

                                        to={`/rma-details_r/${item.rma_no}`}
                                    >
                                        View
                                    </Link>
                                </td>
{role === "admin" && (
                      <>                             <td>
                                    <Link to={`/update-rma_in/${item.rma_no}`}>
                                        <button className="edit-btn">
                                            Edit
                                        </button>
                                    </Link>

                                    <button
                                        className="delete-btn"
                                        onClick={() =>
                                            deleteRMA(item.rma_no)
                                        }
                                    >
                                        Delete
                                    </button>




                                </td>
</>
                             )}                             {/* <td>
                                    <Link to={`/status-history_lsr/${item.id}`}>
                                        <button className="btn btn-view">
                                            View History
                                        </button>
                                    </Link>



                                </td> */}
                                {/* <td>
                                    <Link to={`/search-model/${item.model_number}`}>
                                        <button className="edit-btn">
                                            search
                                        </button>
                                    </Link>
                                </td> */}
                                <td>
                                    <button
                                        className="btn-view"
                                        onClick={() => generatePDF(item)}
                                    >
                                        PDF
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="share-btn"
                                        onClick={() => shareWhatsApp(item)}
                                    >
                                        WhatsApp
                                    </button>
                                </td>
                            </tr>



                        );
                    })}
                </tbody>
            </table>
        </div >
    );

}

export default HomeL;