import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  TemplateTaskDetailTemplate,
  PropertyMetadata,
  PropType,
  GenericActionMetadata,
} from '@hvantran/ui-component-library';
import { Copy, RefreshCw } from 'lucide-react';
import { TEMPLATE_BACKEND_URL } from '../AppConstants';
import { RestClient, SnackbarMessage } from '../GenericConstants';

export default function TemplateTaskDetails() {
  const { taskId } = useParams<{ taskId: string }>();

  if (!taskId) {
    throw new Error('TaskId is required');
  }

  const [processTracking, setCircleProcessOpen] = useState(false);
  const restClient = useMemo(() => new RestClient(setCircleProcessOpen), [setCircleProcessOpen]);

  const [properties, setProperties] = useState<PropertyMetadata[]>([
    {
      propName: 'outputReportText',
      propLabel: 'Output content',
      propValue: '',
      propDefaultValue: '',
      disabled: true,
      colSpan: 12,
      isRequired: true,
      propType: PropType.CodeEditor,
      codeEditorMeta: {
        height: '700px',
        codeLanguages: ['javascript'],
      },
    },
  ]);

  const loadTemplateAsync = async (id: string) => {
    const requestOptions = {
      method: 'GET',
      headers: {
        Accept: 'text/plain',
      },
    };

    const targetURL = `${TEMPLATE_BACKEND_URL}/download/${id}`;
    await restClient.sendRequest(requestOptions, targetURL, async (response) => {
      const templateOutput = (await response.text()) as string;
      setProperties((prev) =>
        prev.map((p) => (p.propName === 'outputReportText' ? { ...p, propValue: templateOutput } : p))
      );
      return { message: 'Load template report successfully!!', key: new Date().getTime() } as SnackbarMessage;
    });
  };

  useEffect(() => {
    loadTemplateAsync(taskId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  const breadcrumbs = [
    { label: 'Tasks', href: '/tasks' },
    { label: taskId },
  ];

  const headerActions: GenericActionMetadata[] = [
    {
      actionIcon: <Copy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      actionLabel: 'Copy to clipboard',
      actionName: 'copyToClipboard',
      onClick: () => {
        const outputReportText = properties.find((p) => p.propName === 'outputReportText')?.propValue;
        if (outputReportText) {
          navigator.clipboard.writeText(outputReportText);
        }
      },
    },
    {
      actionIcon: <RefreshCw className="w-4 h-4" />,
      actionLabel: 'Refresh',
      actionName: 'refreshAction',
      onClick: () => loadTemplateAsync(taskId),
    },
  ];

  return (
    <TemplateTaskDetailTemplate
      pageTitle={`Task ${taskId}`}
      breadcrumbs={breadcrumbs}
      headerActions={headerActions}
      properties={properties}
      onPropertyChange={(name, val) =>
        setProperties((prev) => prev.map((p) => (p.propName === name ? { ...p, propValue: val } : p)))
      }
      disabled={processTracking}
    />
  );
}