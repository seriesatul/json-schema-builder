// src/components/SchemaBuilder.tsx

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import FieldRow from './FieldRow';
import type { SchemaField } from '../actions/types.action';

const SchemaBuilder = () => {
  const { control } = useFormContext(); 
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'schema', 
  });

  return (
    <div>
      {fields.map((field, index) => (
        <FieldRow
          key={field.id}
          nestingLevel={0}
          path={`schema.${index}`}
          index={index}
          onRemove={remove}
        />
      ))}
      <Button
        type="primary"
        onClick={() => append({ keyName: '', type: 'String' } as SchemaField)}
        icon={<PlusOutlined />}
      >
        Add Field
      </Button>
    </div>
  );
};

export default SchemaBuilder;