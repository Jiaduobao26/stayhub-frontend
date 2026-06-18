import { Layout, Dropdown, Menu, Button, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React from "react";
import LoginPage from "./components/LoginPage";
import HostHomePage from "./components/HostHomePage";
import { PRIMARY_COLOR, BACKGROUND_COLOR } from "./theme";

const { Header, Content } = Layout;


class App extends React.Component {
  state = {
    authed: null,
    asHost: false,
  };


  componentDidMount() {
    const authToken = localStorage.getItem("authToken");
    const asHost = localStorage.getItem("asHost") === "true";
    this.setState({
      authed: authToken !== null,
      asHost,
    });
  }


  handleLoginSuccess = (token, asHost) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("asHost", asHost);
    this.setState({
      authed: true,
      asHost,
    });
  };


  handleLogOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("asHost");
    this.setState({
      authed: false,
      asHost: false,
    });
  };


  userMenu = (
      <Menu>
        <Menu.Item key="logout" onClick={this.handleLogOut}>
          Log Out
        </Menu.Item>
      </Menu>
  );

  render() {
    if (this.state.authed === null) {
      return (
        <div className="flex justify-center items-center h-screen">
          <Spin size="large" />
        </div>
      );
    }

    if (!this.state.authed) {
      return <LoginPage handleLoginSuccess={this.handleLoginSuccess} />;
    }

    return (
        <Layout style={{ height: "100vh", background: BACKGROUND_COLOR }}>
          <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: PRIMARY_COLOR }}>
            <div className="text-base font-semibold text-white">
              StayHub
            </div>
            <Dropdown trigger={["click"]} overlay={this.userMenu}>
              <Button icon={<UserOutlined />} shape="circle" />
            </Dropdown>
          </Header>
          <Content style={{ height: "calc(100% - 64px)", overflow: "hidden", background: BACKGROUND_COLOR }}>
            {this.state.asHost ? <HostHomePage /> : <div>guest home page</div>}
          </Content>
        </Layout>
    );
  }
}

export default App;
