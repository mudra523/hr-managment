import {
  Table,
  Card,
  Col,
  Button,
  Modal,
  Row,
  Typography,
  Form,
  Input,
  Checkbox,
  DatePicker,
  InputNumber,
  Select,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import Layout from "../../Layouts/index";
import { getRequest } from "../../api";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../components/Auth";
import { postRequest } from "../../api";
import { useSelector } from "react-redux";
import { selectAuthToken } from "../../features/authTokenSlice";

const { Meta } = Card;
const { Title } = Typography;
const { Option } = Select;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const [fileList, setFileList] = useState(null);
  const [categories, setCategories] = useState([]);
  const [editForm, setEditForm] = useState({});

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : "";

  useEffect(() => {
    getRequest("categories").then(({ data }) => {
      setCategories(data);
    });
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      filters: [
        {
          text: "Joe",
          value: "Joe",
        },
        {
          text: "Category 1",
          value: "Category 1",
          children: [
            {
              text: "Yellow",
              value: "Yellow",
            },
            {
              text: "Pink",
              value: "Pink",
            },
          ],
        },
        {
          text: "Category 2",
          value: "Category 2",
          children: [
            {
              text: "Green",
              value: "Green",
            },
            {
              text: "Black",
              value: "Black",
            },
          ],
        },
      ],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.name.includes(value),
    },
    {
      title: "DOB",
      dataIndex: "dob",
      sorter: (a, b) => a.dob - b.dob,
    },
    {
      title: "Position",
      dataIndex: "position",
    },
    {
      title: "Technology",
      dataIndex: "technology",
    },
    {
      title: "Experience",
      dataIndex: "experience",
      sorter: (a, b) => a.experience - b.experience,
    },
    {
      title: "CTC",
      dataIndex: "ctc",
      sorter: (a, b) => a.ctc - b.ctc,
    },
    {
      title: "Expected CTC",
      dataIndex: "ectc",
      sorter: (a, b) => a.ectc - b.ectc,
    },
    {
      title: "Download CV",
      dataIndex: "cv",
    },
    {
      title: "City",
      dataIndex: "city",
      filters: [
        {
          text: "London",
          value: "London",
        },
        {
          text: "New York",
          value: "New York",
        },
      ],
      onFilter: (value, record) => record.address.startsWith(value),
      filterSearch: true,
    },
  ];
  const data = [
    {
      key: "1",
      name: "John Brown",
      dob: "",
      position: "",
      technology: "",
      experience: "",
      ctc: "",
      ectc: "",
      cv: "",
      city: "New York",
    },
    {
      key: "2",
      name: "Jim Green",
      dob: "",
      position: "",
      technology: "",
      experience: "",
      ctc: "",
      ectc: "",
      cv: "",
      city: "London",
    },
  ];
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    console.log("modal");
    setIsModalOpen(true);
  };

  const handleOk = () => {
    console.log("ok");
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    console.log("cancel");
    setIsModalOpen(false);
  };

  const redirectPath = location.state?.path || "/dashboard";
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
      navigate("/dashboard");
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
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  return (
    <>
      <Layout>
        <Row style={{ marginTop: "2em" }} justify="center">
          <Col xs={24} sm={24} md={22} lg={20} xl={20}>
            <Row style={{ marginBottom: "2em" }} justify="space-between">
              <Col>
                <Title level={2}>Candidate Data</Title>
              </Col>
              <Col>
                <Button className="button" onClick={showModal}>
                  Add Data
                </Button>
              </Col>
            </Row>
            <Table columns={columns} dataSource={data} onChange={onChange} />
          </Col>
        </Row>
      </Layout>
      <Modal
        title="Basic Modal"
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          className="cd_form"
          validateMessages={validateMessages}
        >
          <Row
            gutter={{
              xs: 8,
              sm: 16,
              md: 24,
              lg: 32,
            }}
          >
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="fullname"
                rules={[
                  {
                    required: true,
                    message: "Please enter fullname!",
                  },
                ]}
              >
                <Input
                  className="inputfield"
                  style={{ padding: "10px" }}
                  placeholder="Enter Fullname"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="Date Of Birth"
                rules={[
                  {
                    required: true,
                    message: "Please enter Date of Birth!",
                  },
                ]}
              >
                <DatePicker
                  className="inputfield"
                  style={{ padding: "10px", width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item
                name="technology"
                rules={[
                  {
                    required: true,
                    message: "Please enter Technology!",
                  },
                ]}
              >
                <Select
                  mode="tags"
                  style={{
                    width: "100%",
                  }}
                  placeholder="Enter Technology"
                  onChange={handleChange}
                >
                  <Option key="1">Node JS</Option>
                  <Option key="2">Nest JS</Option>
                  <Option key="3">React</Option>
                  <Option key="4">AWS</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="position"
                rules={[
                  {
                    required: true,
                    message: "Please select relevant position!",
                  },
                ]}
              >
                <Select placeholder="Select Relevant Position">
                  <Select.Option value="demo">Demo</Select.Option>
                  <Select.Option value="demo">Demo</Select.Option>
                  <Select.Option value="demo">Demo</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="experience"
                rules={[
                  {
                    required: true,
                    message: "Please enter Year Of Experience!",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Year Of Experience"
                  className="inputfield"
                  style={{ padding: "6px", width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="ctc"
                rules={[{ required: true, message: "Please enter CTC!" }]}
              >
                <Input
                  className="inputfield"
                  style={{ padding: "10px" }}
                  placeholder="Enter CTC"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="ectc"
                rules={[
                  { required: true, message: "Please enter Expected CTC!" },
                ]}
              >
                <Input
                  className="inputfield"
                  style={{ padding: "10px" }}
                  placeholder="Enter Expected CTC"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="city"
                rules={[
                  { required: true, message: "Please enter Current City!" },
                ]}
              >
                <Input
                  className="inputfield"
                  style={{ padding: "10px" }}
                  placeholder="Enter Current City"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="upload"
                rules={[{ required: true, message: "Please Upload CV!" }]}
              >
                <Upload
                  name="logo"
                  action="/upload.do"
                  listType="picture"
                  style={{ padding: "10px", width: "100%" }}
                >
                  <Button>Upload CV</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button className="button" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Dashboard;
