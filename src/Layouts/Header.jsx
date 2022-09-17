import React, { useEffect, useState } from "react";
import { Badge, Button, Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { getRequest } from "../api";
import { useAuth } from "../components/Auth";
import { useDispatch } from "react-redux";
import { remove } from "../features/authTokenSlice";

const { Item } = Menu;
function Header() {
  const [path, setPath] = useState("/");

  const [cart, setCart] = useState([]);
  const auth = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = localStorage.getItem("user");

  useEffect(() => {
    setPath(window.location.pathname);
    if (user) {
      getRequest("carts/").then(({ data }) => {
        setCart(data);
      });
    }
  }, []);

  const handleLogout = async () => {
    dispatch(remove());
    auth.logout();
    navigate("/");
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "end",
          alignItems: "center",
          padding: "10px",
          width: "100%",
          borderBottom: "1px solid lightgrey",
        }}
        className="header"
      >
        <Menu
          mode="horizontal"
          defaultSelectedKeys={[path]}
          selectedKeys={[path]}
          style={{
            width: "100%",
            justifyContent: "end",
          }}
          className="header"
        >
          {/* <Item className="menuitemparent" key="/">
            <Link className="menuitem" to="/">
              Home
            </Link>
          </Item>
          <Item className="menuitemparent" key="/about">
            <Link className="menuitem" to="/about">
              About
            </Link>
          </Item>
          <Item className="menuitemparent" key="/pricing">
            <Link className="menuitem" to="/pricing">
              Pricing
            </Link>
          </Item>
          <Item className="menuitemparent" key="/contactus">
            <Link className="menuitem" to="/contactus">
              Contact US
            </Link>
          </Item> */}
          {auth.user && (
            <>
              <Item className="menuitemparent" key="/category">
                <Link className="menuitem" to="/category">
                  Category
                </Link>
              </Item>
              <Item className="menuitemparent" key="/order">
                <Link className="menuitem" to="/order">
                  Order
                </Link>
              </Item>
            </>
          )}
        </Menu>

        {auth.user ? (
          <>
            <Link
              className="menuitem"
              to="/cart"
              style={{ margin: "0px 35px 0px 10px", textAlign: "center" }}
            >
              <Badge
                size="small"
                style={{
                  fontSize: "10px",
                  textAlign: "center",
                  backgroundColor: "#6534DA",
                }}
                count={cart?.length || 0}
                overflowCount={100}
              >
                <ShoppingCartOutlined style={{ fontSize: "25px" }} />
              </Badge>
            </Link>
            <Button
              style={{
                height: "40px",
                width: "11px 0px",
              }}
              className="button"
              type="primary"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              LogOut
            </Button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button
                className="button"
                style={{
                  height: "40px",
                  width: "110px",
                }}
                icon={<LoginOutlined />}
              >
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button
                style={{
                  height: "40px",
                  width: "110px",
                  marginLeft: "20px",
                }}
                className="button"
                type="primary"
                icon={<LoginOutlined />}
              >
                Register
              </Button>
            </Link>
          </>
        )}
      </div>
    </>
  );
}

export default Header;
