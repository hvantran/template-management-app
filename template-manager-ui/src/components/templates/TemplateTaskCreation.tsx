import { json } from '@codemirror/lang-json';
import { Stack } from '@mui/material';

import LinkBreadcrumd from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { ROOT_BREADCRUMB, TEMPLATE_BACKEND_URL, TemplateReportMetadata } from '../AppConstants';
import {
  PageEntityMetadata,
  PropType,
  PropertyMetadata,
  RestClient,
  SnackbarAlertMetadata,
  SnackbarMessage,
  StepMetadata
} from '../GenericConstants';
import ProcessTracking from '../common/ProcessTracking';
import SnackbarAlert from '../common/SnackbarAlert';
import PageEntityRender from '../renders/PageEntityRender';


export default function TemplateTaskCreation() {

  const location = useLocation();
  let templateName = location.state?.template.templateName || '' ;
  let dataTemplateJSON = location.state?.template.dataTemplateJSON || '{}' ;
  let dsiableTemplateNameProp = location.state?.template.dsiableTemplateNameProp || false ;
  let initialStepsV3: Array<StepMetadata> = []
  const [openError, setOpenError] = React.useState(false);
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [messageInfo, setMessageInfo] = React.useState<SnackbarMessage | undefined>(undefined);
  const [processTracking, setCircleProcessOpen] = React.useState(false);
  const [stepMetadatas, setStepMetadatas] = React.useState(initialStepsV3);
  const restClient = new RestClient(setCircleProcessOpen, setMessageInfo, setOpenError, setOpenSuccess);

  let initialStepMetadatas: Array<StepMetadata> = [
    {
      name: "templateTaskCreation",
      label: 'Template task metadata',
      description: 'This step is used to define a template task information',
      properties: [
        {
          propName: 'templateName',
          propLabel: 'Target template name',
          propValue: templateName,
          isRequired: true,
          disabled: dsiableTemplateNameProp,
          layoutProperties: { xs: 6, alignItems: "center", justifyContent: "center" },
          labelElementProperties: { xs: 4 },
          valueElementProperties: { xs: 8 },
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
          propName: 'templateEngine',
          propLabel: 'Engine processor',
          propValue: 'freemarker',
          propDefaultValue: 'freemarker',
          layoutProperties: { xs: 6, alignItems: "center", justifyContent: "center" },
          labelElementProperties: { xs: 4, sx: { pl: 5 } },
          valueElementProperties: { xs: 8 },
          propType: PropType.Selection,
          selectionMeta: {
            selections: ["freemarker"],
            onChangeEvent: function (event) {
              let propValue = event.target.value;
              let propName = event.target.name;
              setStepMetadatas(onchangeStepDefault(propName, propValue))
            }
          }
        },
        {
          propName: 'templateData',
          propLabel: 'Template data',
          propValue: dataTemplateJSON,
          layoutProperties: { xs: 12 },
          labelElementProperties: { xs: 2 },
          valueElementProperties: { xs: 10 },
          isRequired: true,
          propType: PropType.CodeEditor,
          codeEditorMeta:
          {
            codeLanguges: [json()],
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
        let templateMetadata: TemplateReportMetadata = getTemplateMetadataFromStepper(currentStepMetadata);

        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: templateMetadata.templateData
        };

        const targetURL = `${TEMPLATE_BACKEND_URL}/${encodeURIComponent(templateMetadata.templateName)}/process-data?engine=${templateMetadata.templateEngine}`;
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
    const getTemplateMetadata = (): TemplateReportMetadata => {
      let templateMetadataMetadata = currentStepMetadata.at(0);
      if (!templateMetadataMetadata) {
        throw new Error("Missing templateMetadata definition");
      }
      
      let templateName = findStepPropertyByCondition(templateMetadataMetadata, property => property.propName.startsWith("templateName"))?.propValue;
      let templateEngine = findStepPropertyByCondition(templateMetadataMetadata, property => property.propName.startsWith("templateEngine"))?.propValue;
      let templateData = findStepPropertyByCondition(templateMetadataMetadata, property => property.propName.startsWith("templateData"))?.propValue;

      return {templateName, templateEngine, templateData}
    }

    return getTemplateMetadata();
  }

  let initialPageEntityMetdata: PageEntityMetadata = {
    pageName: 'templatReporteMetadata-creation',
    breadcumbsMeta: [
      <LinkBreadcrumd underline="hover" key="1" color="inherit" href="/tasks">
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

  function onchangeStepDefault(propName: string, propValue: any, stepMetadataCallback?: (stepMetadata: StepMetadata) => void,
    propertyCallback?: (property: PropertyMetadata) => void): React.SetStateAction<StepMetadata[]> {
    return previous => {
      return [...previous].map((stepMetadata) => {
        let properties = stepMetadata.properties.map(prop => {
          if (prop.propName === propName) {
            prop.propValue = propValue;
          }
          if (propertyCallback) {
            propertyCallback(prop);
          }
          return prop;
        });

        stepMetadata.properties = properties;
        if (stepMetadataCallback) {
          stepMetadataCallback(stepMetadata);
        }
        return stepMetadata;
      });
    };
  }
}