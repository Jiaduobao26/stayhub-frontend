import { Tabs, List, Card, Image, Carousel, Alert, Button, Modal } from "antd";
import { LeftCircleFilled, RightCircleFilled, InfoCircleOutlined } from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import React from "react";
import { deleteStay, getStaysByHost } from "../utils";
import UploadStay from "./UploadStay";


const { TabPane } = Tabs;

class ViewReservationsButton extends React.Component {
    state = {
        modalVisible: false,
    };


    openModal = () => {
        this.setState({
            modalVisible: true,
        });
    };


    handleCancel = () => {
        this.setState({
            modalVisible: false,
        });
    };


    render() {
        const { stay } = this.props;
        const { modalVisible } = this.state;


        const modalTitle = `Reservations of ${stay.name}`;
        return (
            <>
                <Button onClick={this.openModal} shape="round">
                    View Reservations
                </Button>
                {modalVisible && (
                    <Modal
                        title={modalTitle}
                        centered={true}
                        visible={modalVisible}
                        closable={false}
                        footer={null}
                        onCancel={this.handleCancel}
                        destroyOnClose={true}
                    >
                        test
                    </Modal>
                )}
            </>
        );
    }
}

class RemoveStayButton extends React.Component {
    state = {
        loading: false,
        error: null,
    };

    handleRemoveStay = async () => {
        const { stay, onRemoveSuccess } = this.props;
        this.setState({ loading: true, error: null });

        try {
            await deleteStay(stay.id);
            onRemoveSuccess();
        } catch (error) {
            this.setState({ error: error.message });
        } finally {
            this.setState({ loading: false });
        }
    };

    render() {
        const { loading, error } = this.state;
        return (
            <>
                {error && <Alert message={error} type="error" showIcon />}
                <Button
                    loading={loading}
                    onClick={this.handleRemoveStay}
                    danger={true}
                    shape="round"
                    type="primary"
                >
                    Remove Stay
                </Button>
            </>
        );
    }
}


export class StayDetailInfoButton extends React.Component {
    state = {
        modalVisible: false,
    };


    openModal = () => {
        this.setState({
            modalVisible: true,
        });
    };


    handleCancel = () => {

        this.setState({
            modalVisible: false,
        });
    };

    render() {
        const { stay } = this.props;
        const { name, description, address, guestNumber } = stay;
        const { modalVisible } = this.state;
        return (
            <>
                <Button
                    onClick={this.openModal}
                    style={{ border: "none" }}
                    size="large"
                    icon={<InfoCircleOutlined />}
                />
                {modalVisible && (
                    <Modal
                        title={name}
                        centered={true}
                        visible={modalVisible}
                        closable={false}
                        footer={null}
                        onCancel={this.handleCancel}
                    >
                        test
                    </Modal>
                )}
            </>
        );
    }
}


class MyStays extends React.Component {
    state = {
        loading: false,
        data: [],
        error: null,
    };

    componentDidMount() {
        this.loadData();
    }

    loadData = async () => {
        this.setState({ loading: true, error: null });
        try {
            const resp = await getStaysByHost();
            this.setState({ data: resp });
        } catch (error) {
            this.setState({ error: "Failed to load stays. Please try again." });
        } finally {
            this.setState({ loading: false });
        }
    };

    render() {
        const { loading, data, error } = this.state;

        if (error) {
            return <Alert message={error} type="error" showIcon />;
        }

        return (
            <List
                loading={loading}
                grid={{ gutter: 16, xs: 1, sm: 3, md: 3, lg: 3, xl: 4, xxl: 4 }}
                dataSource={data}
                renderItem={(item) => (
                    <List.Item>
                        <Card
                            key={item.id}
                            title={
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <Text ellipsis style={{ maxWidth: 150 }}>
                                        {item.name}
                                    </Text>
                                    <StayDetailInfoButton stay={item} />
                                </div>
                            }
                            actions={[<ViewReservationsButton stay={item} />]}
                            extra={
                                <RemoveStayButton stay={item} onRemoveSuccess={this.loadData} />
                            }
                        >
                            <Carousel
                                dots={false}
                                arrows
                                prevArrow={<LeftCircleFilled />}
                                nextArrow={<RightCircleFilled />}
                            >
                                {item.images.map((image, index) => (
                                    <div key={index}>
                                        <Image src={image} width="100%" />
                                    </div>
                                ))}
                            </Carousel>
                        </Card>
                    </List.Item>
                )}
            />
        );
    }
}


class HostHomePage extends React.Component {
    render() {
        return (
            <Tabs defaultActiveKey="1" destroyInactiveTabPane tabPosition="left">
                <TabPane tab="My Stays" key="1">
                    <div
                        className="overflow-y-auto px-6 py-6"
                        style={{ height: "calc(100vh - 64px)" }}
                    >
                        <MyStays />
                    </div>
                </TabPane>
                <TabPane tab="Upload Stay" key="2" style={{ paddingLeft: 0 }}>
                    <UploadStay />
                </TabPane>
            </Tabs>
        );
    }
}


export default HostHomePage;
