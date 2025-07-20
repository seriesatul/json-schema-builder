// src/App.tsx
import React from 'react';
import { useForm, FormProvider, useWatch, useFormContext } from 'react-hook-form';
import { Tabs, Layout, Typography, Card } from 'antd';
import SchemaBuilder from './components/SchemaBuilder';
import type { SchemaField } from './actions/types.action';
import './App.css';

const { Header, Content } = Layout;
const { Title } = Typography;

// This interface defines the shape of our entire form state
interface FormValues {
  schema: SchemaField[];
}

// Helper function to recursively generate the final JSON object
const generateJsonFromSchema = (fields: SchemaField[]): Record<string, any> => {
  const result: Record<string, any> = {};

  fields.forEach((field) => {
    if (field.keyName) {
      
      switch (field.type) {
        case 'String':
          result[field.keyName] = "String";
          break;
        case 'Number': 
          result[field.keyName] = "number";
          break;
        case 'Float': 
          result[field.keyName] = "float";
          break;
        case 'Date':
          result[field.keyName] = new Date().toISOString();
          break;
        case 'Object': 
          result[field.keyName] = {};
          break;
        case 'Nested':
          result[field.keyName] = generateJsonFromSchema(field.children || []);
          break;
        default:
          break;
      }
      
    }
  });

  return result;
};



const JsonPreview = () => {
  const { control } = useFormContext<FormValues>();
  const formSchema = useWatch({ control, name: 'schema' });
  const generatedJson = generateJsonFromSchema(formSchema || []);

  return (
    <Card bordered={false}>
      <pre>{JSON.stringify(generatedJson, null, 2)}</pre>
    </Card>
  );
};


function App() {
  // Initialize react-hook-form
  const methods = useForm<FormValues>({
    defaultValues: {
      schema: [], // Start with an empty schema
    },
  });

  const tabItems = [
    {
      key: '1',
      label: 'Schema Builder',
      children: <SchemaBuilder />,
    },
    {
      key: '2',
      label: 'JSON Preview',
      children: <JsonPreview />,
    },
  ];

  return (
    // FormProvider makes the form methods available to all nested components
    <FormProvider {...methods}>
      <Layout className="layout">
        <Header>
          <Title level={3} style={{ color: 'white', lineHeight: '20px' }}>
            React JSON Schema Builder
          </Title>
        </Header>
        <Content style={{ padding: '24px 50px' }}>
          <div className="site-layout-content">
            <Tabs defaultActiveKey="1" items={tabItems} />
          </div>
        </Content>
      </Layout>
    </FormProvider>
  );
}

export default App;