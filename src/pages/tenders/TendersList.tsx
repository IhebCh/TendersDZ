import { useEffect, useState } from "react";
import { Button, Table, Space, message } from "antd";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/common/PageHeader";
import { StatusTag } from "../../components/common/StatusTag";
import type { Tender } from "../../types";
import { get } from "../../api/client";

export function TendersList() {
  const [data, setData] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await get<Tender[]>("/tenders/");
        setData(res);
      } catch (e) {
        console.error(e);
        message.error("Failed to load tenders. Check API configuration.");
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
        subtitle="Manage Algerian public tenders from discovery to execution."
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
            title: "Reference",
            dataIndex: "reference"
          },
          {
            title: "Title",
            dataIndex: "title"
          },
          {
            title: "Client",
            dataIndex: "client_name"
          },
          {
            title: "Status",
            dataIndex: "status",
            render: (value) => <StatusTag status={value} />
          },
          {
            title: "Submission deadline",
            dataIndex: "submission_deadline",
            render: (value: string | undefined) =>
              value ? new Date(value).toLocaleDateString() : "-"
          },
          {
            title: "Actions",
            render: (_, record) => (
              <Space>
                <Link to={`/tenders/${record.id}`}>View</Link>
                <Link to={`/tenders/${record.id}/edit`}>Edit</Link>
              </Space>
            )
          }
        ]}
      />
    </>
  );
}
