import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Form, Input, Typography, message } from "antd";
import { loginApi } from "../../api/client";

const { Title, Text } = Typography;

export function LoginPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFinish = async (values: { username: string; password: string }) => {
    try {
      setLoading(true);
      await loginApi(values.username, values.password);
      message.success("Logged in successfully");
      navigate("/");
    } catch (e) {
      console.error(e);
      message.error("Login failed. Check your credentials or API endpoint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f3f4f6"
      }}
    >
      <Card style={{ width: 360 }}>
        <Title level={3} style={{ textAlign: "center", marginBottom: 8 }}>
          TendersDZ
        </Title>
        <Text type="secondary" style={{ display: "block", textAlign: "center", marginBottom: 16 }}>
          Sign in to manage your tenders
        </Text>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Username is required" }]}
          >
            <Input autoComplete="username" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password autoComplete="current-password" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
            >
              Sign in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
