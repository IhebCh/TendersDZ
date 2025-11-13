import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, Descriptions, Space, Button, message } from "antd";
import { PageHeader } from "../../components/common/PageHeader";
import { StatusTag } from "../../components/common/StatusTag";
import type { Tender } from "../../types";
import { del, get } from "../../api/client";

export function TenderDetails() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Tender | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setLoading(true);
        const res = await get<Tender>(`/tenders/${id}`);
        setData(res);
      } catch (e) {
        console.error(e);
        message.error("Failed to load tender.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      await del(`/tenders/${id}`);
      message.success("Tender deleted");
      navigate("/tenders");
    } catch (e) {
      console.error(e);
      message.error("Failed to delete tender.");
    }
  };

  return (
    <>
      <PageHeader
        title={`Tender #${id}`}
        subtitle={data?.title}
        breadcrumbItems={[{ label: "Tenders" }, { label: "Detail" }]}
        action={
          <Space>
            <Button>
              <Link to={`/tenders/${id}/edit`}>Edit</Link>
            </Button>
            <Button danger onClick={handleDelete}>
              Delete
            </Button>
          </Space>
        }
      />
      <Card loading={loading}>
        {data && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Reference">
              {data.reference}
            </Descriptions.Item>
            <Descriptions.Item label="Title">
              {data.title}
            </Descriptions.Item>
            <Descriptions.Item label="Client">
              {data.client_name || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <StatusTag status={data.status} />
            </Descriptions.Item>
            <Descriptions.Item label="Submission deadline">
              {data.submission_deadline
                ? new Date(data.submission_deadline).toLocaleDateString()
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Created at">
              {data.created_at
                ? new Date(data.created_at).toLocaleString()
                : "-"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Card>
    </>
  );
}
