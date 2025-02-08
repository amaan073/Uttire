import React from "react";
import "./navBtn.css";

const NavBtn = ({ isNavActive, setNavActive }) => {
  //Nav button inspired by [Caler Edwards YT]

  return (
    <>
      <button
        className={`nav-view-btn btn p-0 d-md-none me-2 border-0 ${
          isNavActive ? "active" : ""
        }`}
        onClick={() => setNavActive(!isNavActive)}
      >
        <div className="line1"></div>
        <div className="line2"></div>
        <div className="line3"></div>
      </button>
    </>
  );
};

export default NavBtn;

// import React from "react";

// const NavBtn = () => {
//   //Nav button design and hover effect created by [Caler Edwards] https://youtu.be/aCoNggByreg?si=uR_eI2cP68Fkv8jG

//   const styles = {
//     btn: {
//       width: "38px",
//       height: "38px",
//       display: "flex",
//       flexDirection: "column",
//       justifyContent: "space-around",
//     },
//     line: {
//       height: "7px",
//       backgroundColor: "black",
//       borderRadius: "5px",
//     },
//     line1: { width: "100%" },
//     line2: { width: "60%" },
//     line3: { width: "80%" },
//   };

//   return (
//     <>
//       <button
//         className="nav-view-btn btn p-0 d-md-none me-2"
//         style={styles.btn}
//       >
//         <div style={{ ...styles.line, ...styles.line1 }}></div>
//         <div style={{ ...styles.line, ...styles.line2 }}></div>
//         <div style={{ ...styles.line, ...styles.line3 }}></div>
//       </button>
//     </>
//   );
// };

// export default NavBtn;
