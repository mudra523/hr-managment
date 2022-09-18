import {
  Table,
  Col,
  Button,
  Modal,
  Row,
  Typography,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Select,
  Upload,
} from "antd";
import React, { useEffect, useState, useRef } from "react";
import Layout from "../../Layouts/index";
import { deleteRequest, getRequest } from "../../api";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../components/Auth";
import { postRequest } from "../../api";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import moment from "moment";
const { Title } = Typography;
const { Option } = Select;

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const formRef = useRef(null);
  const auth = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [editID, setEditID] = useState(null);
  const [editData, setEditData] = useState([]);
  
  const columns = [
    {
      title: "Fullname",
      dataIndex: "fullname",
      sorter: (a, b) => a.fullname - b.fullname,
    },
    {
      title: "DOB",
      dataIndex: "dob",
      render: (_, record) => <div>{moment(record?.dob).format("DD-MM-YYYY")}</div>,
      sorter: (a, b) => a.dob - b.dob,
    },
    {
      title: "Position",
      dataIndex: "relevantPosition",
      render: (_, record) => <div>{record?.Position?.[0]?.name}</div>,
      sorter: (a, b) => a?.Position?.[0]?.name - b?.position?.[0]?.name,
    },
    {
      title: "Technology",
      dataIndex: "technology",
      render: (_, record) => <div>{record?.technology}</div>,
    },
    {
      title: "Experience",
      dataIndex: "yearsOfExperience",
      sorter: (a, b) => a.yearsOfExperience - b.yearsOfExperience,
    },
    {
      title: "Current CTC",
      dataIndex: "currentCtc",
      sorter: (a, b) => a.currentCtc - b.currentCtc,
    },
    {
      title: "Expected CTC",
      dataIndex: "expectedCtc",
      sorter: (a, b) => a.expectedCtc - b.expectedCtc,
    },
    {
      title: "City",
      dataIndex: "currentCity",
      filterSearch: true,
    },
    {
      title: "Download CV",
      dataIndex: "cvUrl",
      render: (_, record) => {
        return (
          <span style={{ display: "flex", justifyContent: "center" }}>
            {record?.cvUrl ? (
              <Typography.Link
                style={{
                  marginRight: 8,
                }}
                target="_blank"
                href={"http://localhost:2325/" + record.cvUrl}
              >
                <DownloadOutlined />
              </Typography.Link>
            ) : (
              "-"
            )}
          </span>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => {
        return (
          <span>
            <Typography.Link
              onClick={() => editFormData(record?._id)}
              style={{
                marginRight: 8,
              }}
            >
              <EditOutlined />
            </Typography.Link>
            <Typography.Link
              onClick={async () => {
                await deleteRequest(`candidate/delete/${record._id}`).then(
                  ({ data }) => {
                    setCandidates((candidates) => {
                      return candidates.filter(
                        (candidate) => candidate._id != record._id
                      );
                    });
                    navigate(redirectPath, { replace: true });
                  }
                );
              }}
            >
              <DeleteOutlined />
            </Typography.Link>
          </span>
        );
      },
    },
  ];

  const dummyRequest = ({ onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const onChange = async (pagination, filters, sorter, extra) => {
    await getRequest(`candidates?key=&page=${pagination.current}`).then(
      ({ data }) => {
        setCandidates(data[0].data);
        setPage(data[0].metadata[0].page);
        setTotal(data[0].metadata[0].total);
      }
    );
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [positions, setPositions] = useState([]);

  const showModal = () => {
    setEditID(null);
    setEditData(null)
    setIsModalOpen(true);
  };

  const editFormData = (value) => {
    setIsModalOpen(true);
    setEditID(value);
    setEditData(candidates?.find((c) => c._id === value));
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const redirectPath = location.state?.path || "/dashboard";
  const onFinish = async (values) => {
    let candidateData = new FormData();
    candidateData.append("fullname", values?.fullname || '');
    candidateData.append("dob", values?.dob || '');
    candidateData.append("relevantPosition", values?.relevantPosition || '');
    candidateData.append("technology", values?.technology || '');
    candidateData.append("yearsOfExperience", values?.yearsOfExperience || '');
    candidateData.append("currentCity", values?.currentCity || '');
    candidateData.append("currentCtc", values?.currentCtc || '');
    candidateData.append("expectedCtc", values?.expectedCtc || '');
    candidateData.append("cvUrl", values?.cvUrl);
    console.log("AA",values?.cvUrl?.file?.originFileObj)
    editID
      ? await postRequest(`candidate/edit/${editID}`, values).then(
          ({ data }) => {
            setIsModalOpen(false);
            setCandidates((candidates) =>
              candidates.map((candidate) => {
                if (candidate._id === editID) {
                  return data?.candidate;
                } else {
                  return candidate;
                }
              })
            );
            navigate(redirectPath, { replace: true });
          }
        )
      : await postRequest(`candidate/add`, values).then(({ data }) => {
          setIsModalOpen(false);
          setCandidates((candidates) => [...candidates, data?.candidate]);
          navigate(redirectPath, { replace: true });
        });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    await getRequest(`candidates?key=&page=${page}`).then(({ data }) => {
      setCandidates(data[0].data);
      setPage(data[0]?.metadata[0]?.page);
      setTotal(data[0]?.metadata[0]?.total);
    });

    await getRequest("positions").then(({ data }) => {
      setPositions(data);
    });
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
  const onSearch = async (e) => {
    const value = e.target.value;
    await getRequest(`candidates?key=${value}&page=1`).then(({ data }) => {
      setCandidates(data[0].data);
      setPage(data[0].metadata[0].page);
      setTotal(data[0].metadata[0].total);
    });
  };

  return (
    <>
      <Layout>
        <Row style={{ marginTop: "2em" }} justify="center">
          <Col xs={24} sm={24} md={22} lg={20} xl={20}>
            <Row
              style={{ marginBottom: "2em" }}
              justify="space-between"
              align="center"
            >
              <Col>
                <Title level={2}>Candidate Data</Title>
              </Col>
              <Col style={{ display: "flex", alignItems: "center" }}>
                <Input
                  size="large"
                  className="inputfield"
                  style={{ width: 400, padding: "10px" }}
                  placeholder="Serch Candidate..."
                  onChange={onSearch}
                  suffix={<SearchOutlined />}
                />
              </Col>
              <Col>
                <Button className="button" onClick={showModal}>
                  Add Data
                </Button>
              </Col>
            </Row>
            <Table
              columns={columns}
              dataSource={candidates}
              onChange={onChange}
              pagination={{
                total: total,
                current: page,
                pageSize: 10,
              }}
              scroll={{ x: true }}
            />
          </Col>
        </Row>
      </Layout>
      <Modal
        title="Basic Modal"
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose={true}
      >
        <Form
          name="basic"
          initialValues={{
            remember: true,
            fullname: editData?.fullname,
            dob: moment(editData?.dob),
            technology: editData?.technology,
            relevantPosition: editData?.position?._id,
            yearsOfExperience: editData?.yearsOfExperience,
            currentCtc: editData?.currentCtc,
            expectedCtc: editData?.expectedCtc,
            currentCity: editData?.currentCity,
            cvUrl: editData?.cvUrl,
          }}
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
                name="dob"
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
                  format={"YYYY-MM-DD"}
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
                  <Option key="Node JS">Node JS</Option>
                  <Option key="Nest JS">Nest JS</Option>
                  <Option key="React">React</Option>
                  <Option key="AWS">AWS</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="relevantPosition"
                rules={[
                  {
                    required: true,
                    message: "Please select relevant position!",
                  },
                ]}
              >
                <Select
                  placeholder="Select Relevant Position"
                  defaultValue={editData?.relevantPosition|| ''}
                >
                  {positions.map((position, index) => {
                    return (
                      <Select.Option key={index} value={position._id}>
                        {position.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="yearsOfExperience"
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
                name="currentCtc"
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
                name="expectedCtc"
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
                name="currentCity"
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
                name="cvUrl"
                rules={[{ required: true, message: "Please Upload CV!" }]}
              >
                <Upload
                  name="cvUrl"
                  action="/upload.do"
                  listType="picture"
                  style={{ padding: "10px", width: "100%" }}
                  customRequest={dummyRequest}
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
