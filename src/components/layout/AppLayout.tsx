import { Layout, Menu } from "antd";
import {
  FileTextOutlined,
  TeamOutlined,
  DashboardOutlined
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { ReactNode } from "react";

const { Header, Sider, Content } = Layout;

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();

  const selectedKey = (() => {
    if (location.pathname.startsWith("/tenders")) return "tenders";
    if (location.pathname.startsWith("/suppliers")) return "suppliers";
    return "dashboard";
  })();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <span className="app-logo">TendersDZ</span>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={[
            {
              key: "dashboard",
              icon: <DashboardOutlined />,
              label: <Link to="/">Dashboard</Link>
            },
            {
              key: "tenders",
              icon: <FileTextOutlined />,
              label: <Link to="/tenders">Tenders</Link>
            },
            {
              key: "suppliers",
              icon: <TeamOutlined />,
              label: <Link to="/suppliers">Suppliers</Link>
            }
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0 24px",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #e5e7eb"
          }}
        >
          <span style={{ fontWeight: 500 }}>Tender Management MVP</span>
        </Header>
        <Content className="app-content">{children}</Content>
      </Layout>
    </Layout>
  );
}
