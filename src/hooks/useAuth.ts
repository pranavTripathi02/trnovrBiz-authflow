import { useContext } from "react";
import { AuthContext } from "../context/authContext";

const useAuth = () => {
  const data = useContext(AuthContext);
  if (!data) throw Error("Context has not been Provided!");
  else return data;
};

export default useAuth;
