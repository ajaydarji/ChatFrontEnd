import { useNavigate } from "react-router-dom";
import { userAppStore } from "@/store";

function useLogout() {
  const navigate = useNavigate();
  const { setuserInfo } = userAppStore(); // Zustand action to clear user info

  const logout = async () => {
    try {
      // Clear user info from Zustand store
      setuserInfo(null);

      // Remove the JWT token from localStorage
      localStorage.removeItem("authToken");

      // Confirm token removal
      console.log("Token removed:", !localStorage.getItem("authToken"));

      // Redirect the user to the login page
      navigate("/auth");
    } catch (error) {
      console.error("Logout failed: ", error);
      // Optionally show an error message to the user
    }
  };

  return { logout };
}

export default useLogout;
