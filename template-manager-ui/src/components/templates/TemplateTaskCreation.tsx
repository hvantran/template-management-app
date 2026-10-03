import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  WizardCreationTemplate,
  StepMetadata,
  PropertyMetadata,
  PropType,
} from '@hvantran/ui-component-library';
import { TEMPLATE_BACKEND_URL, TemplateReportMetadata } from '../AppConstants';
import { RestClient } from '../GenericConstants';

export default function TemplateTaskCreation() {
  const location = useLocation();
  const navigate = useNavigate();

  const templateName = location.state?.template?.templateName || '';
  const dataTemplateJSON = location.state?.template?.dataTemplateJSON || '{}';
  const dsiableTemplateNameProp = location.state?.template?.dsiableTemplateNameProp || false;

  const [activeStep, setActiveStep] = useState(0);
  const [processTracking, setCircleProcessOpen] = useState(false);
  const restClient = useMemo(() => new RestClient(setCircleProcessOpen), [setCircleProcessOpen]);

  const [steps, setSteps] = useState<StepMetadata[]>([
    {
      name: 'templateTaskCreation',
      label: 'Template task metadata',
      description: 'Define template task information and data payload',
      properties: [
        {
          propName: 'templateName',
          propLabel: 'Target template name',
          propValue: templateName,
          isRequired: true,
          disabled: dsiableTemplateNameProp,
          colSpan: 6,
          propDescription: 'The template name',
          propType: PropType.InputText,
        },
        {
          propName: 'templateEngine',
          propLabel: 'Engine processor',
          propValue: 'freemarker',
          propDefaultValue: 'freemarker',
          colSpan: 6,
          propType: PropType.Selection,
          selectionMeta: {
            selections: [{ label: 'freemarker', value: 'freemarker' }],
          },
        },
        {
          propName: 'templateData',
          propLabel: 'Template data',
          propValue: dataTemplateJSON,
          colSpan: 12,
          isRequired: true,
          propType: PropType.CodeEditor,
          codeEditorMeta: {
            height: '250px',
            codeLanguages: ['json'],
          },
        },
      ],
    },
    {
      name: 'review',
      label: 'Review',
      description: 'Review details and submit task execution',
      properties: [],
    },
  ]);

  const handlePropertyChange = (stepIndex: number, propName: string, value: any) => {
    setSteps((prevSteps) =>
      prevSteps.map((step, idx) => {
        if (idx !== stepIndex) return step;
        return {
          ...step,
          properties: step.properties.map((prop) =>
            prop.propName === propName ? { ...prop, propValue: value } : prop
          ),
        };
      })
    );
  };

  const handleFinish = async (currentSteps: StepMetadata[]) => {
    const firstStep = currentSteps[0];
    const findProp = (name: string) =>
      firstStep?.properties.find((p: PropertyMetadata) => p.propName === name)?.propValue;

    const taskMetadata: TemplateReportMetadata = {
      templateName: findProp('templateName'),
      templateEngine: findProp('templateEngine') || 'freemarker',
      templateData: findProp('templateData'),
    };

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: taskMetadata.templateData,
    };

    const targetURL = `${TEMPLATE_BACKEND_URL}/${encodeURIComponent(taskMetadata.templateName)}/process-data?engine=${taskMetadata.templateEngine}`;
    await restClient.sendRequest(requestOptions, targetURL, async (response) => {
      const responseJSON = await response.json();
      navigate(`/tasks/${responseJSON.reportId}`);
      return undefined;
    });
  };

  const breadcrumbs = [
    { label: 'Tasks', href: '/tasks' },
    { label: 'New' },
  ];

  return (
    <WizardCreationTemplate
      pageTitle="Create Template Task"
      breadcrumbs={breadcrumbs}
      steps={steps}
      activeStep={activeStep}
      onStepChange={setActiveStep}
      onFinish={handleFinish}
      onPropertyChange={handlePropertyChange}
      onCancel={() => navigate('/tasks')}
      loading={processTracking}
    />
  );
}