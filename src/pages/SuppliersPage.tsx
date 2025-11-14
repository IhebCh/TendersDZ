import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Space,
  Table,
  Tag,
  message
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  createSupplier,
  deleteSupplier,
  fetchSuppliers,
  updateSupplier
} from "../api/client";
import type { Supplier } from "../types";

export const SuppliersPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [form] = Form.useForm<Supplier>();

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchSuppliers();
      setSuppliers(data);
    } catch (e) {
      console.error(e);
      message.error("Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ is_oem: false, verified: false } as any);
    setModalVisible(true);
  };

  const openEdit = (record: Supplier) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (record: Supplier) => {
    Modal.confirm({
      title: "Delete supplier",
      content: `Are you sure you want to delete "${record.name}"?`,
      onOk: async () => {
        try {
          await deleteSupplier(record.id);
          message.success("Supplier deleted");
          await load();
        } catch (e) {
          console.error(e);
          message.error("Failed to delete supplier");
        }
      }
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await updateSupplier(editing.id, values);
        message.success("Supplier updated");
      } else {
        await createSupplier(values as any);
        message.success("Supplier created");
      }
      setModalVisible(false);
      await load();
    } catch (e: any) {
      if (!e?.errorFields) {
        console.error(e);
        message.error("Failed to save supplier");
      }
    }
  };

  const columns: ColumnsType<Supplier> = [
    {
      title: "Name",
      dataIndex: "name"
    },
    {
      title: "Contact",
      dataIndex: "contact"
    },
    {
      title: "Country",
      dataIndex: "country"
    },
    {
      title: "OEM",
      dataIndex: "is_oem",
      render: (val: boolean) =>
        val ? <Tag color="blue">OEM</Tag> : <Tag>Reseller</Tag>
    },
    {
      title: "Verified",
      dataIndex: "verified",
      render: (val: boolean) =>
        val ? <Tag color="green">Verified</Tag> : <Tag color="default">Unverified</Tag>
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => openEdit(record)}>
            Edit
          </Button>
          <Button danger size="small" onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={openCreate}>
          New supplier
        </Button>
      </Space>
      <Table<Supplier>
        rowKey="id"
        columns={columns}
        dataSource={suppliers}
        loading={loading}
      />

      <Modal
        title={editing ? "Edit supplier" : "New supplier"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        destroyOnClose
      >
        <Form<Supplier> layout="vertical" form={form}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input the name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Contact" name="contact">
            <Input />
          </Form.Item>
          <Form.Item label="Country" name="country">
            <Input />
          </Form.Item>
          <Form.Item name="is_oem" valuePropName="checked">
            <Checkbox>Original manufacturer (OEM)</Checkbox>
          </Form.Item>
          <Form.Item name="verified" valuePropName="checked">
            <Checkbox>Verified supplier</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
