import React, { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { Upload, Typography, List } from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";

const { Dragger } = Upload;
const { Text, Title } = Typography;

interface FileUploadProps {
  title?: string;
  description?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  title = "Attachments",
  description = "Drag & drop tender docs here or click to select files"
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const props: UploadProps = {
    multiple: true,
    fileList,
    beforeUpload: () => false, // prevent auto-upload
    onChange(info) {
      setFileList(info.fileList);
    }
  };

  return (
    <div>
      <Title level={5} style={{ marginBottom: 8 }}>
        {title}
      </Title>
      <Dragger {...props} style={{ marginBottom: 16 }}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">{description}</p>
        <p className="ant-upload-hint">
          Files are kept in the browser state for now. You can wire this
          component to a backend endpoint later.
        </p>
      </Dragger>
      {fileList.length > 0 && (
        <>
          <Text strong>Selected files:</Text>
          <List
            size="small"
            bordered
            style={{ marginTop: 8 }}
            dataSource={fileList}
            renderItem={(item) => (
              <List.Item>
                {item.name} ({Math.round((item.size ?? 0) / 1024)} KB)
              </List.Item>
            )}
          />
        </>
      )}
    </div>
  );
};
