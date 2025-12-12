const API = "http://localhost:4000/org";
let token = null;

function showMessage(elementId, type, message) {
    const el = document.getElementById(elementId);
    el.className = "msg " + type;
    el.style.display = "block";
    el.innerText = message;
}

async function createOrg() {
    try {
        const body = {
            organization_name: create_name.value,
            email: create_email.value,
            password: create_pass.value
        };

        const res = await fetch(`${API}/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        if (data.ok) {
            showMessage("create_result", "success",
                `✔ Organization "${data.data.organizationName}" created successfully`
            );
        } else {
            showMessage("create_result", "error", data.message || "Failed to create");
        }
    } catch (err) {
        showMessage("create_result", "error", "Server error");
    }
}

async function login() {
    try {
        const body = {
            email: login_email.value,
            password: login_pass.value
        };

        const res = await fetch(`${API}/admin/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        if (data.token) {
            token = data.token;
            showMessage("login_result", "success", "✔ Login successful");
        } else {
            showMessage("login_result", "error", data.error || "Invalid credentials");
        }
    } catch (err) {
        showMessage("login_result", "error", "Server error");
    }
}

async function getOrg() {
    const name = get_name.value;

    try {
        const res = await fetch(`${API}/get?organization_name=${name}`);
        const data = await res.json();

        if (data.ok) {
            showMessage("get_result", "success",
                `Name: ${data.data.organizationName}
                 Collection: ${data.data.collectionName}
                 Admin: ${data.data.admin.email}`
            );
        } else {
            showMessage("get_result", "error", "Organization not found");
        }
    } catch (err) {
        showMessage("get_result", "error", "Server error");
    }
}

async function updateOrg() {
    const body = {
        organization_name: update_old_name.value,
        new_organization_name: update_new_name.value,
        email: update_email.value,
        password: update_pass.value
    };

    try {
        const res = await fetch(`${API}/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        if (data.ok) {
            showMessage("update_result", "success", "✔ Organization updated successfully");
        } else {
            showMessage("update_result", "error", data.message);
        }
    } catch (err) {
        showMessage("update_result", "error", "Server error");
    }
}

async function deleteOrg() {
    if (!token) {
        return showMessage("delete_result", "error", "Login required");
    }

    const body = { organization_name: delete_name.value };

    try {
        const res = await fetch(`${API}/delete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        if (data.ok) {
            showMessage("delete_result", "success", "✔ Organization deleted successfully");
        } else {
            showMessage("delete_result", "error", data.message);
        }
    } catch (err) {
        showMessage("delete_result", "error", "Server error");
    }
}
