import React, { useEffect, useState } from "react";
import axios from "axios";

import "./Add.css";
import { Link } from "react-router-dom";


const Add= () => {
    const today = new Date().toISOString().split("T")[0];
const userId = localStorage.getItem("user_id");

console.log("Logged User:", userId);

    const [customerId, setCustomerId] = useState("");
    const [customerDcNo, setCustomerDcNo] = useState("");
  // const [entryDate, setEntryDate] = useState("");
    //   const [servicesId, setServicesId] = useState("");
    const [services, setServices] = useState([]);
    const [products, setProducts] = useState([
        {
            product_name: "",
            model_number: "",
            quantity_no: "",

            items: [
                // {
                //     serial_no: "",
                //     accessory: "",
                //     issues: ""
                // }
            ]
        }
    ]);

    const addProduct = () => {
        setProducts([
            ...products,
            {
                product_name: "",
                model_number: "",
                quantity_no: "",

                items: [
                    // {
                    //     serial_no: "",
                    //     accessory: "",
                    //     issues: ""
                    // }
                ]
            }
        ]);
    };


    // const addSerial = (productIndex) => {
    //     const updated = [...products];

    //     updated[productIndex].items.push({
    //         serial_no: "",
    //         accessory: "",
    //         issues: ""
    //     });

    //     setProducts(updated);
    // };

    useEffect(() => {
        axios
            .get("http://localhost:5000/get-services_r")
            .then((res) => {
                setServices(res.data);
            });
    }, []);

    const handleProductChange = (
        index,
        field,
        value
    ) => {

        const updated = [...products];
        updated[index][field] = value;
        setProducts(updated);

    };

    const handleItemChange = (
        productIndex,
        itemIndex,
        field,
        value
    ) => {

        const updated = [...products];

        updated[productIndex]
            .items[itemIndex][field] = value;

        setProducts(updated);

    };

    const handleQuantityChange = (pIndex, value) => {
        const qty = parseInt(value) || 0;

        const updated = [...products];

        updated[pIndex].quantity_no = qty;

        updated[pIndex].items = Array.from(
            { length: qty },
            () => ({
                serial_no: "",
                accessory: "",
                issues: ""
            })
        );

        setProducts(updated);
    };

    const saveData = async () => {

        try {

const userId = localStorage.getItem("id");

console.log("USER ID FROM STORAGE:", userId);

            const payload = {
                customer_id: customerId,
                customer_dc_no:customerDcNo,
                entry_date: today,
                products,
                created_by:userId
            };


            const res = await axios.post(
                "http://localhost:5000/api/entry_in",
                payload
            );

            alert(
                "Saved Successfully\nRMA No : " +
                res.data.rma_no
            );

        } catch (err) {

            console.log(err);

            alert("Error Saving Data");

        }

    };

    return (
        <div className="container mt-4">
            
<div className="row-md-4">
     <h2>RMA Entry</h2>

<div className="button-row">
           
         <div className="col-md-4">

            <label>Customer Name</label>

            <select
                className="form-control"
                value={customerId}
                onChange={(e) =>
                    setCustomerId(e.target.value)
                }
            >
                <option value="">
                    Select Customer
                </option>

                {services.map((item) => (
                    <option
                        key={item.id}
                        value={item.id}
                    >
                        {item.customer_name}
                    </option>
                ))}
            </select>
         </div><div className="col-md-4">    
                            <label>Customer DC No</label>

                            <input
                                className="form-control"
                                value={customerDcNo}
                                onChange={(e) =>
                                    setCustomerDcNo(
                                        e.target.value
                                    )
                                }
                            />
                        </div>
           
<div className="col-md-4">
                {/* <label>Entry Date</label>
            <input
                type="date"
                className="form-control"
                value={entryDate}
                onChange={(e) =>
                    setEntryDate(e.target.value)
                }
            /> */}
            
             {/* <div className="mb-3"> */}

                <label>Entry Date</label>

                <input
                    type="date"
                    className="form-control"
                    value={today}
                    readOnly
                /> 

    </div></div>
    
            
        {products.map((product, pIndex) => (

            <div
                key={pIndex}
                className="card p-3 mb-4"
            >

                <h5>
                    Product {pIndex + 1}
                </h5>

                <div className="row">

                    <div className="col-md-4">

                        <label>
                            Product Name
                        </label>

                        <input
                            className="form-control"
                            value={product.product_name}
                            onChange={(e) =>
                                handleProductChange(
                                    pIndex,
                                    "product_name",
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <div className="col-md-4">

                        <label>
                            Model Number
                        </label>

                        <input
                            className="form-control"
                            value={product.model_number}
                            onChange={(e) =>
                                handleProductChange(
                                    pIndex,
                                    "model_number",
                                    e.target.value
                                )
                            }
                        />

                    </div>
                    {/* <div className="col-md-4">
                            <label>Customer DC No</label>

                            <input
                                className="form-control"
                                value={products.customer_dc_no}
                                onChange={(e) =>
                                    handleProductChange(
                                        pIndex,
                                        "customer_dc_no",
                                        e.target.value
                                    )
                                }
                            />
                        </div> */}

                    <div className="col-md-4">

                        <label>
                            Quantity
                        </label>

                        <input
                            type="number"
                            className="form-control"
                            value={product.quantity_no}
                            onChange={(e) =>
                                handleQuantityChange(pIndex, e.target.value)
                            }
                        />

                    </div>

                </div>

                <hr />

                {product.items.map(
                    (item, iIndex) => (

                        <div
                            className="row mb-3"
                            key={iIndex}
                        >

                            <div className="col-md-4">

                                <label>
                                    Serial No
                                </label>

                                <input
                                    className="form-control"
                                    value={item.serial_no}
                                    onChange={(e) =>
                                        handleItemChange(
                                            pIndex,
                                            iIndex,
                                            "serial_no",
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                            <div className="col-md-4">

                                <label>
                                    Accessory
                                </label>

                                <input
                                    className="form-control"
                                    value={item.accessory}
                                    onChange={(e) =>
                                        handleItemChange(
                                            pIndex,
                                            iIndex,
                                            "accessory",
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                            <div className="col-md-4">

                                <label>
                                    Issues
                                </label>

                                <input
                                    className="form-control"
                                    value={item.issues}
                                    onChange={(e) =>
                                        handleItemChange(
                                            pIndex,
                                            iIndex,
                                            "issues",
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                        </div>

                    )
                )}

                {/* <button
                        className="btn btn-secondary"
                        onClick={() =>
                            addSerial(pIndex)
                        }
                    >
                        + Add Serial
                    </button> */}

            </div>

        ))
    }

           <div className="button-row">
    <button
        className="btn btn-primary"
        onClick={addProduct}
    >
        + Add Product
    </button>

    <button
        className="btn btn-success"
        onClick={saveData}
    >
        Save
    </button>

    <Link to="/home/home_l">
        <button className="back-btn">
            Back
        </button>
    </Link>
   </div> 
</div>
</div>
        
    );
}



export default Add;


