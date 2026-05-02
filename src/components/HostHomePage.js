import { Tabs, List, Card, Image, Carousel, Alert } from "antd";
import { LeftCircleFilled, RightCircleFilled } from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import React from "react";
import { getStaysByHost } from "../utils";
import UploadStay from "./UploadStay";


const { TabPane } = Tabs;


export class StayDetailInfoButton extends React.Component {
    render() {
        return <></>;
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
                grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 3,
                    md: 3,
                    lg: 3,
                    xl: 4,
                    xxl: 4,
                }}
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
            <Tabs defaultActiveKey="1" destroyInactiveTabPane>
                <TabPane tab="My Stays" key="1">
                    <MyStays />
                </TabPane>
                <TabPane tab="Upload Stay" key="2">
                    <UploadStay />
                </TabPane>
            </Tabs>
        );
    }
}


export default HostHomePage;
