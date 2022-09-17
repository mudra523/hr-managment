import { Table, Card, Col, Button, Modal, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import Layout from "../../Layouts/index";
import { getRequest } from "../../api";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { selectAuthToken } from "../../features/authTokenSlice";

const { Meta } = Card;
const { Title } = Typography;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function Dashboard() {
  const navigate = useNavigate();
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
  const [open, setOpen] = useState(false);

  return (
    <Layout>
      <Row style={{ marginTop: "2em" }} justify="center">
        <Col xs={24} sm={24} md={22} lg={20} xl={20}>
          <Row style={{ marginBottom: "2em" }} justify="space-between">
            <Col>Candidate Data</Col>
            <Col>
              <Button className="button" onClick={() => setOpen(true)}>
                Add Data
              </Button>
            </Col>
          </Row>
          <Table columns={columns} dataSource={data} onChange={onChange} />

          <Modal
            title="Modal 1000px width"
            centered
            open={open}
            onOk={() => setOpen(false)}
            onCancel={() => setOpen(false)}
            width={1000}
          >
            <p>some contents...</p>
            <p>some contents...</p>
            <p>some contents...</p>
          </Modal>
        </Col>
      </Row>
    </Layout>
  );
}

export default Dashboard;
