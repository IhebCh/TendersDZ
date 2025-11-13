import { useEffect, useState } from "react";
import { Button, Table, Space, message } from "antd";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/common/PageHeader";
import type { Supplier } from "../../types";
import { get } from "../../api/client";

export function SuppliersList() {
  const [data, setData] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await get<Supplier[]>("/suppliers/");
        setData(res);
      } catch (e) {
        console.error(e);
        message.error("Failed to load suppliers.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      <PageHeader
        title="Suppliers"
        subtitle="Manage your local and international suppliers."
        action={
          <Button type="primary">
            <Link to="/suppliers/new">New supplier</Link>
          </Button>
        }
      />
      <Table
        rowKey="id"
        loading={loading}
        dataSource={data}
        columns={[
          { title: "Name", dataIndex: "name" },
          { title: "Country", dataIndex: "country" },
          { title: "Contact", dataIndex: "contact_name" },
          { title: "Email", dataIndex: "contact_email" },
          { title: "Phone", dataIndex: "contact_phone" },
          {
            title: "Actions",
            render: (_, record) => (
              <Space>
                <Link to={`/suppliers/${record.id}/edit`}>Edit</Link>
              </Space>
            )
          }
        ]}
      />
    </>
  );
}
