import React from "react";
import { Layout } from "antd";
const { Footer: Foot } = Layout;

function Footer() {
  return (
    <Foot style={{ textAlign: "center" }}>
      React-Antd Design {new Date().getFullYear()} Created by Vishwaas
    </Foot>
  );
}

export default Footer;
