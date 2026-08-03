// components/email/StructuredDataGrid.tsx
import { ConfidenceBar } from '../ui/ConfidenceBar';
import { Card, CardContent } from '../ui/Card';

interface StructuredDataGridProps {
  structuredData: any;
}

// Component to flatten and render data as field: value pairs
const FieldValueRenderer = ({ data, fieldKey, confidence }: { data: any; fieldKey: string; confidence?: number }) => {
  const formatKey = (key: string) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'Not specified';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'object') {
      // For objects, try to extract meaningful values
      if (value.value !== undefined) return String(value.value);
      if (value.name !== undefined) return String(value.name);
      if (value.text !== undefined) return String(value.text);
      return 'Complex data';
    }
    return String(value);
  };

  // Handle arrays by joining values
  const renderArray = (arr: any[], title: string) => {
    if (arr.length === 0) return null;
    
    const displayValue = arr
      .map(item => {
        if (typeof item === 'object') {
          return item.name || item.value || item.text || 'Item';
        }
        return String(item);
      })
      .join(', ');

    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100">
        <span className="font-medium text-gray-700 text-sm mb-1 sm:mb-0 sm:w-1/3">
          {formatKey(title)}
        </span>
        <div className="flex items-center justify-between sm:justify-end sm:w-2/3 gap-4">
          <span className="text-gray-900 text-sm flex-1">{displayValue}</span>
          {confidence !== undefined && (
            <div className="flex items-center gap-2 w-20">
              <ConfidenceBar confidence={confidence} showLabel={false} size="sm" />
              <span className="text-xs text-gray-600 font-medium whitespace-nowrap">
                {Math.round(confidence * 100)}%
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Handle simple objects by flattening
  const renderObject = (obj: any, title: string) => {
    const entries = Object.entries(obj);
    if (entries.length === 0) return null;

    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
          <h4 className="font-medium text-gray-900 text-sm">{formatKey(title)}</h4>
        </div>
        <div className="divide-y divide-gray-100">
          {entries.map(([key, value]: [string, any]) => (
            <FieldValueRenderer
              key={key}
              data={value}
              fieldKey={key}
              confidence={value?.confidence}
            />
          ))}
        </div>
      </div>
    );
  };

  // Handle primitive values
  const renderPrimitive = (value: any, title: string, conf?: number) => {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100">
        <span className="font-medium text-gray-700 text-sm mb-1 sm:mb-0 sm:w-1/3">
          {formatKey(title)}
        </span>
        <div className="flex items-center justify-between sm:justify-end sm:w-2/3 gap-4">
          <span className="text-gray-900 text-sm flex-1">{formatValue(value)}</span>
        
        </div>
      </div>
    );
  };

  // Main render logic
  if (data === null || data === undefined) {
    return renderPrimitive(data, fieldKey, confidence);
  }

  if (Array.isArray(data)) {
    return renderArray(data, fieldKey);
  }

  if (typeof data === 'object') {
    // Check if it's a simple value object (like {value: "something", confidence: 0.95})
    if (data.value !== undefined && Object.keys(data).length <= 2) {
      return renderPrimitive(data.value, fieldKey, data.confidence || confidence);
    }
    
    // Check if it's a simple key-value pair object
    const isSimpleObject = Object.values(data).every(val => 
      typeof val === 'string' || 
      typeof val === 'number' || 
      typeof val === 'boolean' ||
      val === null ||
      (typeof val === 'object' && val !== null && 'value' in val)
    );

    if (isSimpleObject) {
      return renderObject(data, fieldKey);
    }

    // For complex nested objects, render as a section
    return renderObject(data, fieldKey);
  }

  // Primitive value
  return renderPrimitive(data, fieldKey, confidence);
};

export const StructuredDataGrid1 = ({ structuredData }: StructuredDataGridProps) => {
  if (!structuredData || Object.keys(structuredData).length === 0) {
    return (
      <Card>
        <CardContent className="py-4">
          <p className="text-gray-500 text-center">No structured data extracted</p>
        </CardContent>
      </Card>
    );
  }

  // Filter out confidence at root level and handle common structures
  const { confidence: rootConfidence, ...dataToRender } = structuredData;

  // Flatten common AI response structures
  const flattenData = (data: any) => {
    if (data.extracted_data) return data.extracted_data;
    if (data.entities) return data.entities;
    if (data.fields) return data.fields;
    return data;
  };

  const flattenedData = flattenData(dataToRender);

  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {Object.entries(flattenedData).map(([key, value]: [string, any]) => (
            <FieldValueRenderer
              key={key}
              data={value}
              fieldKey={key}
              confidence={value?.confidence}
            />
          ))}
        </div>
        
        {/* Root level confidence */}

      </CardContent>
    </Card>
  );
};