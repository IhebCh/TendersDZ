// src/pages/tenders/TendersList.tsx

import { useEffect, useState } from "react";
import { Button, Table, Space, message, Tag } from "antd";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/common/PageHeader";
import type { Tender } from "../../types";
import { get } from "../../api/client";

export function TendersList() {
  const [data, setData] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Backend: GET /tenders/ -> TenderRead[]
        const res = await get<Tender[]>("/tenders/");
        setData(res);
      } catch (e) {
        console.error(e);
        message.error(
          "Failed to load tenders. Check that you are logged in and the API is up."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <PageHeader
        title="Tenders"
        subtitle="Manage public tenders from identification to submission."
        action={
          <Button type="primary">
            <Link to="/tenders/new">New tender</Link>
          </Button>
        }
      />
      <Table
        rowKey="id"
        loading={loading}
        dataSource={data}
        columns={[
          {
            title: "ID",
            dataIndex: "id",
            width: 80,
          },
          {
            title: "Client ID",
            dataIndex: "client_id",
            width: 100,
          },
          {
            title: "Title",
            dataIndex: "title",
          },
          {
            title: "Reference No",
            dataIndex: "reference_no",
            render: (value: string | null | undefined) => value || "-",
          },
          {
            title: "Status",
            dataIndex: "status",
            render: (value: string) => <Tag>{value}</Tag>,
          },
          {
            title: "Submission deadline",
            dataIndex: "submission_deadline",
            render: (value: string | null | undefined) =>
              value ? new Date(value).toLocaleString() : "-",
          },
          {
            title: "Actions",
            render: (_, record) => (
              <Space>
                <Link to={`/tenders/${record.id}`}>View</Link>
                <Link to={`/tenders/${record.id}/edit`}>Edit</Link>
              </Space>
            ),
          },
        ]}
      />
    </>
  );
}
