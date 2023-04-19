
import RefreshIcon from '@mui/icons-material/Refresh';

import { Stack } from '@mui/material';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import React from 'react';
import {
  ActionMetadata,
  GenericActionMetadata,
  PageEntityMetadata,
  PropType,
  PropertyMetadata,
  RestClient,
  SnackbarAlertMetadata,
  SnackbarMessage
} from '../GenericConstants';
import ProcessTracking from '../common/ProcessTracking';

import { javascript } from '@codemirror/lang-javascript';
import { useNavigate, useParams } from 'react-router-dom';
import { ROOT_BREADCRUMB, TEMPLATE_BACKEND_URL, TemplateMetadata, TemplateOverview } from '../AppConstants';
import SnackbarAlert from '../common/SnackbarAlert';
import PageEntityRender from '../renders/PageEntityRender';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';



export default function TemplateDetails() {
  const navigate = useNavigate();
  const targetTemplate = useParams();

  const templateName: string | undefined = targetTemplate.templateName;
  if (!templateName) {
    throw new Error("Template is required");
  }

  const [propertyMetadata, setPropertyMetadata] = React.useState<Array<PropertyMetadata>>([
    {
      propName: 'templateName',
      propLabel: 'Template name',
      propValue: '',
      isRequired: true,
      disabled: true,
      layoutProperties: { xs: 12, alignItems: "center", justifyContent: "center" },
      labelElementProperties: { xs: 2 },
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
      propName: 'templateText',
      propLabel: 'Template content',
      propValue: '',
      propDefaultValue: '',
      disabled: true,
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
      onClick: () => () => {
        putTemplateAsync();
      }
    });

  const [editActionMeta, setEditActionMeta] = React.useState<GenericActionMetadata>(
    {
      actionIcon: <EditIcon />,
      actionLabel: "Edit",
      actionName: "editAction",
      onClick: () => () => {
        setEditActionMeta(previous => {
          previous.disable = true;
          return previous;
        })
        setSaveActionMeta(previous => {
          previous.disable = false;
          return previous;
        });
        setPropertyMetadata(previous => {
          return [...previous].map(p => {
            if (p.propName !== "templateName") {
              p.disabled = false;
            }
            return p;
          })
        })
      }
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
    let templateMetadata: TemplateMetadata = {
      templateName,
      templateText
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
    await restClient.sendRequest(requestOptions, targetURL, () => {
      navigate("/templates")
      return undefined;
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
        onClick: () => () => loadTemplateAsync(templateName)
      },
      editActionMeta,
      saveActionMeta
    ],
    properties: propertyMetadata
  }

  function onChangeProperty(propName: string, propValue: any): React.SetStateAction<PropertyMetadata[]> {
    return previous => {
      return [...previous].map((prop) => {
        if (prop.propName === propName) {
          prop.propValue = propValue;
        }
        return prop;
      });
    };
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