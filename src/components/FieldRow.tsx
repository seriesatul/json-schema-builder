// src/components/FieldRow.tsx
import React from 'react';
import { useFormContext, useFieldArray, Controller, useWatch } from 'react-hook-form';
import { Input, Select, Button, Space } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { FieldType } from '../actions/types.action';
import type { SchemaField } from '../actions/types.action';

interface FieldRowProps {
  nestingLevel: number;
  path: string;
  index: number;
  onRemove: (index: number) => void;
}

const FieldRow: React.FC<FieldRowProps> = ({ nestingLevel, path, index, onRemove }) => {
  const { control } = useFormContext();

  
  const currentFieldType = useWatch({
    control,
    name: `${path}.type`,
  });

  // useFieldArray for nested children
  const { fields: childFields, append: appendChild, remove: removeChild } = useFieldArray({
    control,
    name: `${path}.children`,
  });

  const fieldOptions: { value: FieldType; label: string }[] = [
    { value: 'String', label: 'String' },
    { value: 'Number', label: 'Number' },
    { value: 'Float', label: 'Float' },
    { value: 'Date', label: 'Date' },
    { value: 'Object', label: 'Object' },
    { value: 'Nested', label: 'Nested' },
  ];

  return (
    <div style={{ marginLeft: nestingLevel * 24, marginBottom: 16 }}>
     
      <Space align="baseline">
        <Controller
          name={`${path}.keyName`}
          control={control}
          rules={{ required: 'Key is required' }}
          render={({ field, fieldState }) => (
            <>
              <Input {...field} placeholder="Field Name / Key" style={{ width: 200 }} status={fieldState.error ? 'error' : ''} />
            </>
          )}
        />
        <Controller
          name={`${path}.type`}
          control={control}
          render={({ field }) => (
            <Select {...field} options={fieldOptions} style={{ width: 120 }} />
          )}
        />
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          onClick={() => onRemove(index)}
        />
      </Space>

      
      {currentFieldType === 'Nested' && (
        <div style={{ marginTop: 16, paddingLeft: 24, borderLeft: '1px solid #e8e8e8' }}>
          {childFields.map((field, childIndex) => (
            <FieldRow
              key={field.id}
              nestingLevel={nestingLevel + 1}
              path={`${path}.children.${childIndex}`}
              index={childIndex}
              onRemove={removeChild}
            />
          ))}
          <Button
            type="dashed"
            onClick={() => appendChild({ keyName: '', type: 'String' } as SchemaField)}
            icon={<PlusOutlined />}
          >
            Add Nested Field
          </Button>
        </div>
      )}
    </div>
  );
};

export default FieldRow;