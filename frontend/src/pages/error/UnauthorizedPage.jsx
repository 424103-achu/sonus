import ErrorPage from "./ErrorPage";

export default function UnauthorizedPage() {
  return (
    <ErrorPage
      errorCode="401"
      title="Unauthorized"
      message="You don't have permission to access this resource. Please log in to continue."
      showHomeButton={true}
    />
  );
}
