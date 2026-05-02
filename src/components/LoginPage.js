import React from "react";
import { Form, Button, Input, Checkbox, Alert, Tabs } from "antd";
import { UserOutlined, LockOutlined, HomeOutlined } from "@ant-design/icons";
import { login, register } from "../utils";
import { PRIMARY_COLOR, PRIMARY_GRADIENT } from "../theme";

const { TabPane } = Tabs;

class LoginPage extends React.Component {
    loginFormRef = React.createRef();
    registerFormRef = React.createRef();

    state = {
        asHost: false,
        loading: false,
        activeTab: "login",
        registerSuccess: false,
        registerError: null,
        loginError: null,
    };

    handleTabChange = (key) => {
        this.setState({
            activeTab: key,
            loginError: null,
            registerError: null,
            registerSuccess: false,
        });
        if (key === "login" && this.registerFormRef.current) {
            this.registerFormRef.current.resetFields();
        } else if (key === "register" && this.loginFormRef.current) {
            this.loginFormRef.current.resetFields();
        }
    };

    handleLogin = async () => {
        this.setState({ loading: true, loginError: null });
        try {
            const resp = await login(this.loginFormRef.current.getFieldsValue(true));
            this.props.handleLoginSuccess(resp.token, this.state.asHost);
        } catch (error) {
            this.setState({ loginError: "Incorrect username or password." });
        } finally {
            this.setState({ loading: false });
        }
    };

    handleRegister = async () => {
        this.setState({ loading: true, registerError: null, registerSuccess: false });
        const values = this.registerFormRef.current.getFieldsValue(true);
        try {
            await register({
                username: values.username,
                password: values.password,
                role: this.state.asHost ? "ROLE_HOST" : "ROLE_GUEST",
            });
        } catch (error) {
            this.setState({ registerError: "Registration failed. The username may already be taken.", loading: false });
            return;
        }
        this.setState({ registerSuccess: true });
        await new Promise((resolve) => setTimeout(resolve, 3000));
        try {
            const resp = await login({ username: values.username, password: values.password });
            this.props.handleLoginSuccess(resp.token, this.state.asHost);
        } catch (error) {
            this.setState({ registerSuccess: false, registerError: "Registered successfully but failed to log in automatically. Please log in manually.", loading: false });
        }
    };

    render() {
        const { loading, asHost, activeTab, registerSuccess, registerError, loginError } = this.state;

        const hostCheckbox = (
            <Form.Item className="mb-0">
                <Checkbox
                    disabled={loading}
                    checked={asHost}
                    onChange={(e) => this.setState({ asHost: e.target.checked })}
                >
                    I am a Host
                </Checkbox>
            </Form.Item>
        );

        return (
            <div className="flex h-screen overflow-hidden">
                {/* Left panel */}
                <div
                    className="hidden md:flex w-[45%] shrink-0 flex-col justify-center items-center px-12 py-16 text-white"
                    style={{ background: PRIMARY_GRADIENT }}
                >
                    <HomeOutlined className="text-6xl mb-6" />
                    <h1 className="text-5xl font-bold text-white text-center mb-4">
                        StayHub
                    </h1>
                    <p className="text-lg text-white/80 text-center leading-relaxed max-w-xs">
                        Find your perfect stay, or share your space with the world.
                    </p>
                </div>

                {/* Right panel */}
                <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
                    <div className="w-full max-w-sm bg-white rounded-2xl px-10 py-8 shadow-xl">
                        <Tabs
                            activeKey={activeTab}
                            onChange={this.handleTabChange}
                            centered
                        >
                            <TabPane tab="Log In" key="login" disabled={loading}>
                                <Form ref={this.loginFormRef} layout="vertical" className="mt-4" onFinish={this.handleLogin}>
                                    <Form.Item
                                        name="username"
                                        rules={[{ required: true, message: "Please enter your username" }]}
                                    >
                                        <Input
                                            disabled={loading}
                                            prefix={<UserOutlined className="text-gray-300" />}
                                            placeholder="Username"
                                            size="large"
                                            className="rounded-lg"
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="password"
                                        rules={[{ required: true, message: "Please enter your password" }]}
                                    >
                                        <Input.Password
                                            disabled={loading}
                                            prefix={<LockOutlined className="text-gray-300" />}
                                            placeholder="Password"
                                            size="large"
                                            className="rounded-lg"
                                        />
                                    </Form.Item>
                                    {hostCheckbox}
                                    {loginError && (
                                        <Alert
                                            message={loginError}
                                            type="error"
                                            showIcon
                                            className="mt-4"
                                        />
                                    )}
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        size="large"
                                        block
                                        loading={loading}
                                        className="mt-6 h-12 rounded-lg font-semibold text-[15px]"
                                        style={{ background: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}
                                    >
                                        Log In
                                    </Button>
                                </Form>
                            </TabPane>

                            <TabPane tab="Register" key="register" disabled={loading}>
                                <Form ref={this.registerFormRef} layout="vertical" className="mt-4" onFinish={this.handleRegister}>
                                    <Form.Item
                                        name="username"
                                        rules={[{ required: true, message: "Please enter your username" }]}
                                    >
                                        <Input
                                            disabled={loading}
                                            prefix={<UserOutlined className="text-gray-300" />}
                                            placeholder="Username"
                                            size="large"
                                            className="rounded-lg"
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="password"
                                        rules={[{ required: true, message: "Please enter your password" }]}
                                    >
                                        <Input.Password
                                            disabled={loading}
                                            prefix={<LockOutlined className="text-gray-300" />}
                                            placeholder="Password"
                                            size="large"
                                            className="rounded-lg"
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="confirmPassword"
                                        dependencies={["password"]}
                                        rules={[
                                            { required: true, message: "Please confirm your password" },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue("password") === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error("Passwords do not match"));
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password
                                            disabled={loading}
                                            prefix={<LockOutlined className="text-gray-300" />}
                                            placeholder="Confirm Password"
                                            size="large"
                                            className="rounded-lg"
                                        />
                                    </Form.Item>
                                    {hostCheckbox}
                                    {registerSuccess && (
                                        <Alert
                                            message="Registered successfully! Logging you in..."
                                            type="success"
                                            showIcon
                                            className="mt-4"
                                        />
                                    )}
                                    {registerError && (
                                        <Alert
                                            message={registerError}
                                            type="error"
                                            showIcon
                                            className="mt-4"
                                        />
                                    )}
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        size="large"
                                        block
                                        loading={loading}
                                        className="mt-6 h-12 rounded-lg font-semibold text-[15px]"
                                        style={{ background: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}
                                    >
                                        Create Account
                                    </Button>
                                </Form>
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoginPage;
