export type FieldType = 
  | 'String' 
  | 'Number' 
  | 'Float' 
  | 'Date'
  | 'Object'
  | 'Nested';

export interface SchemaField {
  id: string; 
  keyName: string;
  type: FieldType;
  children?: SchemaField[];
}