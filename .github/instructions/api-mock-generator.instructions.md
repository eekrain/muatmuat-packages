# API Mock Generator Instructions

You are an expert Next.js API developer. When users provide API endpoint specifications, you will automatically generate the corresponding Next.js API route structure with mock data and route handlers.

## Input Format

Users will provide API specifications in the following format:

```
method: [GET|POST|PUT|DELETE|PATCH]
url: /api/path/with/{params}
servicePath: /src/services/[FolderStructure]/[serviceName] (optional)

---
Payload
content-type: [json|formData|multipart/form-data]
{
  // JSON Payload (omit this section for GET requests or when no payload is needed)
}

---
successResponse
{
  // JSON response object for successful requests
}

---
errorResponse
{
  // JSON response object for error cases
}

---
```

### Service Path Examples:

- `servicePath: /src/services/CS/users` → Creates service file for CS users management
- `servicePath: /src/services/Transporter/vehicles` → Creates service file for transporter vehicles
- `servicePath: /src/services/Admin/reports` → Creates service file for admin reports
- If `servicePath` is not provided, it will be auto-generated based on the URL structure

## Output Requirements

When receiving this input, you must:

1. **Generate the correct file path structure** based on the URL:

   - Convert `/v1/orders/{orderId}/reviews` to `src/app/api/v1/orders/[orderId]/reviews/`
   - Dynamic segments like `{orderId}` become `[orderId]` in Next.js App Router
   - Always create the API route under `src/app/api/`

2. **Create two files for the API**:

   - `mockData.js` - Contains success and error response objects
   - `route.js` - Contains the HTTP method handler with mock logic

3. **Generate corresponding service file** based on servicePath or auto-generated path:
   - Create service file in the specified `/src/services/[FolderStructure]/` directory
   - Generate appropriate SWR hooks for GET requests or SWR mutation hooks for POST/PUT/PATCH/DELETE
   - Include mock flag and fetcher functions based on existing patterns

## File Templates

### mockData.js Template

```javascript
export const successResponse = {
  // User-provided success response object
};

export const errorResponse = {
  // User-provided error response object
};

// Add additional error responses if needed
export const serverErrorResponse = {
  Message: {
    Code: 500,
    Text: "Internal Server Error",
  },
  Data: {
    errors: [
      {
        field: "general",
        message: "Terjadi kesalahan pada sistem kami",
      },
    ],
  },
  Type: "INTERNAL_SERVER_ERROR",
};
```

### route.js Template Structure

**For JSON Content-Type:**

```javascript
import { NextResponse } from "next/server";
import {
  errorResponse,
  successResponse,
  serverErrorResponse,
} from "./mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function [METHOD](req, { params }) {
  try {
    // Add realistic delay for testing
    await delay(1000);

    // Parse request body for POST/PUT/PATCH
    const body = await req.json();

    // Extract dynamic parameters if needed
    // const { orderId } = params;

    // Add mock validation logic here
    // Example: Basic validation
    if (/* validation condition */) {
      return NextResponse.json(errorResponse, {
        status: errorResponse.Message.Code,
      });
    }

    // Return success response
    return NextResponse.json(successResponse, {
      status: successResponse.Message.Code,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(serverErrorResponse, {
      status: 500,
    });
  }
}
```

**For FormData Content-Type:**

```javascript
import { NextResponse } from "next/server";
import {
  errorResponse,
  successResponse,
  serverErrorResponse,
} from "./mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function [METHOD](req, { params }) {
  try {
    // Add realistic delay for testing
    await delay(2000);

    // Handle form data
    const formData = await req.formData();
    const file = formData.get("file");

    // Extract dynamic parameters if needed
    // const { orderId } = params;

    // Mock file processing for file uploads
    if (file) {
      console.log("File:", file.name, "Size:", file.size);

      // Add file validation
      if (file.size > 10000000) { // 10MB limit
        return NextResponse.json(errorResponse, {
          status: errorResponse.Message.Code,
        });
      }

      // Convert to base64 for mock response (file uploads)
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const mimeType = file.type || "application/octet-stream";
      const base64Data = buffer.toString("base64");
      const dataUrl = `data:${mimeType};base64,${base64Data}`;

      // Return success with processed data
      return NextResponse.json(
        {
          ...successResponse,
          Data: {
            ...successResponse.Data,
            // Update relevant fields with processed data
            // photoUrl: dataUrl,
            // originalFileName: file.name,
            // fileSize: file.size,
          },
        },
        { status: successResponse.Message.Code }
      );
    }

    // Handle other form fields
    const otherField = formData.get("otherField");

    return NextResponse.json(successResponse, {
      status: successResponse.Message.Code,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(serverErrorResponse, {
      status: 500,
    });
  }
}
```

## Implementation Guidelines

1. **Path Conversion Rules**:

   - `/v1/orders/{orderId}/reviews` → `src/app/api/v1/orders/[orderId]/reviews/`
   - `/v2/users/{userId}/profile` → `src/app/api/v2/users/[userId]/profile/`
   - `/admin/reports/daily` → `src/app/api/admin/reports/daily/`

2. **HTTP Method Mapping**:

   - Use the exact method name: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`
   - Always export as `export async function [METHOD]`

3. **Mock Logic Features**:

   - Add 1-2 second delay to simulate network latency
   - Include basic validation that can trigger error responses
   - Handle dynamic parameters from the URL
   - For file uploads, process and return mock file data
   - Include proper error handling with 500 responses

4. **Response Structure**:

   - Always maintain the user-provided response structure
   - For file uploads, update relevant fields with processed data
   - Include proper HTTP status codes from the response objects

5. **Additional Features**:

   - Add console.log statements for debugging
   - Include comments explaining the mock logic
   - Handle edge cases like missing required fields
   - Support both single and multiple file uploads for formData

6. **Service File Generation**:
   - Create service files in the specified `/src/services/[FolderStructure]/` directory
   - Generate appropriate SWR hooks for GET requests
   - Generate SWR mutation hooks for POST/PUT/PATCH/DELETE requests
   - Include mock flag and fetcher functions following existing patterns

## Service File Templates

Based on the `servicePath` provided or auto-generated from the URL structure, create corresponding service files in `/src/services/[FolderStructure]/`.

### Service File Naming Convention

Generate service file names based on the HTTP method and endpoint:

- GET requests: `get[EntityName][Action].js` (e.g., `getCSTransporters.js`, `getDriversUploadHistory.js`)
- POST requests: `post[EntityName][Action].js` (e.g., `postDriverBulkCreate.js`, `postUserLogin.js`)
- PUT requests: `put[EntityName][Action].js` or `update[EntityName].js`
- DELETE requests: `delete[EntityName].js`
- PATCH requests: `patch[EntityName].js`

### GET Request Service Template

```javascript
import useSWR from "swr";

import { fetcherMock, fetcherMuatrans } from "@/lib/axios";

const isMock[EntityName] = true;

export const fetcher[EntityName] = async (url, { arg }) => {
  if (isMock[EntityName]) {
    const result = await fetcherMock.get(\`/api/\${url}\`, arg ?? null);
    return result.data;
  }
  const result = await fetcherMuatrans.get(url, arg);
  return result.data;
};

export const use[HookName] = (url) => {
  return useSWR(url ? \`[entityKey]-\${url}\` : null, () =>
    fetcher[EntityName](url, { arg: null })
  );
};

// Enhanced hook with query parameters (for list endpoints)
export const use[HookName]WithParams = (params = {}) => {
  const { page = 1, limit = 10, search = "", sort = "", order = "" } = params;

  // Build query string
  const queryParams = new URLSearchParams();
  if (page) queryParams.append("page", page.toString());
  if (limit) queryParams.append("limit", limit.toString());
  if (search) queryParams.append("search", search);
  if (sort) queryParams.append("sort", sort);
  if (order) queryParams.append("order", order);

  const queryString = queryParams.toString();
  const url = \`[apiEndpoint]\${queryString ? \`?\${queryString}\` : ""}\`;

  // Create a unique key for SWR that includes all parameters
  const swrKey = \`[entityKey]-\${JSON.stringify(params)}\`;

  return useSWR(swrKey, () => fetcher[EntityName](url, { arg: null }));
};
```

### POST/PUT/PATCH/DELETE Request Service Template

```javascript
import useSWRMutation from "swr/mutation";

import { fetcherMock, fetcherMuatrans } from "@/lib/axios";

const isMock[EntityName] = true;

export const fetcher[EntityName] = async (url, { arg }) => {
  if (isMock[EntityName]) {
    const result = await fetcherMock.[httpMethod](\`/api/\${url}\`, arg ?? null);
    return result.data;
  }
  const result = await fetcherMuatrans.[httpMethod](url, arg);
  return result.data;
};

export const use[HookName] = (dynamicParam) => {
  const baseUrl = dynamicParam ? \`[apiEndpoint]/\${dynamicParam}\` : "[apiEndpoint]";

  return useSWRMutation(baseUrl, (url, { arg }) => {
    return fetcher[EntityName](url, { arg });
  });
};
```

### Service File Generation Rules

1. **Entity Name Extraction**: Extract from URL segments (e.g., `/v1/cs/transporters` → `CSTransporters`)
2. **Hook Name Generation**: Combine method + entity name (e.g., `useGetCSTransporters`)
3. **API Endpoint**: Use the original URL from the specification
4. **Entity Key**: Lowercase version for SWR cache keys (e.g., `csTransporters`)
5. **Mock Flag**: Generate based on entity name pattern (e.g., `isMockCSTransporters`)
6. **Fetcher Name**: Based on entity name (e.g., `fetcherCSTransporters`)

## Example Usage

### Example 1: GET Request with Service Path

**Input:**

```
method: GET
url: /v1/cs/transporters?page=&limit=&search=&status=[ACTIVE|NON_ACTIVE]&sort=&order=
servicePath: /src/services/CS/transporters

---
successResponse
{
  "Message": {
    "Code": 200,
    "Text": "Data transporter berhasil diambil"
  },
  "Data": {
    "transporters": [
      {
        "id": "uuid-transporter-1",
        "companyName": "PT Transport Jaya",
        "status": "ACTIVE"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 42,
      "itemsPerPage": 10
    }
  },
  "Type": "GET_TRANSPORTERS_LIST"
}

---
errorResponse
{
  "Message": {
    "Code": 400,
    "Text": "Parameter tidak valid"
  },
  "Data": {
    "errors": [
      {
        "field": "search",
        "message": "Pencarian harus minimal 3 karakter"
      }
    ]
  },
  "Type": "GET_TRANSPORTERS_LIST_ERROR"
}
---
```

**Expected Output:**

**API Files:**

- Create folder: `src/app/api/v1/cs/transporters/`
- Generate `mockData.js` with the provided responses
- Generate `route.js` with GET method handler with query parameters support

**Service Files:**

- Create folder: `src/services/CS/transporters/`
- Generate `getCSTransporters.js` with:
  - SWR hook: `useGetCSTransporters`
  - Enhanced hook: `useGetCSTransportersWithParams` for pagination and filtering
  - Mock flag: `isMockCSTransporters = true`
  - Fetcher: `fetcherCSTransporters`

### Example 2: POST Request with File Upload

**Input:**

```
method: POST
url: /v1/vehicles/{vehicleId}/photos
servicePath: /src/services/Transporter/vehicles

---
Payload
content-type: formData
{
  "photo": "file",
  "description": "Vehicle photo description"
}
---
successResponse
{
  "Message": {
    "Code": 201,
    "Text": "Foto kendaraan berhasil diupload"
  },
  "Data": {
    "photoId": "photo-123",
    "photoUrl": "https://cdn.example.com/vehicles/photo-123.jpg",
    "uploadedAt": "2024-01-15T10:30:00Z"
  },
  "Type": "VEHICLE_PHOTO_UPLOAD"
}

---
errorResponse
{
  "Message": {
    "Code": 400,
    "Text": "File tidak valid"
  },
  "Data": {
    "errors": [
      {
        "field": "photo",
        "message": "Format file harus JPG atau PNG"
      }
    ]
  },
  "Type": "VALIDATION_ERROR"
}
---
```

**Expected Output:**

**API Files:**

- Create folder: `src/app/api/v1/vehicles/[vehicleId]/photos/`
- Generate `mockData.js` with the provided responses
- Generate `route.js` with POST method handler for formData

**Service Files:**

- Create folder: `src/services/Transporter/vehicles/`
- Generate `postVehiclePhotos.js` with:
  - SWR Mutation hook: `usePostVehiclePhotos`
  - Mock flag: `isMockVehiclePhotos = true`
  - Fetcher: `fetcherVehiclePhotos`
  - Support for dynamic vehicleId parameter

This template ensures consistent, realistic API mocks that follow Next.js App Router conventions and provide proper mock functionality for development and testing.
