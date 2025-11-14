import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message
} from "antd";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import {
  createTenderItem,
  fetchClients,
  fetchTender,
  fetchTenderItems,
  updateTender,
  updateTenderItem,
  deleteTenderItem
} from "../api/client";
import type {
  Client,
  Tender,
  TenderItem,
  TenderStatus,
  TenderCategory
} from "../types";
import { FileUpload } from "../components/FileUpload";

const { Title, Text } = Typography;

const statusOptions: TenderStatus[] = [
  "IDENTIFIED",
  "BOUGHT",
  "STUDYING",
  "SUBMITTED",
  "WON",
  "LOST"
];

const categoryOptions: TenderCategory[] = ["HW", "SW", "SPARE", "SERVICE"];

export const TenderDetailsPage: React.FC = () => {
  const params = useParams();
  const tenderId = Number(params.id);
  const [tender, setTender] = useState<Tender | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [items, setItems] = useState<TenderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingTender, setSavingTender] = useState(false);
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<TenderItem | null>(null);
  const [tenderForm] = Form.useForm<any>();
  const [itemForm] = Form.useForm<any>();

  const load = async () => {
    setLoading(true);
    try {
      const [tenderData, clientList, itemList] = await Promise.all([
        fetchTender(tenderId),
        fetchClients(),
        fetchTenderItems(tenderId)
      ]);
      setTender(tenderData);
      setClients(clientList);
      setItems(itemList.filter((i) => i.tender_id === tenderId));
      tenderForm.setFieldsValue({
        ...tenderData,
        submission_deadline: tenderData.submission_deadline
          ? dayjs(tenderData.submission_deadline)
          : null
      });
    } catch (e) {
      console.error(e);
      message.error("Failed to load tender details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!Number.isNaN(tenderId)) {
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenderId]);

  const clientById = useMemo(
    () =>
      new Map<number, Client>(clients.map((c) => [c.id, c])),
    [clients]
  );

  const handleSaveTender = async () => {
    if (!tender) return;
    try {
      const values = await tenderForm.validateFields();
      setSavingTender(true);
      await updateTender(tender.id, {
        client_id: values.client_id,
        title: values.title,
        reference_no: values.reference_no ?? null,
        currency: values.currency,
        status: values.status,
        submission_deadline: values.submission_deadline
          ? values.submission_deadline.toISOString()
          : null
      });
      message.success("Tender updated");
      await load();
    } catch (e: any) {
      if (!e?.errorFields) {
        console.error(e);
        message.error("Failed to update tender");
      }
    } finally {
      setSavingTender(false);
    }
  };

  const openNewItem = () => {
    setEditingItem(null);
    itemForm.resetFields();
    itemForm.setFieldsValue({
      category: "HW",
      uom: "Unit",
      authenticity_required: true
    });
    setItemModalVisible(true);
  };

  const openEditItem = (item: TenderItem) => {
    setEditingItem(item);
    itemForm.setFieldsValue(item);
    setItemModalVisible(true);
  };

  const handleSaveItem = async () => {
    try {
      const values = await itemForm.validateFields();
      const payload = {
        tender_id: tenderId,
        category: values.category,
        description: values.description,
        qty: Number(values.qty),
        uom: values.uom,
        authenticity_required: values.authenticity_required
      };
      if (editingItem) {
        await updateTenderItem(editingItem.id, payload);
        message.success("Item updated");
      } else {
        await createTenderItem(payload as any);
        message.success("Item created");
      }
      setItemModalVisible(false);
      await load();
    } catch (e: any) {
      if (!e?.errorFields) {
        console.error(e);
        message.error("Failed to save item");
      }
    }
  };

  const handleDeleteItem = async (item: TenderItem) => {
    Modal.confirm({
      title: "Delete item",
      content: `Are you sure you want to delete this item?`,
      onOk: async () => {
        try {
          await deleteTenderItem(item.id);
          message.success("Item deleted");
          await load();
        } catch (e) {
          console.error(e);
          message.error("Failed to delete item");
        }
      }
    });
  };

  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      render: (c: TenderCategory) => <Tag>{c}</Tag>
    },
    {
      title: "Description",
      dataIndex: "description"
    },
    {
      title: "Qty",
      dataIndex: "qty"
    },
    {
      title: "UOM",
      dataIndex: "uom"
    },
    {
      title: "Authenticity",
      dataIndex: "authenticity_required",
      render: (val: boolean) =>
        val ? <Tag color="green">Original</Tag> : <Tag>Compatible</Tag>
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: TenderItem) => (
        <Space>
          <Button size="small" onClick={() => openEditItem(record)}>
            Edit
          </Button>
          <Button
            danger
            size="small"
            onClick={() => handleDeleteItem(record)}
          >
            Delete
          </Button>
        </Space>
      )
    }
  ];

  if (Number.isNaN(tenderId)) {
    return <Text>Invalid tender id</Text>;
  }

  return (
    <div>
      <Title level={3}>Tender details</Title>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <Card loading={loading} title="Header">
          {tender && (
            <Form layout="vertical" form={tenderForm}>
              <Form.Item
                label="Client"
                name="client_id"
                rules={[{ required: true, message: "Please select a client" }]}
              >
                <Select
                  showSearch
                  placeholder="Select client"
                  optionFilterProp="label"
                  options={clients.map((c) => ({
                    label: c.name,
                    value: c.id
                  }))}
                />
              </Form.Item>
              <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true, message: "Please input the title" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Reference" name="reference_no">
                <Input />
              </Form.Item>
              <Form.Item
                label="Currency"
                name="currency"
                rules={[{ required: true, message: "Please input the currency" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: "Please select the status" }]}
              >
                <Select
                  options={statusOptions.map((s) => ({ label: s, value: s }))}
                />
              </Form.Item>
              <Form.Item label="Submission deadline" name="submission_deadline">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
              <Button
                type="primary"
                onClick={handleSaveTender}
                loading={savingTender}
              >
                Save header
              </Button>
            </Form>
          )}
        </Card>

        <Card
          loading={loading}
          title="Items"
          extra={
            <Button type="primary" onClick={openNewItem}>
              Add item
            </Button>
          }
        >
          <Table<TenderItem>
            rowKey="id"
            dataSource={items}
            columns={columns as any}
            pagination={false}
          />
        </Card>

        <Card title="Documents">
          <FileUpload />
        </Card>
      </Space>

      <Modal
        title={editingItem ? "Edit item" : "New item"}
        open={itemModalVisible}
        onCancel={() => setItemModalVisible(false)}
        onOk={handleSaveItem}
        destroyOnClose
      >
        <Form layout="vertical" form={itemForm}>
          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select
              options={categoryOptions.map((c) => ({ label: c, value: c }))}
            />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please input a description" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            label="Quantity"
            name="qty"
            rules={[{ required: true, message: "Please input the quantity" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="UOM"
            name="uom"
            rules={[{ required: true, message: "Please input the unit" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Authenticity required"
            name="authenticity_required"
            rules={[
              { required: true, message: "Please select authenticity requirement" }
            ]}
          >
            <Select
              options={[
                { label: "Original required", value: true },
                { label: "Compatible accepted", value: false }
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
