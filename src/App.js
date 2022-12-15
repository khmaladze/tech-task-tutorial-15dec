import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import create from "zustand";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { Button, Space, Form, Input, Select } from "antd";
const { Option } = Select;

const useTableStore = create((set) => ({
  table: [],
  updateTable: (tableData) => set({ table: tableData }),
  deleteTable: (state, rowId) =>
    set({ table: state.filter((item) => item.id !== rowId) }),
  addTable: (tableData, values) => {
    const newData = [
      ...tableData,
      {
        id: tableData[tableData.length - 1].id + 1,
        name: values.name,
        email: values.email,
        gender: values.gender,
        address: {
          city: values.city,
          street: values.street,
        },
        phone: values.phone,
      },
    ];
    set({ table: newData });
  },
}));

const App = () => {
  const [open, setOpen] = useState(false);
  const state = useTableStore();
  console.log(state);
  const table = useTableStore((state) => state.table);
  const updateAmount = useTableStore((state) => state.updateTable);
  const deleteTable = useTableStore((state) => state.deleteTable);
  const addTable = useTableStore((state) => state.addTable);

  const columns = [
    { name: "id", selector: (row) => row.id },
    {
      name: "name",
      selector: (row) => row.name,
    },
    {
      name: "email",
      selector: (row) => row.email,
    },
    { name: "gender", selector: (row) => row.gender },
    {
      name: "address",
      selector: (row) => row.address.street + " " + row.address.city,
    },
    { name: "phone", selector: (row) => row.phone },
    {
      name: "add button",
      selector: () => (
        <Space wrap>
          <Button
            type="primary"
            onClick={() => {
              setOpen(true);
            }}
          >
            add row
          </Button>
        </Space>
      ),
    },
    {
      name: "remove button",
      selector: (row) => (
        <Space wrap>
          <Button danger onClick={() => deleteTable(table, row.id)}>
            remove row
          </Button>
        </Space>
      ),
    },
  ];

  const getData = async () => {
    const response = await fetch("/events_list");
    const responseData = await response.json();
    updateAmount(responseData);
  };

  useEffect(() => {
    getData();
  }, []);

  const onFinish = (values) => {
    console.log("Success:", values);
    addTable(table, values);
    setOpen(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      {table ? (
        <DataTable
          title={"table data"}
          columns={columns}
          data={table}
          pagination
        />
      ) : (
        "loading"
      )}
      <Modal isOpen={open} toggle={() => setOpen(false)}>
        <ModalHeader>add table row</ModalHeader>
        <ModalBody>
          <Form
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input your name!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="gender"
              label="Gender"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                placeholder="Select a option and change input text above"
                // onChange={this.onGenderChange}
                allowClear
              >
                <Option value="male">male</Option>
                <Option value="female">female</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Address street"
              name="street"
              rules={[
                {
                  required: true,
                  message: "Please input your address street!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Address city"
              name="city"
              rules={[
                {
                  required: true,
                  message: "Please input your address city!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="phone"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Please input your phone!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default App;
