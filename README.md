
---

# 🏢 **Organization Management Service (Backend)**

*A scalable multi-tenant backend built with Node.js, Express & MongoDB.*

This service uses a **Master Database** to store global metadata and creates **dynamic MongoDB collections** for each organization perfect for SaaS-style multi-tenant systems.

---

## ✨ **Features**

* ⚡ **Multi-tenant architecture** with dynamic collection creation
* 🔐 **Secure Admin Authentication** (bcrypt + JWT)
* 🏗️ **Modular & Clean Folder Structure**
* 📡 **Full Organization CRUD Support**
* ⚙️ **Environment-based configuration**
* 🔌 **Easy to integrate with any frontend**

---

## 🛠️ **Setup & Installation**

### **1️⃣ Clone the Repository**

```bash
git clone <your-repo-url>
cd organization-management-service
```

### **2️⃣ Install Dependencies**

```bash
npm install
```

---

## ⚙️ **Environment Variables**

Create a `.env` file in the root folder and add:

```env
PORT=4000
MONGO_URI=
JWT_SECRET=your_secret_jwt
JWT_EXPIRES_IN=2h
BCRYPT_SALT_ROUNDS=10
```

### 📝 **How to Get `MONGO_URI`**

1. Go to **MongoDB Atlas**
2. Create a new **Cluster** → Name it: `org-mgmt`
3. Create a **username + password**
4. Click **Connect → Drivers**
5. Copy the connection string
6. Replace `<username>` and `<password>` in the URI

> 💡 Use the *standard connection string* for Node.js.

---

## ▶️ **Running the Backend**

### **Development Mode**

```bash
npm run dev
```

### **Production Mode**

```bash
npm start
```

Server runs at:
👉 **[http://localhost:4000](http://localhost:4000)**

---

## 🎨 **Frontend Quick Demo (Static HTML)**

A simple UI demo is included in the project.

### To run the frontend:

1. Open the `.html` file
2. Right-click → **Open with Live Server**

That’s it! 🚀

---

## 📡 **API Endpoints**

### **Organization Routes**

| Method | Endpoint                         | Description                                |
| ------ | -------------------------------- | ------------------------------------------ |
| POST   | `/org/create`                    | Create a new organization                  |
| GET    | `/org/get?organization_name=...` | Fetch organization details                 |
| PUT    | `/org/update`                    | Update organization info                   |
| DELETE | `/org/delete`                    | Delete organization *(Admin JWT required)* |

### **Admin Routes**

| Method | Endpoint           | Description               |
| ------ | ------------------ | ------------------------- |
| POST   | `/org/admin/login` | Admin login → returns JWT |

---

## 🔐 **Security Notes**

* 🔒 Passwords hashed using **bcrypt**
* 🔑 JWT payload includes:

```json
{
  "adminEmail": "",
  "organizationName": "",
  "organizationId": ""
}
```

* 📁 Dynamic collections follow this pattern:

```
org_<organization_name_safe>
```

