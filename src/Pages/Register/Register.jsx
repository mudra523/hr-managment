import React, { useEffect } from "react";
import Layout from "../../Layouts/index";
import { Form, Input, Button, Checkbox, Row, Col } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { postRequest } from "../../api";
import { useAuth } from "../../components/Auth";
import "./Register.scss";

function Register() {
  const navigate = useNavigate();
  const auth = useAuth();
  const location = useLocation();

  const redirectPath = location.state?.path || "/category";
  const onFinish = async (values) => {
    await postRequest("register", values).then(({ data }) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      auth.login(data.token);
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

  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };

  return (
    <Layout>
      <Row justify="center" className="reg_layout">
        <Col xs={24} sm={24} md={8} lg={8} xl={6} className="reg_box">
          <div className="reg_header">
            <div className="bold_text ">
              <h2>Welcome!</h2>
            </div>
            <div>
              <p>SignUp to continue</p>
            </div>
          </div>

          <Form
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className="reg_form"
            validateMessages={validateMessages}
          >
            <Form.Item
              name="fullname"
              rules={[
                {
                  required: true,
                  message: "Please input your fullname!",
                },
              ]}
            >
              <Input
                className="inputfield"
                style={{ padding: "10px" }}
                placeholder="Enter Fullname"
              />
            </Form.Item>
            {/* <Form.Item
              name="firstname"
              rules={[
                {
                  required: true,
                  message: "Please input your firstname!",
                },
              ]}
            >
              <Input
                className="inputfield"
                style={{ padding: "10px" }}
                placeholder="Enter FirstName"
              />
            </Form.Item>
            <Form.Item
              name="lastname"
              rules={[
                {
                  required: true,
                  message: "Please input your lastname!",
                },
              ]}
            >
              <Input
                className="inputfield"
                style={{ padding: "10px" }}
                placeholder="Enter LastName"
              />
            </Form.Item> */}
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
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email" },
              ]}
            >
              <Input
                className="inputfield"
                style={{ padding: "10px" }}
                placeholder="Enter Email"
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
              <Button
                style={{
                  fontSize: "15px",
                  height: "45px",
                  width: "125px",
                }}
                className="button"
                htmlType="submit"
              >
                Register
              </Button>
            </Form.Item>
            <div className="reg_footer">
              Already have an account?&nbsp;&nbsp;
              <Link to="/login" className="text">
                Login
              </Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Layout>
  );
}

export default Register;
