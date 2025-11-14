import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Space, Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { createClient, deleteClient, fetchClients, updateClient } from "../api/client";
import type { Client } from "../types";

export const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [form] = Form.useForm<Client>();

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchClients();
      setClients(data);
    } catch (e) {
      console.error(e);
      message.error("Failed to load clients");
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
    setModalVisible(true);
  };

  const openEdit = (record: Client) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (record: Client) => {
    Modal.confirm({
      title: "Delete client",
      content: `Are you sure you want to delete "${record.name}"?`,
      onOk: async () => {
        try {
          await deleteClient(record.id);
          message.success("Client deleted");
          await load();
        } catch (e) {
          console.error(e);
          message.error("Failed to delete client");
        }
      }
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await updateClient(editing.id, values);
        message.success("Client updated");
      } else {
        await createClient(values as any);
        message.success("Client created");
      }
      setModalVisible(false);
      await load();
    } catch (e: any) {
      if (!e?.errorFields) {
        console.error(e);
        message.error("Failed to save client");
      }
    }
  };

  const columns: ColumnsType<Client> = [
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
      title: "Notes",
      dataIndex: "notes",
      ellipsis: true
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
          New client
        </Button>
      </Space>
      <Table<Client>
        rowKey="id"
        columns={columns}
        dataSource={clients}
        loading={loading}
      />

      <Modal
        title={editing ? "Edit client" : "New client"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        destroyOnClose
      >
        <Form<Client> layout="vertical" form={form}>
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
          <Form.Item label="Notes" name="notes">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
