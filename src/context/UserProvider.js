import { useState } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import { paste } from "@testing-library/user-event/dist/paste";

const url = process.env.REACT_APP_API_URL;

const UserProvider = ({ children }) => {
  const userFromSessionStorage = sessionStorage.getItem("user");
  const [user, setUser] = useState(
    userFromSessionStorage
      ? JSON.parse(userFromSessionStorage)
      : { email: "", password: "" }
  );

  const signUp = async () => {
    const json = JSON.stringify(user);
    const headers = { headers: { "Content-Type": "application/json" } };
    try {
      await axios.post(url + "/user/register", json, headers);
      setUser({ email: "", password: "" });
    } catch (err) {
      throw err;
    }
  };

  const signIn = async () => {
    const json = JSON.stringify(user);
    const headers = { headers: { "Content-Type": "application/json" } };
    try {
      const res = await axios.post(url + "/user/login", json, headers);
      const token = res.data.token;
      setUser(res.data);
      sessionStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      throw err;
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, signUp, signIn }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
