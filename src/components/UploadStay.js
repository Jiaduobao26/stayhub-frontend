import React from "react";
import { Form, Input, InputNumber, Button, Alert, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { uploadStay } from "../utils";


const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};


class UploadStay extends React.Component {
    formRef = React.createRef();

    state = {
        loading: false,
        error: null,
        success: false,
        fileList: [],
    };


    handleSubmit = async (values) => {
        const { fileList } = this.state;

        if (fileList.length === 0) {
            this.setState({ error: "Please select at least one picture.", success: false });
            return;
        }

        if (fileList.length > 5) {
            this.setState({ error: "You can upload at most 5 pictures.", success: false });
            return;
        }

        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append("images", file.originFileObj);
        });
        formData.append("name", values.name);
        formData.append("address", values.address);
        formData.append("description", values.description);
        formData.append("guest_number", values.guest_number);

        this.setState({ loading: true, error: null, success: false });
        try {
            await uploadStay(formData);
            this.setState({ success: true, fileList: [] });
            this.formRef.current.resetFields();
        } catch (error) {
            this.setState({ error: "Upload failed, please try again." });
        } finally {
            this.setState({ loading: false });
        }
    };


    render() {
        const { loading, error, success, fileList } = this.state;

        return (
            <div className="max-w-3xl mx-auto py-8 px-4">
                <Form
                    {...layout}
                    ref={this.formRef}
                    onFinish={this.handleSubmit}
                >
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="address" label="Address" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true }]}
                    >
                        <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
                    </Form.Item>
                    <Form.Item
                        name="guest_number"
                        label="Guest Number"
                        rules={[{ required: true, type: "number", min: 1 }]}
                    >
                        <InputNumber className="w-full" />
                    </Form.Item>
                    <Form.Item label="Pictures">
                        <Upload.Dragger
                            accept="image/png,image/jpeg"
                            multiple
                            fileList={fileList}
                            beforeUpload={() => false}
                            onChange={({ fileList }) => this.setState({ fileList })}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">
                                Click or drag images here to upload
                            </p>
                            <p className="ant-upload-hint">
                                Support PNG and JPEG, up to 5 images
                            </p>
                        </Upload.Dragger>
                    </Form.Item>
                    {error && (
                        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
                            <Alert message={error} type="error" showIcon />
                        </Form.Item>
                    )}
                    {success && (
                        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
                            <Alert message="Uploaded successfully!" type="success" showIcon />
                        </Form.Item>
                    )}
                    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}


export default UploadStay;
