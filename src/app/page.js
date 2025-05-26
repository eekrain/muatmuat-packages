import Button from "@/components/Button/Button";

export default function Page() {
  return (
    <div className="">
      <div className="itmes-center flex gap-x-2">
        <Button color="primary" type="muattrans">
          Primary
        </Button>
        <Button color="primary_secondary" type="muattrans">
          Primary Secondary
        </Button>
        <Button color="error" type="muattrans">
          Error
        </Button>
        <Button color="error_secondary" type="muattrans">
          Error Seconary
        </Button>
        <Button color="warning" type="muattrans">
          Warning
        </Button>
      </div>
    </div>
  );
}
