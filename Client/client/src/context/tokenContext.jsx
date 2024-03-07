// /* eslint-disable react/prop-types */
// import { createContext, useEffect, useState } from "react";

// export const TokenContext = createContext();
// const TokenProvider = ({ children }) => {
//   const [accessToken, setAccessToken] = useState(
//     JSON.parse(localStorage.getItem("access_token"))
//   );
//   useEffect(() => {
//     localStorage.setItem("access_token", JSON.stringify(accessToken));
//   }, [accessToken]);
//   return (
//     <TokenContext.Provider value={{ accessToken, setAccessToken }}>
//       {children}
//     </TokenContext.Provider>
//   );
// };

// export default TokenProvider;
