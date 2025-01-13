import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get("token");

      // Ensure the token exists before making the request
      if (!token) {
        alert("Invalid verification link.");
        navigate("/"); // Redirect user to the homepage or another page
        return;
      }

      try {
        // Make the API call to verify the email
        const response = await fetch(`http://localhost:5001/auth/verify?token=${token}`);

        // Handle non-OK responses
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Verification failed.");
        }

        // Parse the successful response
        const result = await response.json();
        alert(result.message);

        // Redirect user after successful verification
        navigate("/login"); // Redirect to login page or another appropriate page
      } catch (error) {
        console.error("Verification Error:", error.message);
        alert(error.message || "An error occurred during verification.");
      }
    };

    verify();
  }, [searchParams, navigate]);

  return <h1>Verifying your email...</h1>;
}

export default VerifyEmail;