import ErrorPage from "./ErrorPage";

export default function ServerErrorPage() {
  return (
    <ErrorPage
      errorCode="500"
      title="Server Error"
      message="Something went wrong on our end. Please try again later or contact support if the problem persists."
      showHomeButton={true}
    />
  );
}
