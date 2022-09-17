import React from "react";
import { Layout } from "antd";
const { Footer: Foot } = Layout;

function Footer() {
  return (
    <Foot style={{ textAlign: "center", marginBottom: "0px", bottom: 0 }}>
      React-Antd Design {new Date().getFullYear()} Created by Vishwaas
    </Foot>
  );
}

export default Footer;
