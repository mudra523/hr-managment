import React, { useEffect } from "react";
import Layout from "../../Layouts/index";
import { Form, Input, Button, Checkbox, Row, Col } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { postRequest } from "../../api";
import { useAuth } from "../../components/Auth";
import { useDispatch } from "react-redux";
import { store } from "../../features/authTokenSlice";
import "./login.scss";

function Login() {
  const navigate = useNavigate();
  const auth = useAuth();
  const location = useLocation();
  const dispatch = useDispatch();

  const redirectPath = location.state?.path || "/category";
  const onFinish = async (values) => {
    await postRequest("login", values).then(({ data }) => {
      auth.login(data.token);
      dispatch(store({ token: data.token, user: JSON.stringify(data.user) }));
      navigate(redirectPath, { replace: true });
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/category");
    }
  }, []);

  return (
    <Layout>
      <Row justify="center" className="login_layout">
        <Col xs={24} sm={24} md={8} lg={8} xl={6} className="login_box">
          <div className="login_header">
            <div className="bold_text "><h2>Welcome Back!</h2></div>
            <div ><p>Login to continue</p></div>
          </div>
          <Form
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className="login_form"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input
                className="inputfield"
                style={{ padding: "10px" }}
                placeholder="Enter UserName"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input
                type="password"
                className="inputfield"
                style={{ padding: "10px" }}
                placeholder="Enter Password"
              />
            </Form.Item>
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <Form.Item>
              <Button className="button" htmlType="submit">
                LOGIN 
              </Button>
            </Form.Item>
            <div className="login_footer">
              New User?&nbsp;&nbsp;
              <Link to="/register" className="text">
                Sign Up
              </Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Layout>
  );
}

export default Login;
