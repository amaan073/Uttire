// import { useState, useEffect } from "react";
// import AuthContext from "./AuthContext.jsx";

// // eslint-disable-next-line react/prop-types
// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null); // will store { name, email, ... }
//   const [loading, setLoading] = useState(true); //to let it load then only the router loads

//   useEffect(() => {
//     setLoading(false); //done loading
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, loginUser, logoutUser, loading }}>
//       {loading ? null : children} {/*render only after the auth check is completed */}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;
