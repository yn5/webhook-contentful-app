import React from 'react';
import {
  Select as FormaSelect,
  Option,
} from '@contentful/forma-36-react-components';

interface Item {
  label: string;
}

interface SelectProps {
  items: Item[];
  onChange: (index: number) => void;
  testId?: string;
}

function Select({ items, onChange, testId }: SelectProps) {
  return (
    <FormaSelect
      onChange={(event) => {
        const target = event.target as HTMLInputElement;
        onChange(Number(target.value));
      }}
      testId={testId}
    >
      {items.map((item, index) => (
        <Option key={String(index)} value={String(index)}>
          {item.label}
        </Option>
      ))}
    </FormaSelect>
  );
}

export default Select;
