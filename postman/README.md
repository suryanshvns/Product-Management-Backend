# Postman collection

## Import

1. Open Postman.
2. **Import** → **File** → choose `ProductManagementPlatform-API.postman_collection.json`.
3. The collection **ProductManagementPlatform API** will appear.

## Auto token handling

- **Collection variables:** `baseUrl`, `accessToken`, `refreshToken`.
- **To set tokens:** Run any of:
  - **Auth → Login** (default: `superadmin@company.com` / `test`)
  - **Auth → Signup**
  - **Auth → Refresh Token**
- **Test scripts** on those three requests run after the response and save `data.accessToken` and `data.refreshToken` into the collection variables.
- All protected requests (Me, Users, Roles) use **Authorization: Bearer {{accessToken}}**.
- **Logout** and **Refresh Token** use **{{refreshToken}}** in the body.

No need to copy-paste tokens: run Login (or Signup / Refresh Token) once, then use any other request in the collection.

## Base URL

Default: `http://localhost:3000/api`. Change the collection variable `baseUrl` if your server runs elsewhere.

## Path placeholders

- **Get user by id** / **Update user:** set the path variable `id` (or edit the URL) to a real user id.
- **Assign role** / **Revoke role:** set `userId` and (for revoke) `roleId`. Use **List roles** and **List users** to get ids.
