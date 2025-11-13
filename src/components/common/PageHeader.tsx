import { ReactNode } from "react";
import { Breadcrumb, Space, Typography } from "antd";
import { HomeOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  breadcrumbItems?: { label: string; path?: string }[];
}

export function PageHeader({
  title,
  subtitle,
  action,
  breadcrumbItems
}: PageHeaderProps) {
  return (
    <Space direction="vertical" style={{ width: "100%", marginBottom: 16 }}>
      <Space
        align="center"
        style={{ width: "100%", justifyContent: "space-between" }}
      >
        <div>
          {breadcrumbItems && breadcrumbItems.length > 0 && (
            <Breadcrumb
              style={{ marginBottom: 4 }}
              items={[
                {
                  title: <HomeOutlined />
                },
                ...breadcrumbItems.map((b) => ({
                  title: b.label
                }))
              ]}
            />
          )}
          <Title level={3} className="app-header-title">
            {title}
          </Title>
          {subtitle && (
            <Text className="app-header-subtitle">{subtitle}</Text>
          )}
        </div>
        {action && <div>{action}</div>}
      </Space>
    </Space>
  );
}
