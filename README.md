🏢 Organization Management Service (Backend)

A Node.js + Express backend designed for multi-tenant organization management.
This service stores global metadata in a Master MongoDB database and dynamically creates isolated MongoDB collections for each organization.

🚀 Features
- Multi-tenant architecture with dynamic collection creation
- Secure admin authentication (bcrypt + JWT)
- Organization CRUD (Create, Read, Update, Delete)
- Clean modular folder structure
- Environment-based configuration
- Easy integration with any frontend
  

🛠️ Setup & Installation

1️⃣ Clone the Repository

git clone your-repo-url

cd organization-management-service

2️⃣ Install Dependencies
  
npm install

⚙️ Environment Variables

Create a .env file in the project root and add:

PORT=4000

MONGO_URI=

JWT_SECRET=your_secret_jwt

JWT_EXPIRES_IN=2h

BCRYPT_SALT_ROUNDS=10


📝 How to get MONGO_URI:

- Go to MongoDB Atlas
- Create a new Cluster and name it: org-mgmt
- Create a username + password
- Click Connect → Drivers
- Copy the connection URI and replace <username> and <password>

▶️ Running the Backend

npm run dev

OR

npm start


Backend will start at:

http://localhost:4000

🎨 Frontend Quick Demo (Static HTML)

A simple UI demo is provided.

To run the frontend:

Open the HTML file

Right-click → Open with Live Server

📡 API Endpoints

- POST	/org/create	Create a new organization

- GET	/org/get?organization_name=...	Fetch organization details

- PUT	/org/update	Update organization info

- DELETE	/org/delete	Delete org (Requires Admin JWT)

- POST	/org/admin/login	Login admin & receive JWT

🔐 Security Notes

Passwords are encrypted using bcrypt

JWT payload contains:

{

  "adminEmail": "",
  
  "organizationName": "",
  
  "organizationId": ""
  
}

Dynamic collections follow naming convention:

org_<organization_name_safe>
