const Alert = ({
  message,
  type,
}: {
  message: string;
  type: "error" | "success";
}) => (
  <div
    className={`p-4 mb-4 rounded-md ${
      type === "error"
        ? "bg-red-200 text-red-700"
        : "bg-green-200 text-green-700"
    }`}
  >
    {message}
  </div>
);

export default Alert;
