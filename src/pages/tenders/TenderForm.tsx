import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, DatePicker, Form, Input, Select, Space, message } from "antd";
import dayjs from "dayjs";
import { PageHeader } from "../../components/common/PageHeader";
import type { Tender, TenderStatus } from "../../types";
import { get, post, put } from "../../api/client";

const { Option } = Select;

type Mode = "create" | "edit";

interface Props {
  mode: Mode;
}

export function TenderForm({ mode }: Props) {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && id) {
      const load = async () => {
        try {
          setLoading(true);
          const data = await get<Tender>(`/tenders/${id}`);
          form.setFieldsValue({
            reference: data.reference,
            title: data.title,
            client_name: data.client_name,
            status: data.status,
            submission_deadline: data.submission_deadline
              ? dayjs(data.submission_deadline)
              : undefined
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

  const handleFinish = async (values: any) => {
    const payload: Partial<Tender> = {
      reference: values.reference,
      title: values.title,
      client_name: values.client_name,
      status: values.status as TenderStatus,
      submission_deadline: values.submission_deadline
        ? values.submission_deadline.toISOString()
        : undefined
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
      message.error("Failed to save tender. Check API or payload.");
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
          { label: mode === "create" ? "New" : "Edit" }
        ]}
      />
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          name="reference"
          label="Reference"
          rules={[{ required: true, message: "Reference is required" }]}
        >
          <Input placeholder="AO-01/2025/MDN/..." />
        </Form.Item>
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Title is required" }]}
        >
          <Input placeholder="Datacenter equipment acquisition" />
        </Form.Item>
        <Form.Item name="client_name" label="Client">
          <Input placeholder="Ministry of Defense" />
        </Form.Item>
        <Form.Item name="status" label="Status" initialValue="draft">
          <Select>
            <Option value="draft">Draft</Option>
            <Option value="in_study">In study</Option>
            <Option value="go">Go</Option>
            <Option value="submitted">Submitted</Option>
            <Option value="won">Won</Option>
            <Option value="lost">Lost</Option>
          </Select>
        </Form.Item>
        <Form.Item name="submission_deadline" label="Submission deadline">
          <DatePicker style={{ width: "100%" }} />
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
