import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Input, Space, message } from "antd";
import { PageHeader } from "../../components/common/PageHeader";
import type { Supplier } from "../../types";
import { get, post, put } from "../../api/client";

type Mode = "create" | "edit";

interface Props {
  mode: Mode;
}

export function SupplierForm({ mode }: Props) {
  const [form] = Form.useForm();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && id) {
      const load = async () => {
        try {
          setLoading(true);
          const data = await get<Supplier>(`/suppliers/${id}`);
          form.setFieldsValue(data);
        } catch (e) {
          console.error(e);
          message.error("Failed to load supplier.");
        } finally {
          setLoading(false);
        }
      };
      load();
    }
  }, [mode, id, form]);

  const handleFinish = async (values: Supplier) => {
    try {
      setLoading(true);
      if (mode === "create") {
        await post<Supplier>("/suppliers/", values);
        message.success("Supplier created");
      } else if (mode === "edit" && id) {
        await put<Supplier>(`/suppliers/${id}`, values);
        message.success("Supplier updated");
      }
      navigate("/suppliers");
    } catch (e) {
      console.error(e);
      message.error("Failed to save supplier.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title={mode === "create" ? "New supplier" : "Edit supplier"}
        breadcrumbItems={[
          { label: "Suppliers" },
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
          label="Name"
          name="name"
          rules={[{ required: true, message: "Name is required" }]}
        >
          <Input placeholder="Supplier name" />
        </Form.Item>
        <Form.Item label="Country" name="country">
          <Input placeholder="Country" />
        </Form.Item>
        <Form.Item label="Contact name" name="contact_name">
          <Input placeholder="Main contact person" />
        </Form.Item>
        <Form.Item label="Contact email" name="contact_email">
          <Input placeholder="email@example.com" />
        </Form.Item>
        <Form.Item label="Contact phone" name="contact_phone">
          <Input placeholder="+213 ..." />
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
