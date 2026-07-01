import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Home_z.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const HomeZ = () => {

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
                "https://rma-management.onrender.com/api/get_o"
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
                `https://rma-management.onrender.com/delete-rma/${rma_no}`
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
                `https://rma-management.onrender.com/api/pdf1/${item.rma_no}`
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
            const address = headerData.address || "";

const addressLines = doc.splitTextToSize(address, 200);

// Box height based on address
const customerBoxHeight = Math.max(
    28,
    20 + addressLines.length * 5);

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
            doc.rect(14, 31, 180, 8);

// doc.setFontSize(11);
// doc.setFont(undefined, "bold");
// doc.text("RMA Details", 17, 26);

doc.setFontSize(9);
doc.setFont(undefined, "normal");

// First row
doc.text(`RMA No : ${headerData.rma_no || ""}`, 17, 35);

doc.text(`Entry Date : ${entryDate || ""}`, 70, 35);

doc.text(`Staff Name : ${headerData.created_by_name || ""}`, 125, 35);


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
                doc.text( `S.Center Name : ${headerData.center_name || ""}`,11,16);
                doc.text( `RMA No : ${headerData.rma_no || ""}`,66, 16);
                doc.text(`Phone : ${headerData.phone_no || ""}`, 110, 16);

               

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
            doc.rect(14, 40, 180, customerBoxHeight);
            doc.setFontSize(11);
            doc.setFont(undefined, "bold");

            doc.text(
                "Service Center Details",
                17,
                46
            );

            doc.setFont(undefined, "normal");
            doc.setFontSize(9);

            doc.text(
                `S.Center Name: ${headerData.center_name || ""}`,
                17,
                52
            );

            doc.text(
                `Phone : ${headerData.phone_no || ""}`,
                122,
                52
            );

            doc.text(
                `Email : ${headerData.email || ""}`,
                17,
                58
            );

            doc.text("Address :", 17, 64);
            addressLines.forEach((line, index) => {
                doc.text(line, 35, 64 + index * 5);
            });
            const tableStartY = 35+ customerBoxHeight + 8;
                        // RMA Details Table
                        autoTable(doc, {
                            startY: tableStartY,

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
                        index === 0 ? row.quantity_no : "",
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
            // const finalY =
            //     doc.lastAutoTable
            //         ? doc.lastAutoTable.finalY + 15
            //         : 100;
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

Entry Date: ${item.entry_date}
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


                <Link to="/home/Out">
                    <button className="btn-phone">
                        + Add RMA outer
                    </button>
                </Link>

            </div>
            <table>
                <thead>
                    <tr>
                        <th>RMA NO</th>
                        <th>Center Name</th>
                        <th>Product Name</th>
                        <th>Model Number</th>
                        <th>Quantity</th>

                        <th>status</th>
                        <th>Entry Date</th>
                        <th>view</th>
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
                                <td style={{
        backgroundColor:
            item.status?.trim().toLowerCase() === "completed"
                ? "#99970f"
                : "white"
    }}>{item.rma_no}</td>
                                <td>{item.center_name}</td>
                                <td>{item.product_name}</td>
                                <td>{item.model_number}</td>
                                <td>{item.quantity_no}</td>


                                <td>{item.status}</td>

                                <td>
                                    {item.entry_date
                                        ? new Date(item.entry_date).toLocaleDateString("en-GB")
                                        : "-"}
                                </td>
                                <td>

                                    <Link

                                        to={`/rma-details/${item.rma_no}`}
                                    >
                                        View
                                    </Link>

                                </td>
{role === "admin" && (
                      <>
                                <td>
                                    <Link to={`/update-rma/${item.rma_no}`}>
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
                                            </>)}


                                
                                {/* <td>
                                    <Link to={`/history_l/${item.id}`}>
                                        <button className="btn btn-view">
                                            View History
                                        </button>
                                    </Link>



                                </td> */}
                                <td>
                                    <button className="btn-view"
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

export default HomeZ;