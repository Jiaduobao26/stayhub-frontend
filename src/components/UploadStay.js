import React from "react";
import { Form, Input, InputNumber, Upload, Button } from "antd";
import { UpOutlined, DownOutlined, SendOutlined } from "@ant-design/icons";
import bkImg from "../assets/bk.png";
import { uploadStay } from "../utils";

const { TextArea } = Input;


class UploadStay extends React.Component {
    formRef = React.createRef();

    state = {
        loading: false,
        error: null,
        success: false,
        fileList: [],
        expanded: { details: true, photos: true },
        sectionErrors: { details: false, photos: false },
    };

    handlePublish = async () => {
        const { fileList } = this.state;

        let detailsError = false;
        let values = null;

        try {
            values = await this.formRef.current.validateFields();
        } catch {
            detailsError = true;
        }

        const photosError = fileList.length === 0;

        if (detailsError || photosError) {
            this.setState((prev) => ({
                sectionErrors: { details: detailsError, photos: photosError },
                expanded: {
                    details: detailsError ? true : prev.expanded.details,
                    photos: photosError ? true : prev.expanded.photos,
                },
            }));
            return;
        }

        const formData = new FormData();
        fileList.forEach((file) => formData.append("images", file.originFileObj));
        formData.append("name", values.name);
        formData.append("address", values.address);
        formData.append("description", values.description);
        formData.append("guest_number", values.guest_number);

        this.setState({ loading: true, error: null, success: false });
        try {
            await uploadStay(formData);
            this.setState({
                success: true,
                fileList: [],
                sectionErrors: { details: false, photos: false },
            });
            this.formRef.current.resetFields();
        } catch {
            this.setState({ error: "Upload failed, please try again." });
        } finally {
            this.setState({ loading: false });
        }
    };

    toggleSection = (key) => {
        this.setState((prev) => {
            const isOpen = prev.expanded[key];
            return {
                expanded: { ...prev.expanded, [key]: !isOpen },
                // clear error when user opens the section to fix it
                sectionErrors: isOpen
                    ? prev.sectionErrors
                    : { ...prev.sectionErrors, [key]: false },
            };
        });
    };

    handleUploadChange = ({ fileList }) => {
        this.setState((prev) => ({
            fileList: fileList.slice(0, 5),
            sectionErrors: { ...prev.sectionErrors, photos: false },
        }));
    };

    handleRemoveFile = (uid) => {
        this.setState((prev) => ({
            fileList: prev.fileList.filter((f) => f.uid !== uid),
        }));
    };

    render() {
        const { loading, error, success, fileList, expanded, sectionErrors } = this.state;

        const uploadProps = {
            multiple: true,
            maxCount: 5,
            fileList,
            beforeUpload: () => false,
            showUploadList: false,
            onChange: this.handleUploadChange,
            accept: "image/png,image/jpeg",
        };

        return (
            <div
                className="overflow-y-auto pb-24 bg-cover bg-center bg-no-repeat"
                style={{
                    height: "calc(100vh - 64px)",
                    backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.86) 42%, rgba(255,255,255,0.15) 100%), url(${bkImg})`,
                }}
            >
                {/* Title */}
                <div className="max-w-[1280px] mx-auto px-8 pt-16 pb-10">
                    <h1 className="text-5xl font-bold text-gray-900 mb-2">
                        Upload Your Stay
                    </h1>
                    <p className="text-lg text-gray-600">
                        Share your beautiful space with travelers around the world.
                    </p>
                </div>

                {/* Accordion form */}
                <Form
                    ref={this.formRef}
                    layout="vertical"
                    requiredMark={false}
                    onValuesChange={() => {
                        if (this.state.sectionErrors.details) {
                            this.setState((prev) => ({
                                sectionErrors: { ...prev.sectionErrors, details: false },
                            }));
                        }
                    }}
                >
                    <div className="max-w-[1280px] mx-auto px-8 pb-6 space-y-4">

                        {/* ① Property Details */}
                        <AccordionSection
                            number="1"
                            title="Property Details"
                            subtitle="Fill in the basic information about your property."
                            expanded={expanded.details}
                            hasError={sectionErrors.details}
                            onToggle={() => this.toggleSection("details")}
                        >
                            <FieldRow label="Property Name" hint="Give your property a clear and memorable name.">
                                <Form.Item name="name" rules={[{ required: true, message: "Required" }]} style={{ marginBottom: 0 }}>
                                    <Input size="large" placeholder="e.g. Cozy Oceanview Apartment" className="rounded-xl" />
                                </Form.Item>
                            </FieldRow>

                            <FieldRow label="Address" hint="Add the full address of your property.">
                                <Form.Item name="address" rules={[{ required: true, message: "Required" }]} style={{ marginBottom: 0 }}>
                                    <Input size="large" placeholder="e.g. 123 Ocean Drive, San Francisco, CA 94103" className="rounded-xl" />
                                </Form.Item>
                            </FieldRow>

                            <FieldRow label="Description" hint="Describe your space and highlight what makes it special.">
                                <Form.Item name="description" rules={[{ required: true, message: "Required" }]} style={{ marginBottom: 0 }}>
                                    <TextArea rows={5} maxLength={500} showCount placeholder="Tell guests what makes your stay special..." className="rounded-xl" />
                                </Form.Item>
                            </FieldRow>

                            <FieldRow label="Guest Number" hint="How many guests can stay comfortably?">
                                <Form.Item name="guest_number" rules={[{ required: true, type: "number", min: 1, message: "Required" }]} style={{ marginBottom: 0 }}>
                                    <InputNumber min={1} max={20} size="large" placeholder="e.g. 4" className="w-full rounded-xl" />
                                </Form.Item>
                            </FieldRow>
                        </AccordionSection>

                        {/* ② Photos */}
                        <AccordionSection
                            number="2"
                            title="Photos"
                            subtitle="Add high quality photos of your space."
                            expanded={expanded.photos}
                            hasError={sectionErrors.photos}
                            onToggle={() => this.toggleSection("photos")}
                        >
                            <div className="h-[180px]">
                                <Upload.Dragger
                                    {...uploadProps}
                                    style={{ borderColor: "#ff9a9d", background: "#fff7f7" }}
                                    className="rounded-2xl"
                                >
                                    <div className="text-4xl mb-3">☁️</div>
                                    <p className="text-base font-medium text-gray-800">
                                        Click or drag images here to upload
                                    </p>
                                    <p className="text-gray-500 text-sm mt-2">
                                        Support PNG and JPEG, up to 5 images, max size 10MB each.
                                    </p>
                                </Upload.Dragger>
                            </div>

                            {fileList.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="font-semibold text-gray-800 mb-3">Photo Preview</h3>
                                    <div className="grid grid-cols-5 gap-4 w-2/3">
                                        {fileList.map((file, index) => {
                                            const url =
                                                file.thumbUrl ||
                                                (file.originFileObj
                                                    ? URL.createObjectURL(file.originFileObj)
                                                    : null);
                                            return (
                                                <div
                                                    key={file.uid}
                                                    className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer group"
                                                    onClick={() => this.handleRemoveFile(file.uid)}
                                                >
                                                    {url && (
                                                        <img src={url} alt="" className="w-full h-full object-cover" />
                                                    )}
                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                                                        <span className="text-white text-xs opacity-0 group-hover:opacity-100">
                                                            Remove
                                                        </span>
                                                    </div>
                                                    {index === 0 && (
                                                        <span className="absolute left-2 bottom-2 bg-[#ff5a5f] text-white text-xs px-2 py-0.5 rounded-md">
                                                            Cover
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        {fileList.length < 5 && (
                                            <label className="aspect-square rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-3xl text-gray-400 cursor-pointer hover:border-[#ff5a5f] hover:text-[#ff5a5f] transition-colors">
                                                +
                                                <input
                                                    type="file"
                                                    accept="image/png,image/jpeg"
                                                    multiple
                                                    style={{ display: "none" }}
                                                    onChange={(e) => {
                                                        const incoming = Array.from(e.target.files).map((file) => ({
                                                            uid: `${Date.now()}-${file.name}`,
                                                            name: file.name,
                                                            status: "done",
                                                            originFileObj: file,
                                                            thumbUrl: URL.createObjectURL(file),
                                                        }));
                                                        this.setState((prev) => ({
                                                            fileList: [...prev.fileList, ...incoming].slice(0, 5),
                                                            sectionErrors: { ...prev.sectionErrors, photos: false },
                                                        }));
                                                        e.target.value = "";
                                                    }}
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 rounded-2xl bg-[#fff1f1] p-5">
                                <h3 className="text-[#ff5a5f] font-bold mb-3">Tips for great photos</h3>
                                <ul className="space-y-1.5 text-gray-600 text-sm">
                                    <li>✓ Use natural lighting and take photos during the day.</li>
                                    <li>✓ Show bedroom, kitchen, bathroom, and living room.</li>
                                    <li>✓ Clear, bright photos get more views and bookings.</li>
                                </ul>
                            </div>
                        </AccordionSection>

                    </div>
                </Form>

                {/* Sticky bottom publish bar */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-8 py-4 z-[200] flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
                    <div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        {success && <p className="text-green-600 text-sm">Stay published successfully!</p>}
                        {!error && !success && (
                            <p className="text-gray-400 text-sm">Your stay will be reviewed before it goes live.</p>
                        )}
                    </div>
                    <Button
                        type="primary"
                        size="large"
                        loading={loading}
                        onClick={this.handlePublish}
                        icon={<SendOutlined />}
                        style={{ boxShadow: "0 8px 20px rgba(255,90,95,0.28)", borderRadius: "12px", display: "inline-flex", alignItems: "center", gap: "8px" }}
                        className="h-12 px-8"
                    >
                        Publish Stay
                    </Button>
                </div>
            </div>
        );
    }
}


function AccordionSection({ number, title, subtitle, expanded, hasError, onToggle, children }) {
    return (
        <div
            className={`bg-white/85 rounded-2xl overflow-hidden transition-all duration-200 ${
                hasError
                    ? "border-2 border-rose-300 shadow-[0_0_0_4px_rgba(255,90,95,0.07)]"
                    : "border border-gray-100 shadow-sm"
            }`}
        >
            <button
                type="button"
                onClick={onToggle}
                className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${
                            hasError ? "bg-rose-400" : "bg-[#ff5a5f]"
                        }`}
                    >
                        {number}
                    </div>
                    <div className="text-left">
                        <p className="font-semibold text-gray-900">{title}</p>
                        <p className="text-sm text-gray-500">{subtitle}</p>
                    </div>
                </div>
                <span className="text-gray-400 ml-4 text-lg">
                    {expanded ? <UpOutlined /> : <DownOutlined />}
                </span>
            </button>

            {expanded && (
                <div className="px-6 pb-6 border-t border-gray-50">
                    <div className="pt-5">{children}</div>
                </div>
            )}
        </div>
    );
}


function FieldRow({ label, hint, children }) {
    return (
        <div className="grid grid-cols-[1fr_2fr] gap-8 items-start mb-6">
            <div>
                <p className="font-semibold text-gray-800 text-sm mb-0.5">
                    <span className="text-[#ff5a5f] mr-1">*</span>{label}
                </p>
                <p className="text-sm text-gray-500">{hint}</p>
            </div>
            <div>{children}</div>
        </div>
    );
}


export default UploadStay;
