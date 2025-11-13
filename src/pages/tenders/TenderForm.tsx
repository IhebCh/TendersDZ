// src/pages/tenders/TenderForm.tsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Space,
  message,
  InputNumber,
} from "antd";
import dayjs from "dayjs";
import { PageHeader } from "../../components/common/PageHeader";
import type { Tender, Client } from "../../types";
import { get, post, put } from "../../api/client";

const { Option } = Select;

type Mode = "create" | "edit";

interface Props {
  mode: Mode;
}

interface TenderFormValues {
  client_id: number;
  title: string;
  reference_no?: string;
  currency?: string;
  status?: string;
  submission_deadline?: dayjs.Dayjs;
}

export function TenderForm({ mode }: Props) {
  const [form] = Form.useForm<TenderFormValues>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);

  // Load clients for the select
  useEffect(() => {
    const loadClients = async () => {
      try {
        const res = await get<Client[]>("/clients/");
        setClients(res);
      } catch (e) {
        console.error(e);
        message.error("Failed to load clients.");
      }
    };
    loadClients();
  }, []);

  // Load existing tender data when editing
  useEffect(() => {
    if (mode === "edit" && id) {
      const load = async () => {
        try {
          setLoading(true);
          const data = await get<Tender>(`/tenders/${id}`);
          form.setFieldsValue({
            client_id: data.client_id,
            title: data.title,
            reference_no: data.reference_no ?? undefined,
            currency: data.currency,
            status: data.status,
            submission_deadline: data.submission_deadline
              ? dayjs(data.submission_deadline)
              : undefined,
          });
        } catch (e) {
          console.error(e);
          message.error("Failed to load tender.");
        } finally {
          setLoading(false);
        }
      };
      load();
    }
  }, [mode, id, form]);

  const handleFinish = async (values: TenderFormValues) => {
    // Build payload exactly like TenderCreate in backend
    const payload = {
      client_id: values.client_id,
      title: values.title,
      reference_no: values.reference_no ?? null,
      currency: values.currency ?? "DZD",
      status: values.status ?? "IDENTIFIED",
      submission_deadline: values.submission_deadline
        ? values.submission_deadline.toISOString()
        : null,
    };

    try {
      setLoading(true);
      if (mode === "create") {
        await post<Tender>("/tenders/", payload);
        message.success("Tender created");
      } else if (mode === "edit" && id) {
        await put<Tender>(`/tenders/${id}`, payload);
        message.success("Tender updated");
      }
      navigate("/tenders");
    } catch (e) {
      console.error(e);
      message.error("Failed to save tender. Check payload / API logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title={mode === "create" ? "New tender" : "Edit tender"}
        breadcrumbItems={[
          { label: "Tenders" },
          { label: mode === "create" ? "New" : "Edit" },
        ]}
      />
      <Form<TenderFormValues>
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        style={{ maxWidth: 600 }}
        initialValues={{
          currency: "DZD",
          status: "IDENTIFIED",
        }}
      >
        <Form.Item
          name="client_id"
          label="Client"
          rules={[{ required: true, message: "Client is required" }]}
        >
          <Select
            placeholder="Select client"
            showSearch
            optionFilterProp="children"
          >
            {clients.map((c) => (
              <Option key={c.id} value={c.id}>
                {c.name} (id: {c.id})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Title is required" }]}
        >
          <Input placeholder="Datacenter acquisition, spare parts, etc." />
        </Form.Item>

        <Form.Item name="reference_no" label="Reference number">
          <Input placeholder="AO-01/2025/MDN/..." />
        </Form.Item>

        <Form.Item name="currency" label="Currency">
          <Input placeholder="DZD" />
        </Form.Item>

        <Form.Item name="status" label="Status">
          <Select>
            <Option value="IDENTIFIED">IDENTIFIED</Option>
            <Option value="STUDYING">STUDYING</Option>
            <Option value="SUBMITTED">SUBMITTED</Option>
            <Option value="WON">WON</Option>
            <Option value="LOST">LOST</Option>
          </Select>
        </Form.Item>

        <Form.Item name="submission_deadline" label="Submission deadline">
          <DatePicker
            showTime
            style={{ width: "100%" }}
            placeholder="Select submission date & time"
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
}
