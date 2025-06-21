import Button from "@/components/Button/Button";

export default function Page() {
  return (
    <div className="">
      <div className="itmes-center flex gap-x-2">
        <Button variant="muattrans-primary">Primary</Button>
        <Button variant="muattrans-primary-secondary" type="muattrans">
          Primary Secondary
        </Button>
        <Button variant="muattrans-error">Error</Button>
        <Button variant="muattrans-error-secondary">Error Seconary</Button>
        <Button variant="muattrans-warning">Warning</Button>
      </div>
    </div>
  );
}
