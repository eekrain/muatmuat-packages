const InfoItem = ({ label, value }) => (
  <div className="flex min-w-[200px] max-w-[200px] flex-col gap-y-2">
    <span className="text-xs font-medium text-neutral-600">{label}</span>
    <span className="text-sm font-bold">{value}</span>
  </div>
);

export default InfoItem;
