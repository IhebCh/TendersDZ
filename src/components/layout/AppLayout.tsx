import { Layout, Menu, Button } from "antd";
import {
  FileTextOutlined,
  TeamOutlined,
  DashboardOutlined,
  LogoutOutlined
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ReactNode } from "react";
import { getAuthToken, logout } from "../../api/client";

const { Header, Sider, Content } = Layout;

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedKey = (() => {
    if (location.pathname.startsWith("/tenders")) return "tenders";
    if (location.pathname.startsWith("/suppliers")) return "suppliers";
    return "dashboard";
  })();

  const isLogin = location.pathname.startsWith("/login");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const layoutContent = (
    <Content className="app-content">{children}</Content>
  );

  if (isLogin) {
    return <Layout style={{ minHeight: "100vh" }}>{layoutContent}</Layout>;
  }

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
          {getAuthToken() && (
            <Button
              icon={<LogoutOutlined />}
              size="small"
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </Header>
        {layoutContent}
      </Layout>
    </Layout>
  );
}
