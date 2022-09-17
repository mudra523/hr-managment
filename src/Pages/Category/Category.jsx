import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Upload,
  message,
  Typography,
  Divider,
} from "antd";
import React, { useEffect, useState } from "react";
import Layout from "../../Layouts/index";
import { deleteRequest, getRequest, postRequest, putRequest } from "../../api";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { selectAuthToken } from "../../features/authTokenSlice";

const { Meta } = Card;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function Category() {
  const navigate = useNavigate();
  const [fileList, setFileList] = useState(null);
  const [categories, setCategories] = useState([]);
  const [editForm, setEditForm] = useState({});

  //   const token = useSelector(selectAuthToken);

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : "";

  useEffect(() => {
    getRequest("categories").then(({ data }) => {
      setCategories(data);
    });
  }, []);

  const [form] = Form.useForm();

  const [visible, setVisible] = React.useState("");
  const [addModelVisible, setAddVisible] = React.useState(false);

  const showAddModal = (index) => {
    setAddVisible(true);
  };
  const showModal = (data) => {
    setVisible(data._id);
    setEditForm({
      name: data.name,
      description: data.description,
      image: "",
    });
  };

  const deleteCategory = async (id) => {
    await deleteRequest("category/delete/" + id).then(({ data }) => {
      setCategories((data) => data.filter((el) => el._id !== id));
    });
  };

  const handleAddCancel = () => {
    setVisible("");
    setAddVisible(false);
    form.resetFields();
    setFileList(null);
  };

  const handleCancel = () => {
    setVisible("");
    setEditForm({});
    setAddVisible(false);
    setFileList(null);
  };

  const onAddFinish = async (values) => {
    let categoryData = new FormData();
    categoryData.append("name", values?.name);
    categoryData.append("description", values?.description);
    categoryData.append("image", values?.image?.file?.originFileObj || "");

    await postRequest("category/create", categoryData).then(({ data }) => {
      setCategories((category) => [...category, ...[data.category]]);
      setAddVisible("");
      form.resetFields();
      setFileList(null);
    });
  };

  const onAddFinishFailed = (errorInfo) => {
    form.resetFields();
    setFileList(null);
    console.log("Failed:", errorInfo);
  };

  const onFinish = async (values, id) => {
    let categoryData = new FormData();
    categoryData.append("name", editForm?.name);
    categoryData.append("description", editForm?.description);
    categoryData.append("image", editForm?.image || "");
    await putRequest("category/edit/" + id, categoryData).then(({ data }) => {
      setCategories((category) =>
        category.map((el) => (el._id === id ? data.category : el))
      );
      setVisible("");
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", { errorInfo });
  };

  const handleChange = (info) => {
    let fileListId = [...info.fileList];
    fileListId = fileListId.slice(-1);
    fileListId = fileListId.map((file) => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });

    setFileList(fileListId);

    if (info.file.status === "uploading") {
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj);
    }
    setEditForm({
      name: editForm.name,
      description: editForm.description,
      image: info.file.originFileObj,
    });
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const dummyRequest = ({ onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const handleCard = (data) => {
    navigate(`${data._id}/courses`);
  };

  return (
    <Layout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "2% 7% 0% 7%",
        }}
      >
        <Typography style={{ fontSize: "24px", fontWeight: "bold" }}>
          Top Categories
        </Typography>
        {user?.role === "admin" ? (
          <Button
            className="button"
            onClick={showAddModal}
            style={{ height: "50px", width: "140px" }}
          >
            Add Category
          </Button>
        ) : null}

        <Modal
          title="Add Category"
          visible={addModelVisible}
          onCancel={handleAddCancel}
          footer={false}
        >
          <Form
            form={form}
            name="name"
            initialValues={{ remember: true }}
            onFinish={onAddFinish}
            onFinishFailed={onAddFinishFailed}
            autoComplete="off"
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input category name!",
                },
              ]}
            >
              <Input
                className="inputfield"
                style={{ padding: "10px", borderRadius: "5px" }}
                placeholder="Category Name"
              />
            </Form.Item>

            <Form.Item
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please input category description!",
                },
              ]}
            >
              <Input
                className="inputfield"
                style={{ padding: "10px", borderRadius: "5px" }}
                placeholder="Category Description"
              />
            </Form.Item>

            <Form.Item
              name="image"
              rules={[
                {
                  required: true,
                  message: "Please input category image!",
                },
              ]}
            >
              <Upload
                customRequest={dummyRequest}
                listType="text"
                // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                beforeUpload={beforeUpload}
                onChange={handleChange}
                fileList={fileList}
                // accept=".png,.jpg"
              >
                <Button icon={<UploadOutlined />}>Upload Image</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button
                style={{
                  fontSize: "15px",
                  height: "55px",
                  width: "160px",
                }}
                className="button"
                htmlType="submit"
              >
                Add Category
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
      <Row
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "5%",
        }}
      >
        {categories &&
          categories.length > 0 &&
          categories?.map((data, index) => {
            return (
              <Col
                lg={6}
                md={8}
                sm={12}
                xs={24}
                style={{
                  marginBottom: "35px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Card
                  key={index}
                  style={{ width: "100%", margin: "10px" }}
                  cover={
                    <img
                      onClick={() => handleCard(data)}
                      alt="example"
                      style={{
                        height: "100%",
                        width: "100%",
                      }}
                      className="categoryImage"
                      src={data.image}
                    />
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      onClick={() => handleCard(data)}
                      className="categoryText"
                    >
                      {data.name}
                    </Typography>
                    {user?.role === "admin" ? (
                      <>
                        <Divider
                          style={{
                            borderColor: "lightgrey",
                            margin: "10px",
                          }}
                        />
                        <Typography
                          className="categoryText"
                          onClick={() => showModal(data)}
                        >
                          Edit
                        </Typography>
                        <Divider
                          style={{ borderColor: "lightgrey", margin: "10px" }}
                        />

                        <Typography
                          className="categoryText"
                          onClick={() => deleteCategory(data._id)}
                        >
                          Delete
                        </Typography>
                      </>
                    ) : null}
                  </div>
                </Card>
                <Modal
                  title="Edit Category"
                  visible={visible === data._id}
                  onCancel={handleCancel}
                  footer={false}
                >
                  <Form
                    form={form}
                    name="name"
                    initialValues={{ remember: true }}
                    onFinish={(values) => onFinish(values, data._id)}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                    }}
                  >
                    {/* <Form.Item
                      name="name"
                      initialValue={data.name}
                      rules={[
                        {
                          required: true,
                          message: "Please input category name!",
                        },
                      ]}
                    > */}
                    <Input
                      defaultValue={editForm.name}
                      className="inputfield"
                      style={{
                        padding: "10px",
                        borderRadius: "5px",
                        margin: "10px 0px",
                      }}
                      placeholder="Category Name"
                      onChange={(e) =>
                        setEditForm({
                          name: e.target.value,
                          description: editForm.description,
                          image: editForm.image,
                        })
                      }
                    />
                    {/* </Form.Item> */}

                    {/* <Form.Item
                      name="description"
                      initialValue={data.description}
                      rules={[
                        {
                          required: true,
                          message: "Please input category description!",
                        },
                      ]}
                    > */}
                    <Input
                      defaultValue={editForm.description}
                      className="inputfield"
                      style={{
                        padding: "10px",
                        borderRadius: "5px",
                        margin: "10px 0px",
                      }}
                      placeholder="Category Description"
                      onChange={(e) =>
                        setEditForm({
                          name: editForm.name,
                          description: e.target.value,
                          image: editForm.image,
                        })
                      }
                    />
                    {/* </Form.Item> */}

                    {/* <Form.Item name="image"> */}
                    <Upload
                      name="image"
                      customRequest={dummyRequest}
                      listType="text"
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                      fileList={fileList}
                      accept=".png,.jpg"
                    >
                      <Button
                        style={{ margin: "10px 0px" }}
                        icon={<UploadOutlined />}
                      >
                        Change Image
                      </Button>
                    </Upload>
                    {/* </Form.Item> */}

                    {/* <Form.Item> */}
                    <Button
                      style={{
                        fontSize: "15px",
                        height: "55px",
                        width: "160px",
                        margin: "10px 0px",
                      }}
                      className="button"
                      htmlType="submit"
                    >
                      Edit Category
                    </Button>
                    {/* </Form.Item> */}
                  </Form>
                </Modal>
              </Col>
            );
          })}
      </Row>
    </Layout>
  );
}

export default Category;
