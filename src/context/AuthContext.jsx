import { createContext, useContext, useEffect, useState } from "react";
import { login, logout, onUserStateChange } from "../api/firebase";

const AuthContext = createContext();

// 로그인 정보를 context화 하여 관리한다.
export function AuthContextProvider({ children }) {
  const [user, setUser] = useState();

  useEffect(() => {
    // 이전 사용자 상태를 초기값으로 주자
    onUserStateChange((user) => setUser(user));
  }, []);

  return (
    // { user, uid: user.uid, login: login, logout: logout }
    <AuthContext.Provider
      value={{ user, uid: user && user.uid, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
