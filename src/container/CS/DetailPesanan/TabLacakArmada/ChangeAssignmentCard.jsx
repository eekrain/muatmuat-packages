// import { useState } from "react";

// import Dropdown from "@/components/Dropdown/Dropdown";
// import RadioButton from "@/components/Radio/RadioButton";
// import { cn } from "@/lib/utils";

// export const ChangeAssignmentCard = ({
//   armadaImage,
//   armadaName,
//   transporterOptions,
//   className,
// }) => {
//   const [assignment, setAssignment] = useState({
//     type: "SAME_TRANSPORTER",
//     transporterId: null,
//   });

//   const handleTypeChange = (newType) => {
//     // Reset transporterId unless the user is specifically choosing a transporter
//     const newTransporterId =
//       newType === "CHOOSE_TRANSPORTER" ? assignment.transporterId : null;
//     setAssignment({ type: newType, transporterId: newTransporterId });
//   };

//   const handleTransporterChange = (selected) => {
//     // Ensure the type is set correctly when a transporter is selected
//     setAssignment({
//       type: "CHOOSE_TRANSPORTER",
//       transporterId: selected.value,
//     });
//   };

//   // Find the selected transporter object to pass to the Dropdown value prop
//   const selectedValue =
//     transporterOptions.find(
//       (option) => option.value === assignment.transporterId
//     ) || null;

//   return (
//     <div
//       className={cn(
//         "flex h-[88px] w-full items-center justify-between border-b border-neutral-400 bg-white p-4",
//         className
//       )}
//     >
//       {/* Left Section: Armada Info */}
//       <div className="flex items-center gap-4">
//         <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-neutral-500 bg-neutral-50">
//           <img
//             src={armadaImage}
//             alt={armadaName}
//             className="h-full w-full object-contain"
//           />
//         </div>
//         <p className="text-sm font-bold text-neutral-900">{armadaName}</p>
//       </div>

//       {/* Right Section: Change Options */}
//       <div className="flex items-center gap-4">
//         <span className="text-xs font-medium text-neutral-600">Ubah Ke</span>
//         <div className="flex items-center gap-4">
//           <RadioButton
//             name={`assignment-${armadaName}`}
//             checked={value.type === "SAME_TRANSPORTER"}
//             onClick={() => handleTypeChange("SAME_TRANSPORTER")}
//             label="Tidak Diubah (Transporter yang sama)"
//           />
//           <RadioButton
//             name={`assignment-${armadaName}`}
//             checked={value.type === "REBLAST"}
//             onClick={() => handleTypeChange("REBLAST")}
//             label="Blast Ulang"
//           />
//           <div className="flex items-center gap-2">
//             <RadioButton
//               name={`assignment-${armadaName}`}
//               checked={value.type === "CHOOSE_TRANSPORTER"}
//               onClick={() => handleTypeChange("CHOOSE_TRANSPORTER")}
//             />
//             <Dropdown
//               options={transporterOptions}
//               placeholder="Pilih Transporter"
//               onSelected={handleTransporterChange}
//               disabled={value.type !== "CHOOSE_TRANSPORTER"}
//               value={selectedValue}
//               className="w-[202px]"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
