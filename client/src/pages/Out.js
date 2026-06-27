import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Out.css";
import { Link, useNavigate, useParams } from "react-router-dom";


const Out = () => {
    const today = new Date().toISOString().split("T")[0];
    const [serialNo, setSerialNo] = useState("");

const [items, setItems] = useState([]);
    const [servicesId, setServicesId] = useState("");
    //   const [customerDcNo, setCustomerDcNo] = useState("");
    const [entryDate, setEntryDate] = useState("");
    //   const [servicesId, setServicesId] = useState("");
    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState({

        services_id: "",

        product_name: "",
        model_number: "",
        quantity_no: "",
        
        entry_date:"",
        //serial_no: "",
        accessory: "",
        issues: ""

    });
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
console.log("FORMDATA", formData);
console.log("PRODUCTS", products);

    // const addSerial = (productIndex) => {
    //     const updated = [...products];

    //     updated[productIndex].items.push({
    //         serial_no: "",
    //         accessory: "",
    //         issues: ""
    //     });

    //     setProducts(updated);
    // };
const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
};
    useEffect(() => {
        axios
            .get("https://rma-management.onrender.com/get-services")
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

 const searchSerial = async () => {

    try {

        const res = await axios.get(
            `https://rma-management.onrender.com/search-serial/${serialNo}`
        );
        if (!res.data.success) {
    alert(res.data.message);
    return;
}

        // if (res.data.length === 0) {
        //     alert("Serial Not Found");
        //     return;
        // }
        if (res.data.exists) {

            alert(res.data.message);

            setFormData({
                ...formData,
                serial_no: ""
            });

            return;
        }
console.log("API RESPONSE:", res.data);
        const row = res.data.data;

        setFormData({
            product_name: row.product_name,
            model_number: row.model_number,
        
            serial_no: row.serial_no,
            accessory: row.accessory,
            issues: row.issues
        });

    } catch (err) {
        console.log(err);
    }

};

        // Prepare for save
     const addSerial = () => {
    if (!formData.serial_no) {
        alert("Search Serial First");
        return;
    }
    const alreadyExists = items.some(
        item => item.serial_no === formData.serial_no
    );

    if (alreadyExists) {
        alert("This Serial Number is already added");
        return;
    }

    setItems(prev => [
        ...prev,
        {
            serial_no: formData.serial_no,
            product_name: formData.product_name,
            model_number: formData.model_number,
            accessory: formData.accessory,
            issues: formData.issues
        
        }
    ]);
       // Clear previous searched data
    setFormData({
        product_name: "",
        model_number: "",
        customer_dc_no: "",
        serial_no: "",
        accessory: "",
        issues: ""
    });
    // optional: clear after adding
    setSerialNo("");
};

// const exists = items.some(
//     item => item.serial_no === formData.serial_no
// );

// if (exists) {
//     alert("Serial already added");
//     return;
// }
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

    //      if (!entryDate) {
    //     alert("Select Entry Date");
    //     return;
    // }

    if (!servicesId) {
        alert("Select Service Center");
        return;
    }

    if (items.length === 0) {
        alert("Add Serial Number");
        return;
    }
const userId = localStorage.getItem("id");

console.log("USER ID FROM STORAGE:", userId);
        const payload = {

            services_id: servicesId,
            entry_date: today,
            items: items,
            created_by:userId
        };

        const res = await axios.post(
            "https://rma-management.onrender.com/api/entry_out",
            payload
        );

        alert(
            "Saved Successfully\nRMA No : " +
            res.data.rma_no
        );

    } catch (err) {

    console.log("FULL ERROR:", err);

    console.log("SERVER ERROR:",
        err.response?.data
    );

    alert(
        err.response?.data?.message ||
        "Save Failed"
    );
}
};
    return (
        <div className="out-page">

            <div className="out-card">

    <h2>RMA OUT ENTRY</h2>
 <div className="top-row">

        <div className="field">
    {/* CENTER + DATE */}
    <label>Service Center</label>

            <select
                className="out-input"
                value={servicesId}
                onChange={(e) =>
                    setServicesId(e.target.value)
                }
            >
                <option value="">
                    Select Center
                </option>

                {services.map((item) => (
                    <option
                        key={item.id}
                        value={item.id}
                    >
                        {item.center_name}
                    </option>
                ))}
            </select>
</div>
<div className="field">
            <label>Date</label>
     <input
                    type="date"
                    className="form-control"
                    value={today}
                    readOnly
                />
</div></div>
    
<div className="search-row">
    {/* SERIAL SEARCH */}
    <input
        className="out-input"
        placeholder="Serial No"
        value={serialNo}
        onChange={(e) => setSerialNo(e.target.value)}
    />

    <button className="search-btn" onClick={searchSerial}>Search</button>
    <button className="add-btn" onClick={addSerial}>Add</button>

    </div>
<div className="form-row">

        <div className="field">
    {/* AUTO FILL */}
    <label>Product Name</label>
    <input className="out-input" placeholder="product Name" value={formData.product_name} readOnly /></div>
    <div className="field">
        <label>Model number</label>
    <input className="out-input" placeholder="Model Number" value={formData.model_number} readOnly /></div></div>
     <div className="form-row">

        <div className="field">
            <label>Accessory</label>
    <input className="out-input" placeholder="Accessory" value={formData.accessory} readOnly /></div>
    <div className="field">
            <label>Issues</label>
    <input className="out-input" placeholder="Issues" value={formData.issues}  onChange={(e) =>
        setFormData({
            ...formData,
            issues: e.target.value
        })
    } />

    </div></div>

    {/* TABLE */}
    <table className="out-table">
        <thead>
            <tr>
                <th>Serial</th>
                <th>Product</th>
                <th>Model</th>
                <th>Accessory</th>
                <th>Issues</th>
                <th>Delete</th>
            </tr>
        </thead>

        <tbody>
            {items.map((item, index) => (
                <tr key={index}>
                    <td>{item.serial_no}</td>
                    <td>{item.product_name}</td>
                    <td>{item.model_number}</td>
                    <td>{item.accessory}</td>
                    <td>{item.issues}</td>
                    <td>
            <button
                onClick={() => removeItem(index)}
                className="btn btn-warning btn-sm"
            >
                CANCEL
            </button>
        </td>
                </tr>
            ))}
        </tbody>
    </table>

    <button onClick={saveData}>Save</button>
    <Link to="/home/home_z">
                                      <button className="back-btn">
                                          Go Back
                                      </button>
                                  </Link>

</div>
     </div >
    );
}



export default Out;
        


            {/* <label>Service Center</label>

            <select
                className="form-control"
                value={servicesId}
                onChange={(e) =>
                    setServicesId(e.target.value)
                }
            >
                <option value="">
                    Select Center
                </option>

                {services.map((item) => (
                    <option
                        key={item.id}
                        value={item.id}
                    >
                        {item.center_name}
                    </option>
                ))}
            </select>
            <div className="mb-3">

                <label>Entry Date</label>
            <input
                type="date"
                className="form-control"
                value={entryDate}
                onChange={(e) =>
                    setEntryDate(e.target.value)
                }
            /> */}
            
            {/* <div className="mb-3">

                <label>Entry Date</label>

                <input
                    type="date"
                    className="form-control"
                    value={today}
                    readOnly
                /> */}

    {/* </div>

            {
        products.map((product, pIndex) => (

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

                    </div> */}
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

                    {/* <div className="col-md-4">

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
                )} */}

                {/* <button
                        className="btn btn-secondary"
                        onClick={() =>
                            addSerial(pIndex)
                        }
                    >
                        + Add Serial
                    </button> */}

            {/* </div>

        ))
    }

            <button
                className="btn btn-primary me-2"
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


            <Link to="/home/home_z">
                                      <button className="back-btn">
                                          Go Back
                                      </button>
                                  </Link>
             */}

   


