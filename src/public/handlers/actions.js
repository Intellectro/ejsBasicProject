const addButton = document.querySelector("[data-id='add-product']");
const productInput = document.querySelector("[data-id='product-input']");
const editBtns = document.querySelectorAll('[data-id="edit-btn"]')
const deleteBtns = document.querySelectorAll('[data-id="delete-btn"]')

const requestHandler = async (button, data) => {
    button.innerHTML = "Adding Product";
    button.disabled = true;
    await new Promise(res => setTimeout(res, 2000));
    if (Object.hasOwn(data, "productName")) {
        const productData = JSON.stringify(data);
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const requestOpts = new Request("http://localhost:3000/api/products", {
            method: "POST",
            body: productData,
            redirect: "follow",
            headers,
        });
        try {
            const req = await fetch(requestOpts);
            const res = await req.json();
            if (Object.is(res.error, false)) {
                Swal.fire({
                    title: res.message,
                    text: "Item Successfully Store In The Database",
                    icon: "success"
                });
                button.innerHTML = "Add Product";
                button.disabled = false;
                setTimeout(() => {
                    location.reload();
                }, 2000);
                return;
            }
            Swal.fire({
                title: res.message,
                text: "Database Didn't Receive Any Item, Please Try Again After Some Few Minutes",
                icon: "error"
            });
            button.innerHTML = "Add Product";
            button.disabled = false;
        }catch(err) {
            Swal.fire({
                title: err?.message ?? "Error Occurred While Trying To Add Data To The Table",
                text: "Please Kindly Try Again After Some Fews Minutes",
                icon: "error"
            });
            console.log(err);
        }
    }
}

const requestEditHandler = async (activeId, button, data) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const requestOpts = new Request(`http://localhost:3000/api/products/${activeId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers,
        redirect: "follow"
    });
    button.innerHTML = "Updating Product...";
    button.disabled = true;
    try {
        const req = await fetch(requestOpts);
        const res = await req.json();
        if (Object.is(res.error, false)) {
            Swal.fire({
                title: res.message,
                text: "Database Successfully Updated",
                icon: "success"
            });
            button.innerHTML = "Add Product";
            button.disabled = false;
            setTimeout(() => {
                location.reload();
            }, 3000);
            return;
        }
        Swal.fire({
            title: res.message,
            text: "Database Didn't Receive Any Item, Please Try Again After Some Few Minutes",
            icon: "error"
        });
        button.innerHTML = "Add Product";
        button.disabled = false;
    }catch(err) {
        Swal.fire({
            title: "Error Occurred While Trying To Update Product",
            text: "????",
            icon: "error"
        });
    }
}

const requestDeleteHandler = async (activeId) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const requestOpts = new Request(`http://localhost:3000/api/products/${activeId}`, {
        method: "DELETE",
        headers,
        redirect: "follow"
    });
    try {
        const req = await fetch(requestOpts);
        const res = await req.json();
        if (Object.is(res.error, false)) {
            Swal.fire({
                title: res.message,
                text: "Database Successfully Updated",
                icon: "success"
            });
            setTimeout(() => {
                location.reload();
            }, 3000);
            return;
        }
        Swal.fire({
            title: res.message,
            text: "Database Didn't Receive Any Item, Please Try Again After Some Few Minutes",
            icon: "error"
        });
    }catch(err) {
        Swal.fire({
            title: "Error Occurred While Trying To Delete Product",
            text: "????",
            icon: "error"
        });
    }
}

const ejsTodoHandler = (e) => {
    const button = e.currentTarget;

    if (!productInput.value.trim()) {
        Swal.fire({
            title: "Please Kindly Insert Some Data",
            text: "Nothing Was Added To The Database",
            icon: "info"
        });
        return;
    }

    const data = {
        productName: productInput.value
    };

    console.log(button.dataset.id);
    switch(button.dataset.id) {
        case "add-product":
            requestHandler(button, data);
            break;
        default:
            const activeId = button.dataset?.uid;
            requestEditHandler(activeId, button, data);
            break;
    }
    productInput.value = "";
}

const handleProductUpdate = (e) => {
    const editBtn = e.currentTarget;
    const activeId = editBtn.dataset.uid;
    if (!activeId) {
        Swal.fire({
            title: "Product Id Not Detected",
            text: "Please Recheck And Try Again",
            icon: "error"
        });
        return;
    }

    productInput.value = editBtn.parentElement.previousElementSibling.previousElementSibling.textContent;
    addButton.dataset.uid = activeId;
    addButton.dataset.id = "edit-btn";
}

const handleProductDelete = (e) => {
    const deleteBtn = e.currentTarget;
    const activeId = deleteBtn.dataset.uid;
    if (!activeId) {
        Swal.fire({
            title: "Product Id Not Detected",
            text: "Please Recheck And Try Again",
            icon: "error"
        });
        return;
    }
    if (confirm("Are you sure, you want to delete this?")) {
        requestDeleteHandler(activeId);
    }else {
        Swal.fire({
            title: "Operation Cancelled",
            text: "Database Still Intact",
            icon: "info"
        });
    }
}


addButton?.addEventListener("click", ejsTodoHandler);
editBtns?.forEach(btn => btn?.addEventListener('click', handleProductUpdate));
deleteBtns?.forEach(btn => btn?.addEventListener('click', handleProductDelete));