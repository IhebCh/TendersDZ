// src/pages/tenders/TenderDetails.tsx

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, Descriptions, Space, Button, message, Tag } from "antd";
import { PageHeader } from "../../components/common/PageHeader";
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
            <Descriptions.Item label="ID">{data.id}</Descriptions.Item>
            <Descriptions.Item label="Client ID">
              {data.client_id}
            </Descriptions.Item>
            <Descriptions.Item label="Title">
              {data.title}
            </Descriptions.Item>
            <Descriptions.Item label="Reference number">
              {data.reference_no || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Currency">
              {data.currency}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag>{data.status}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Submission deadline">
              {data.submission_deadline
                ? new Date(data.submission_deadline).toLocaleString()
                : "-"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Card>
    </>
  );
}
