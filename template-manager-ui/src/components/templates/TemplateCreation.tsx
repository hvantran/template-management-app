import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  WizardCreationTemplate,
  StepMetadata,
  PropertyMetadata,
  PropType,
} from '@hvantran/ui-component-library';
import { ROOT_BREADCRUMB, TEMPLATE_BACKEND_URL, TemplateMetadata } from '../AppConstants';
import { RestClient, SnackbarMessage } from '../GenericConstants';

export default function TemplateCreation() {
  const location = useLocation();
  const navigate = useNavigate();

  const initialTemplateName = location.state?.template?.templateName || '';
  const initialDataTemplateJSON = location.state?.template?.dataTemplateJSON || '{}';
  const initialTemplateText = location.state?.template?.templateContent || '';

  const [activeStep, setActiveStep] = useState(0);
  const [processTracking, setCircleProcessOpen] = useState(false);
  const restClient = useMemo(() => new RestClient(setCircleProcessOpen), [setCircleProcessOpen]);

  const [steps, setSteps] = useState<StepMetadata[]>([
    {
      name: 'templateCreation',
      label: 'Template metadata',
      description: 'Define template information and content',
      properties: [
        {
          propName: 'templateName',
          propLabel: 'Template name',
          propValue: initialTemplateName,
          isRequired: true,
          colSpan: 12,
          propDescription: 'The template name',
          propType: PropType.InputText,
        },
        {
          propName: 'dataTemplateJSON',
          propLabel: 'Data template',
          propValue: initialDataTemplateJSON,
          propDefaultValue: '{}',
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
          propValue: initialTemplateText,
          propDefaultValue: '',
          isRequired: true,
          colSpan: 12,
          propType: PropType.CodeEditor,
          codeEditorMeta: {
            height: '350px',
            codeLanguages: ['javascript'],
          },
        },
      ],
    },
    {
      name: 'review',
      label: 'Review',
      description: 'Review details and submit',
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

    const templateMetadata: TemplateMetadata = {
      templateName: findProp('templateName'),
      templateText: findProp('templateText'),
      dataTemplateJSON: findProp('dataTemplateJSON'),
    };

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(templateMetadata),
    };

    const targetURL = `${TEMPLATE_BACKEND_URL}`;
    await restClient.sendRequest(requestOptions, targetURL, async () => {
      navigate('/templates');
      return {
        message: `Template ${templateMetadata.templateName} is created`,
        key: new Date().getTime(),
      } as SnackbarMessage;
    });
  };

  const breadcrumbs = [
    { label: ROOT_BREADCRUMB, href: '/templates' },
    { label: 'New' },
  ];

  return (
    <WizardCreationTemplate
      pageTitle="Create Template"
      breadcrumbs={breadcrumbs}
      steps={steps}
      activeStep={activeStep}
      onStepChange={setActiveStep}
      onFinish={handleFinish}
      onPropertyChange={handlePropertyChange}
      onCancel={() => navigate('/templates')}
      loading={processTracking}
    />
  );
}