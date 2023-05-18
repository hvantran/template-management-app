import { json } from '@codemirror/lang-json';
import { Stack } from '@mui/material';

import { javascript } from '@codemirror/lang-javascript';
import LinkBreadcrumd from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { ROOT_BREADCRUMB, TEMPLATE_BACKEND_URL, TemplateMetadata } from '../AppConstants';
import {
  PageEntityMetadata,
  PropType,
  PropertyMetadata,
  RestClient,
  SnackbarAlertMetadata,
  SnackbarMessage,
  StepMetadata,
  onchangeStepDefault
} from '../GenericConstants';
import ProcessTracking from '../common/ProcessTracking';
import SnackbarAlert from '../common/SnackbarAlert';
import PageEntityRender from '../renders/PageEntityRender';


export default function TemplateCreation() {

  const location = useLocation();
  let templateName = location.state?.template.templateName || '' ;
  let dataTemplateJSON = location.state?.template.dataTemplateJSON || '{}' ;
  let templateText = location.state?.template.templateContent || '{}' ;
  let initialStepsV3: Array<StepMetadata> = []
  const [openError, setOpenError] = React.useState(false);
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [messageInfo, setMessageInfo] = React.useState<SnackbarMessage | undefined>(undefined);
  const [processTracking, setCircleProcessOpen] = React.useState(false);
  const [stepMetadatas, setStepMetadatas] = React.useState(initialStepsV3);
  const restClient = new RestClient(setCircleProcessOpen, setMessageInfo, setOpenError, setOpenSuccess);

  let initialStepMetadatas: Array<StepMetadata> = [
    {
      name: "templateCreation",
      label: 'Template metadata',
      description: 'This step is used to define a template information',
      properties: [
        {
          propName: 'templateName',
          propLabel: 'Template name',
          propValue: templateName,
          isRequired: true,
          layoutProperties: { xs: 12, alignItems: "center", justifyContent: "center" },
          labelElementProperties: { xs: 2 },
          valueElementProperties: { xs: 10 },
          propDescription: 'The template name',
          propType: PropType.InputText,
          textFieldMeta: {
            onChangeEvent: function (event: any) {
              let propValue = event.target.value;
              let propName = event.target.name;

              setStepMetadatas(onchangeStepDefault(propName, propValue, (stepMetadata) => {
                if (stepMetadata.name === 'templateCreation') {
                  stepMetadata.label = propValue;
                }
              }));
            }
          }
        },
        {
          propName: 'dataTemplateJSON',
          propLabel: 'Data template',
          propValue: dataTemplateJSON,
          propDefaultValue: '{}',
          layoutProperties: { xs: 12 },
          labelElementProperties: { xs: 2 },
          valueElementProperties: { xs: 10 },
          isRequired: true,
          propType: PropType.CodeEditor,
          codeEditorMeta:
          {
            height: "200px",
            codeLanguges: [json()],
            onChangeEvent: function (propName) {
              return (value, _) => {
                let propValue = value;
                setStepMetadatas(onchangeStepDefault(propName, propValue))
              }
            }
          }
        },
        {
          propName: 'templateText',
          propLabel: 'Template content',
          propValue: templateText,
          propDefaultValue: '',
          layoutProperties: { xs: 12 },
          labelElementProperties: { xs: 2 },
          valueElementProperties: { xs: 10 },
          isRequired: true,
          propType: PropType.CodeEditor,
          codeEditorMeta:
          {
            codeLanguges: [javascript({ jsx: true })],
            onChangeEvent: function (propName) {
              return (value, _) => {
                let propValue = value;
                setStepMetadatas(onchangeStepDefault(propName, propValue))
              }
            }
          }
        }
      ]
    },
    {
      name: "review",
      label: 'Review',
      description: 'This step is used to review all steps',
      properties: [],
      onFinishStepClick: async (currentStepMetadata: Array<StepMetadata>) => {
        let templateMetadata: TemplateMetadata = getTemplateMetadataFromStepper(currentStepMetadata);

        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(templateMetadata)
        };

        const targetURL = `${TEMPLATE_BACKEND_URL}`;
        await restClient.sendRequest(requestOptions, targetURL, async () => {
          let message = `Template ${templateMetadata.templateName} is created`;
          return { 'message': message, key: new Date().getTime() } as SnackbarMessage;
        }, async (response: Response) => {
          return { 'message': "An interal error occurred during your request!", key: new Date().getTime() } as SnackbarMessage;
        });
      }
    }
  ]

  React.useEffect(() => {
    setStepMetadatas(initialStepMetadatas);
  }, [])

  const getTemplateMetadataFromStepper = (currentStepMetadata: Array<StepMetadata>) => {
    const findStepPropertyByCondition = (stepMetadata: StepMetadata | undefined, filter: (property: PropertyMetadata) => boolean): PropertyMetadata | undefined => {
      return stepMetadata ? stepMetadata.properties.find(filter) : undefined;
    }
    const getTemplateMetadata = (): TemplateMetadata => {
      let templateMetadataMetadata = currentStepMetadata.at(0);
      if (!templateMetadataMetadata) {
        throw new Error("Missing templateMetadata definition");
      }
      
      let templateName = findStepPropertyByCondition(templateMetadataMetadata, property => property.propName.startsWith("templateName"))?.propValue;
      let templateText = findStepPropertyByCondition(templateMetadataMetadata, property => property.propName.startsWith("templateText"))?.propValue;
      let dataTemplateJSON = findStepPropertyByCondition(templateMetadataMetadata, property => property.propName.startsWith("dataTemplateJSON"))?.propValue;
      return {templateName, templateText, dataTemplateJSON}
    }

    return getTemplateMetadata();
  }

  let initialPageEntityMetdata: PageEntityMetadata = {
    pageName: 'templateMetadata-creation',
    breadcumbsMeta: [
      <LinkBreadcrumd underline="hover" key="1" color="inherit" href="/templates">
        {ROOT_BREADCRUMB}
      </LinkBreadcrumd>,
      <Typography key="3" color="text.primary">new</Typography>
    ],
    stepMetadatas: stepMetadatas,
    pageEntityActions: [
    ]
  }


  let snackbarAlertMetadata: SnackbarAlertMetadata = {
    openError,
    openSuccess,
    setOpenError,
    setOpenSuccess,
    messageInfo
  }

  return (
    <Stack spacing={4}>
      <PageEntityRender {...initialPageEntityMetdata} />
      <ProcessTracking isLoading={processTracking}></ProcessTracking>
      <SnackbarAlert {...snackbarAlertMetadata}></SnackbarAlert>
    </Stack>
  );
}