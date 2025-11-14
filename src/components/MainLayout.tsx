import React from "react";
import { Layout, Menu, theme, Typography } from "antd";
import {
  AppstoreOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, userEmail } = useAuth();
  const {
    token: { colorBgContainer }
  } = theme.useToken();

  const selectedKey = React.useMemo(() => {
    if (location.pathname.startsWith("/clients")) return "clients";
    if (location.pathname.startsWith("/suppliers")) return "suppliers";
    if (location.pathname.startsWith("/tenders")) return "tenders";
    return "dashboard";
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          style={{
            height: 48,
            margin: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 600,
            fontSize: 18
          }}
        >
          {collapsed ? "TDZ" : "TendersDZ"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={[
            {
              key: "dashboard",
              icon: <AppstoreOutlined />,
              label: <Link to="/">Dashboard</Link>
            },
            {
              key: "clients",
              icon: <TeamOutlined />,
              label: <Link to="/clients">Clients</Link>
            },
            {
              key: "suppliers",
              icon: <UserOutlined />,
              label: <Link to="/suppliers">Suppliers</Link>
            },
            {
              key: "tenders",
              icon: <ShoppingCartOutlined />,
              label: <Link to="/tenders">Tenders</Link>
            },
            {
              key: "logout",
              icon: <LogoutOutlined />,
              label: <span onClick={handleLogout}>Logout</span>
            }
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0 16px",
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            Tender management
          </Title>
          {userEmail && (
            <span style={{ fontSize: 14, color: "#555" }}>{userEmail}</span>
          )}
        </Header>
        <Content style={{ margin: "16px" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: 8
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
