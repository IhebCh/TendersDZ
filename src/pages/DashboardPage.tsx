import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Typography } from "antd";
import { fetchClients, fetchSuppliers, fetchTenders } from "../api/client";
import dayjs from "dayjs";
import type { Tender } from "../types";

const { Title, Text } = Typography;

export const DashboardPage: React.FC = () => {
  const [clientsCount, setClientsCount] = useState<number | null>(null);
  const [suppliersCount, setSuppliersCount] = useState<number | null>(null);
  const [tenders, setTenders] = useState<Tender[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [clients, suppliers, tenderList] = await Promise.all([
          fetchClients(),
          fetchSuppliers(),
          fetchTenders()
        ]);
        setClientsCount(clients.length);
        setSuppliersCount(suppliers.length);
        setTenders(tenderList);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  const openTenders = tenders.filter(
    (t) => t.status !== "LOST" && t.status !== "WON"
  );

  const upcoming = [...openTenders]
    .filter((t) => t.submission_deadline)
    .sort(
      (a, b) =>
        dayjs(a.submission_deadline).valueOf() -
        dayjs(b.submission_deadline).valueOf()
    )
    .slice(0, 5);

  return (
    <div>
      <Title level={3}>Dashboard</Title>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Clients"
              value={clientsCount ?? "—"}
              loading={clientsCount === null}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Suppliers"
              value={suppliersCount ?? "—"}
              loading={suppliersCount === null}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Total tenders" value={tenders.length} />
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Card title="Upcoming submission deadlines">
            {upcoming.length === 0 && (
              <Text type="secondary">No upcoming deadlines.</Text>
            )}
            {upcoming.map((t) => (
              <div
                key={t.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "4px 0"
                }}
              >
                <span>
                  <strong>{t.title}</strong>{" "}
                  {t.reference_no && <Text type="secondary">({t.reference_no})</Text>}
                </span>
                <span>{t.submission_deadline && dayjs(t.submission_deadline).format("YYYY-MM-DD")}</span>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
};
