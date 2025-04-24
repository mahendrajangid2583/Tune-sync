import React from "react";
import Search from "../../pages/Search";
import Profile from "../../pages/Profile";

const Condition_Rendering = (params) => {
  console.log(params);
  if (params.showSearchPage === true) {
    return <Search>showSearchPage = {params.showSearchpage}</Search>;
  }  
};

export default Condition_Rendering;
