import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  TemplateDetailTemplate,
  PropertyMetadata,
  PropType,
  GenericActionMetadata,
} from '@hvantran/ui-component-library';
import { RefreshCw, Edit2, Save, PlusCircle, Copy } from 'lucide-react';
import { ROOT_BREADCRUMB, TEMPLATE_BACKEND_URL, TemplateMetadata, TemplateOverview } from '../AppConstants';
import { RestClient, SnackbarMessage } from '../GenericConstants';

export default function TemplateDetails() {
  const navigate = useNavigate();
  const { templateName } = useParams<{ templateName: string }>();

  if (!templateName) {
    throw new Error('Template is required');
  }

  const [isEditing, setIsEditing] = useState(false);
  const [processTracking, setCircleProcessOpen] = useState(false);
  const restClient = useMemo(() => new RestClient(setCircleProcessOpen), [setCircleProcessOpen]);

  const [properties, setProperties] = useState<PropertyMetadata[]>([
    {
      propName: 'templateName',
      propLabel: 'Template name',
      propValue: '',
      isRequired: true,
      disabled: true,
      colSpan: 12,
      propDescription: 'The template name',
      propType: PropType.InputText,
    },
    {
      propName: 'dataTemplateJSON',
      propLabel: 'Data template',
      propValue: '',
      disabled: true,
      propDefaultValue: '',
      isRequired: true,
      colSpan: 12,
      propType: PropType.CodeEditor,
      codeEditorMeta: {
        height: '200px',
        codeLanguages: ['json'],
      },
    },
    {
      propName: 'templateText',
      propLabel: 'Template content',
      propValue: '',
      propDefaultValue: '',
      disabled: true,
      isRequired: true,
      colSpan: 12,
      propType: PropType.CodeEditor,
      codeEditorMeta: {
        height: '350px',
        codeLanguages: ['javascript'],
      },
    },
  ]);

  const enableEditFunction = (isEnabled: boolean) => {
    setIsEditing(isEnabled);
    setProperties((previous) =>
      previous.map((p) => {
        if (p.propName !== 'templateName') {
          return { ...p, disabled: !isEnabled };
        }
        return p;
      })
    );
  };

  const handlePropertyChange = (propName: string, value: any) => {
    setProperties((previous) =>
      previous.map((p) => (p.propName === propName ? { ...p, propValue: value } : p))
    );
  };

  const loadTemplateAsync = async (name: string) => {
    const requestOptions = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    };

    const targetURL = `${TEMPLATE_BACKEND_URL}/${name}`;
    await restClient.sendRequest(requestOptions, targetURL, async (response) => {
      const templateOverviews = (await response.json()) as Array<TemplateOverview>;
      if (templateOverviews && templateOverviews.length > 0) {
        const item = templateOverviews[0];
        setProperties((prev) =>
          prev.map((p) => {
            const val = item[p.propName as keyof TemplateOverview];
            return val !== undefined ? { ...p, propValue: val } : p;
          })
        );
      }
      return { message: 'Load template successfully!!', key: new Date().getTime() } as SnackbarMessage;
    });
  };

  const putTemplateAsync = async () => {
    const tName = properties.find((p) => p.propName === 'templateName')?.propValue;
    const tText = properties.find((p) => p.propName === 'templateText')?.propValue;
    const dJSON = properties.find((p) => p.propName === 'dataTemplateJSON')?.propValue;

    const templateMetadata: TemplateMetadata = {
      templateName: tName,
      templateText: tText,
      dataTemplateJSON: dJSON,
    };

    const requestOptions = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(templateMetadata),
    };

    const targetURL = `${TEMPLATE_BACKEND_URL}`;
    await restClient.sendRequest(requestOptions, targetURL, async (response) => {
      const responseJSON = await response.json();
      enableEditFunction(false);
      return { message: `${responseJSON.uuid} is updated`, key: new Date().getTime() } as SnackbarMessage;
    });
  };

  useEffect(() => {
    loadTemplateAsync(templateName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateName]);

  const breadcrumbs = [
    { label: ROOT_BREADCRUMB, href: '/templates' },
    { label: templateName },
  ];

  const headerActions: GenericActionMetadata[] = [
    {
      actionIcon: <RefreshCw className="w-4 h-4" />,
      actionLabel: 'Refresh',
      actionName: 'refreshAction',
      onClick: () => loadTemplateAsync(templateName),
    },
    {
      actionIcon: <Edit2 className="w-4 h-4" />,
      actionLabel: 'Edit',
      actionName: 'editAction',
      disabled: isEditing,
      onClick: () => enableEditFunction(true),
    },
    {
      actionIcon: <Save className="w-4 h-4" />,
      actionLabel: 'Save',
      actionName: 'saveAction',
      disabled: !isEditing,
      onClick: () => putTemplateAsync(),
    },
    {
      actionIcon: <PlusCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      actionLabel: 'Add Template Task',
      actionName: 'addTaskAction',
      onClick: () => {
        const dataTemplateProperty = properties.find((p) => p.propName === 'dataTemplateJSON');
        navigate('/tasks/new', {
          state: {
            template: {
              templateName,
              dataTemplateJSON: dataTemplateProperty?.propValue,
              dsiableTemplateNameProp: true,
            },
          },
        });
      },
    },
    {
      actionIcon: <Copy className="w-4 h-4" />,
      actionLabel: 'Clone Template',
      actionName: 'cloneTemplate',
      onClick: () => {
        const dataTemplateProperty = properties.find((p) => p.propName === 'dataTemplateJSON');
        const templateContentProperty = properties.find((p) => p.propName === 'templateText');

        navigate('/templates/new', {
          state: {
            template: {
              templateName: `${templateName}-Copy`,
              dataTemplateJSON: dataTemplateProperty?.propValue,
              templateContent: templateContentProperty?.propValue,
            },
          },
        });
      },
    },
  ];

  return (
    <TemplateDetailTemplate
      pageTitle={templateName}
      breadcrumbs={breadcrumbs}
      headerActions={headerActions}
      properties={properties}
      onPropertyChange={handlePropertyChange}
      disabled={processTracking}
    />
  );
}