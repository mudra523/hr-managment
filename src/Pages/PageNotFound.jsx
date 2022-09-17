import React from "react";
import Layout from "../Layouts/index";

function PageNotFound() {
  return (
    <Layout>
      <div
        id="wrapper"
        style={{
          display: "flex",
          flexDirectionL: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img style={{ width: "600px" }} src="https://i.imgur.com/qIufhof.png" />
        <div id="info">
          <h3>This page could not be found</h3>
        </div>
      </div>
    </Layout>
  );
}

export default PageNotFound;
