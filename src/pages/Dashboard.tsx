import { Card, Col, Row, Statistic } from "antd";
import { PageHeader } from "../components/common/PageHeader";
import {
  LikeOutlined,
  FileDoneOutlined,
  FileSearchOutlined
} from "@ant-design/icons";

export function Dashboard() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Quick overview of your tendering activity."
      />
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Active tenders"
              value={7}
              prefix={<FileSearchOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Offers submitted this month"
              value={3}
              prefix={<FileDoneOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Success rate (dummy)"
              value={42}
              suffix="%"
              prefix={<LikeOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}
