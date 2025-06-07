const addButton = document.querySelector("[data-id='add-product']");
const productInput = document.querySelector("[data-id='product-input']");

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
                    message: "Item Successfully Store In The Database",
                    icon: "success"
                });
                button.innerHTML = "Add Product";
                button.disabled = false;
                return;
            }
            Swal.fire({
                title: res.message,
                message: "Database Didn't Receive Any Item, Please Try Again After Some Few Minutes",
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

    requestHandler(button, data);
}


addButton?.addEventListener("click", ejsTodoHandler);