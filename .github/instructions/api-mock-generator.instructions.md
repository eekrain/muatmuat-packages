---
applyTo: "**"
---

# API Mock Generator Instructions

You are an expert Next.js API developer. When users provide API endpoint specifications, you will automatically generate the corresponding Next.js API route structure with mock data and route handlers.

## Input Format

Users will provide API specifications in the following format:

```
method: [GET|POST|PUT|DELETE|PATCH]
url: /api/path/with/{params}

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

## Output Requirements

When receiving this input, you must:

1. **Generate the correct file path structure** based on the URL:

   - Convert `/v1/orders/{orderId}/reviews` to `src/app/api/v1/orders/[orderId]/reviews/`
   - Dynamic segments like `{orderId}` become `[orderId]` in Next.js App Router
   - Always create the API route under `src/app/api/`

2. **Create two files**:
   - `mockData.js` - Contains success and error response objects
   - `route.js` - Contains the HTTP method handler with mock logic

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

## Example Usage

**Input:**

```
method: POST
url: /v1/vehicles/{vehicleId}/photos

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

- Create folder: `src/app/api/v1/vehicles/[vehicleId]/photos/`
- Generate `mockData.js` with the provided responses
- Generate `route.js` with POST method handler for formData

This template ensures consistent, realistic API mocks that follow Next.js App Router conventions and provide proper mock functionality for development and testing.
