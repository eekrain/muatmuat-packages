// Mock data and fetcher for Add Fleet Follow-up Notes
import useSWRMutation from "swr/mutation";

const IS_MOCK = true;

const apiResultAddFleetFollowUp = {
  Message: {
    Code: 200,
    Text: "Catatan follow-up berhasil ditambahkan",
  },
  Data: {
    noteId: "note_uuid",
    noteContent:
      "Update follow-up: Transporter konfirmasi 3 dari 5 armada akan kembali aktif besok pagi. 2 armada masih menunggu spare part. Estimasi full recovery dalam 1 minggu.",
    createdAt: "2025-01-15T15:45:00Z",
    author: {
      id: "cs_user_id",
      name: "CS Team Lead",
      role: "Customer Service Supervisor",
    },
    relatedEntities: {
      transporterId: "uuid",
      transporterName: "PT Transporter ABC",
      totalInactiveFleet: 5,
      affectedFleets: [
        {
          fleetId: "uuid",
          licensePlate: "B 1234 XYZ",
          currentStatus: "INACTIVE",
          inactivityReason: "Maintenance",
        },
      ],
    },
    followUpSchedule: {
      nextFollowUp: "2025-01-18T09:00:00Z",
      priority: "medium",
      assignedTo: {
        id: "cs_user_id",
        name: "CS Team Lead",
      },
    },
    actionItems: [
      {
        id: "action_uuid_1",
        action: "verify_fleet_return",
        dueDate: "2025-01-17T08:00:00Z",
        status: "pending",
        assignedTo: {
          id: "cs_operator_id",
          name: "CS Operator",
        },
      },
    ],
    statusUpdate: {
      previousStatus: "in_progress",
      newStatus: "partial_resolved",
      resolutionProgress: 0.6,
      estimatedCompletionDate: "2025-01-22T00:00:00Z",
    },
    notificationsSent: [
      {
        recipient: "cs_supervisor",
        type: "follow_up_update",
        sentAt: "2025-01-15T15:45:30Z",
      },
      {
        recipient: "transporter_contact",
        type: "acknowledgment",
        sentAt: "2025-01-15T15:46:00Z",
      },
    ],
    auditTrail: {
      actionType: "add_followup_note",
      userId: "cs_user_id",
      timestamp: "2025-01-15T15:45:00Z",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0...",
    },
  },
  Type: "FLEET_NOTE_ADD_SUCCESS",
};

export const fetcherAddFleetFollowUp = async (body) => {
  if (IS_MOCK) {
    // Deep clone to avoid mutation
    return JSON.parse(JSON.stringify(apiResultAddFleetFollowUp));
  }

  // Real API
  // You would use axios or fetch here
  // return await fetcherMuatrans.post("/v1/cs/transport-request/transporter-inactive/report-complete", body);
};

export const useAddFleetFollowUp = () => {
  return useSWRMutation("add-fleet-followup", (key, { arg }) =>
    fetcherAddFleetFollowUp(arg)
  );
};
