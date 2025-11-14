import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  message
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import {
  createTender,
  deleteTender,
  fetchClients,
  fetchTenders,
  updateTender
} from "../api/client";
import type { Client, Tender, TenderStatus } from "../types";
import { useNavigate } from "react-router-dom";

const statusOptions: TenderStatus[] = [
  "IDENTIFIED",
  "BOUGHT",
  "STUDYING",
  "SUBMITTED",
  "WON",
  "LOST"
];

export const TendersPage: React.FC = () => {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Tender | null>(null);
  const [form] = Form.useForm<any>();
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const [tenderList, clientList] = await Promise.all([
        fetchTenders(),
        fetchClients()
      ]);
      setTenders(tenderList);
      setClients(clientList);
    } catch (e) {
      console.error(e);
      message.error("Failed to load tenders");
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
    form.setFieldsValue({
      status: "IDENTIFIED",
      currency: "DZD"
    });
    setModalVisible(true);
  };

  const openEdit = (record: Tender) => {
    setEditing(record);
    form.setFieldsValue({
      ...record,
      submission_deadline: record.submission_deadline
        ? dayjs(record.submission_deadline)
        : null
    });
    setModalVisible(true);
  };

  const handleDelete = async (record: Tender) => {
    Modal.confirm({
      title: "Delete tender",
      content: `Are you sure you want to delete "${record.title}"?`,
      onOk: async () => {
        try {
          await deleteTender(record.id);
          message.success("Tender deleted");
          await load();
        } catch (e) {
          console.error(e);
          message.error("Failed to delete tender");
        }
      }
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        client_id: values.client_id,
        title: values.title,
        reference_no: values.reference_no || null,
        currency: values.currency,
        status: values.status,
        submission_deadline: values.submission_deadline
          ? values.submission_deadline.toISOString()
          : null
      };
      if (editing) {
        await updateTender(editing.id, payload);
        message.success("Tender updated");
      } else {
        await createTender(payload as any);
        message.success("Tender created");
      }
      setModalVisible(false);
      await load();
    } catch (e: any) {
      if (!e?.errorFields) {
        console.error(e);
        message.error("Failed to save tender");
      }
    }
  };

  const clientById = useMemo(
    () =>
      new Map<number, Client>(clients.map((c) => [c.id, c])),
    [clients]
  );

  const columns: ColumnsType<Tender> = [
    {
      title: "Title",
      dataIndex: "title"
    },
    {
      title: "Client",
      dataIndex: "client_id",
      render: (client_id: number) => clientById.get(client_id)?.name ?? client_id
    },
    {
      title: "Reference",
      dataIndex: "reference_no"
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: TenderStatus) => {
        let color: string = "default";
        if (status === "WON") color = "green";
        else if (status === "LOST") color = "red";
        else if (status === "SUBMITTED") color = "blue";
        else if (status === "STUDYING") color = "orange";
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: "Deadline",
      dataIndex: "submission_deadline",
      render: (val?: string | null) =>
        val ? dayjs(val).format("YYYY-MM-DD") : "—"
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => navigate(`/tenders/${record.id}`)}>
            Details
          </Button>
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
          New tender
        </Button>
      </Space>
      <Table<Tender>
        rowKey="id"
        columns={columns}
        dataSource={tenders}
        loading={loading}
      />

      <Modal
        title={editing ? "Edit tender" : "New tender"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        destroyOnClose
        width={600}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Client"
            name="client_id"
            rules={[{ required: true, message: "Please select a client" }]}
          >
            <Select
              showSearch
              placeholder="Select client"
              optionFilterProp="label"
              options={clients.map((c) => ({
                label: c.name,
                value: c.id
              }))}
            />
          </Form.Item>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please input the title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Reference" name="reference_no">
            <Input />
          </Form.Item>
          <Form.Item
            label="Currency"
            name="currency"
            rules={[{ required: true, message: "Please input the currency" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select the status" }]}
          >
            <Select
              options={statusOptions.map((s) => ({ label: s, value: s }))}
            />
          </Form.Item>
          <Form.Item label="Submission deadline" name="submission_deadline">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
