import ErrorPage from "./ErrorPage";

export default function NotFoundPage() {
  return (
    <ErrorPage
      errorCode="404"
      title="Page Not Found"
      message="The page you're looking for doesn't exist or has been moved. Let's get you back on track."
      showHomeButton={true}
    />
  );
}
