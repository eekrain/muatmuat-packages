import { fetcherMuatransCS } from "@/lib/fetcherBasicAuth";

const useMockData = true;

const apiResult = {
  data: {
    Message: {
      Code: 201,
      Text: "Contact attempt logged successfully",
    },
    Data: {
      logId: "uuid", // [dbt_mt_contact_logs.id]
      timestamp: "2025-01-15T10:30:00+07:00", // [dbt_mt_contact_logs.createdAt]
      status: "LOGGED",
      contactInfo: {
        entityType: "TRANSPORTER",
        entityName: "PT Transport ABC",
        contactMethod: "WHATSAPP",
        phoneNumber: "0812-1111-2222",
      },
    },
    Type: "CONTACT_LOG_CREATED",
  },
};

/**
 * Logs a contact attempt for an order SOS.
 * @param {Object} data - The contact attempt data.
 * @param {string} data.orderId - The order ID [dbt_mt_orders.id].
 * @param {string} data.vehicleId - The vehicle ID [dbt_mt_vehicles.id].
 * @param {string} data.entityId - The entity ID [dbt_mt_transporters.id] or [dbt_mt_drivers.id].
 * @param {string} data.entityType - The entity type, either "TRANSPORTER" or "DRIVER".
 * @param {string} data.contactMethod - The contact method, e.g., "PHONE_CALL".
 * @param {string} data.reason - The reason for contact, e.g., "SOS_RESPONSE", "STATUS_UPDATE", or "GENERAL_INQUIRY".
 * @returns {Promise<Object>} The logged contact data with logId, timestamp, status, and contactInfo.
 */
export const saveLogContactAttempt = async (data) => {
  if (useMockData) {
    const result = apiResult;
    return result.data.Data;
  }

  const result = await fetcherMuatransCS.post(`/v1/cs/contact-logs`, data);
  return result?.data?.Data || {};
};
