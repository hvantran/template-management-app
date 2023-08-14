
import RefreshIcon from '@mui/icons-material/Refresh';

import { Stack } from '@mui/material';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import React from 'react';
import {
  GenericActionMetadata,
  PageEntityMetadata,
  PropType,
  PropertyMetadata,
  RestClient,
  SnackbarAlertMetadata,
  SnackbarMessage,
  onChangeProperty
} from '../GenericConstants';
import ProcessTracking from '../common/ProcessTracking';

import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import AddTaskIcon from '@mui/icons-material/AddTask';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { useNavigate, useParams } from 'react-router-dom';
import { ROOT_BREADCRUMB, TEMPLATE_BACKEND_URL, TemplateMetadata, TemplateOverview } from '../AppConstants';
import SnackbarAlert from '../common/SnackbarAlert';
import PageEntityRender from '../renders/PageEntityRender';
import { green, grey } from '@mui/material/colors';



export default function TemplateDetails() {
  const navigate = useNavigate();
  const targetTemplate = useParams();

  const templateName: string | undefined = targetTemplate.templateName;
  if (!templateName) {
    throw new Error("Template is required");
  }


  const enableEditFunction = function(isEnabled: boolean) {

    setEditActionMeta(previous => {
      previous.disable = isEnabled;
      return previous;
    })
    setSaveActionMeta(previous => {
      previous.disable = !isEnabled;
      return previous;
    });
    setPropertyMetadata(previous => {
      return [...previous].map(p => {
        if (p.propName !== "templateName") {
          p.disabled = !isEnabled;
        }
        return p;
      })
    })
  }

  const [propertyMetadata, setPropertyMetadata] = React.useState<Array<PropertyMetadata>>([
    {
      propName: 'templateName',
      propLabel: 'Template name',
      propValue: '',
      isRequired: true,
      disabled: true,
      layoutProperties: { xs: 12, alignItems: "center", justifyContent: "center" },
      labelElementProperties: { xs: 2,  sx: { pl: 10 } },
      valueElementProperties: { xs: 10 },
      propDescription: 'The template name',
      propType: PropType.InputText,
      textFieldMeta: {
        onChangeEvent: function (event: any) {
          let propValue = event.target.value;
          let propName = event.target.name;

          setPropertyMetadata(onChangeProperty(propName, propValue));
        }
      }
    },
    {
      propName: 'dataTemplateJSON',
      propLabel: 'Data template',
      propValue: '',
      disabled: true,
      propDefaultValue: '',
      layoutProperties: { xs: 12 },
      labelElementProperties: { xs: 2,  sx: { pl: 10 } },
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
            setPropertyMetadata(onChangeProperty(propName, propValue))
          }
        }
      }
    },
    {
      propName: 'templateText',
      propLabel: 'Template content',
      propValue: '',
      propDefaultValue: '',
      disabled: true,
      layoutProperties: { xs: 12 },
      labelElementProperties: { xs: 2,  sx: { pl: 10 } },
      valueElementProperties: { xs: 10 },
      isRequired: true,
      propType: PropType.CodeEditor,
      codeEditorMeta:
      {
        codeLanguges: [javascript({ jsx: true })],
        onChangeEvent: function (propName) {
          return (value, _) => {
            let propValue = value;
            setPropertyMetadata(onChangeProperty(propName, propValue))
          }
        }
      }
    }]);
  const [processTracking, setCircleProcessOpen] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [messageInfo, setMessageInfo] = React.useState<SnackbarMessage | undefined>(undefined);
  const restClient = new RestClient(setCircleProcessOpen, setMessageInfo, setOpenError, setOpenSuccess);
  const [saveActionMeta, setSaveActionMeta] = React.useState<GenericActionMetadata>(
    {
      actionIcon: <SaveIcon />,
      actionLabel: "Save",
      actionName: "saveAction",
      disable: true,
      onClick: ()  => {
        putTemplateAsync();
      }
    });
  const [editActionMeta, setEditActionMeta] = React.useState<GenericActionMetadata>(
    {
      actionIcon: <EditIcon />,
      actionLabel: "Edit",
      actionName: "editAction",
      onClick: ()  => enableEditFunction(true)
    });
  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href='/templates'>
      {ROOT_BREADCRUMB}
    </Link>,
    <Typography key="3" color="text.primary">
      {templateName}
    </Typography>
  ];

  const loadTemplateAsync = async (templateId: string) => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    }

    const targetURL = `${TEMPLATE_BACKEND_URL}/${templateName}`;
    await restClient.sendRequest(requestOptions, targetURL, async (response) => {
      let templateOverviews: Array<TemplateOverview> = await response.json() as Array<TemplateOverview>;
      Object.keys(templateOverviews[0]).forEach((propertyName: string) => {
        setPropertyMetadata(onChangeProperty(propertyName, templateOverviews[0][propertyName as keyof TemplateOverview]));
      })
      return { 'message': 'Load template successfully!!', key: new Date().getTime() } as SnackbarMessage;
    }, async (response: Response) => {
      let responseJSON = await response.json();
      return { 'message': responseJSON['message'], key: new Date().getTime() } as SnackbarMessage;
    });
  }

  const putTemplateAsync = async () => {

    let templateName = propertyMetadata.find(p => p.propName === "templateName")?.propValue;
    let templateText = propertyMetadata.find(p => p.propName === "templateText")?.propValue;
    let dataTemplateJSON = propertyMetadata.find(p => p.propName === "dataTemplateJSON")?.propValue;
    let templateMetadata: TemplateMetadata = {
      templateName,
      templateText,
      dataTemplateJSON
    }
    const requestOptions = {
      method: "PUT",
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json"
      },
      body: JSON.stringify(templateMetadata)
    }

    const targetURL = `${TEMPLATE_BACKEND_URL}`;
    await restClient.sendRequest(requestOptions, targetURL, async(response) => {
      let responseJSON = await response.json();
      enableEditFunction(false);
      return { 'message': `${responseJSON['uuid']} is updated`, key: new Date().getTime() } as SnackbarMessage;
    }, async (response: Response) => {
      let responseJSON = await response.json();
      return { 'message': responseJSON['message'], key: new Date().getTime() } as SnackbarMessage;
    });
  }

  React.useEffect(() => {
    loadTemplateAsync(templateName);
  }, [])

  let pageEntityMetadata: PageEntityMetadata = {
    pageName: 'template-details',
    breadcumbsMeta: breadcrumbs,
    pageEntityActions: [
      {
        actionIcon: <RefreshIcon />,
        actionLabel: "Refresh",
        actionName: "refreshAction",
        onClick: ()  => loadTemplateAsync(templateName)
      },
      editActionMeta,
      saveActionMeta,
      {
        actionIcon: <AddTaskIcon />,
        properties: { sx: { color: green[800] } },
        actionLabel: "Add Template Task",
        actionName: "addTaskAction",
        onClick: ()  => {
          let dataTemplateProperty = findPropertyMetadata("dataTemplateJSON");
          navigate("/tasks/new", {state: {template: {templateName, dataTemplateJSON: dataTemplateProperty?.propValue, dsiableTemplateNameProp: true}}})
        }
      },
      {
        actionIcon: <FileCopyIcon />,
        properties: { sx: { color: grey[800] } },
        actionLabel: "Clone Temmplate",
        actionName: "cloneTemplate",
        onClick: ()  => {
          let dataTemplateProperty = findPropertyMetadata("dataTemplateJSON");
          let templateContentProperty = findPropertyMetadata("templateText");

          navigate("/templates/new", {state: {template: {
            templateName: templateName + "-Copy", 
            dataTemplateJSON: dataTemplateProperty?.propValue, 
            templateContent: templateContentProperty?.propValue
          }}})
        }
      },
      
    ],
    properties: propertyMetadata
  }

  function findPropertyMetadata(propName: string):PropertyMetadata | undefined {
    return propertyMetadata.find(p => p.propName === propName);
  }

  let snackbarAlertMetadata: SnackbarAlertMetadata = {
    openError,
    openSuccess,
    setOpenError,
    setOpenSuccess,
    messageInfo
  }

  return (
    <Stack spacing={2}>
      <PageEntityRender {...pageEntityMetadata}></PageEntityRender>
      <ProcessTracking isLoading={processTracking}></ProcessTracking>
      <SnackbarAlert {...snackbarAlertMetadata}></SnackbarAlert>
    </Stack>
  );
}