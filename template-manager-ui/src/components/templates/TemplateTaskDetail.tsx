
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';

import { Stack } from '@mui/material';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import React from 'react';
import {
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
import { green } from '@mui/material/colors';
import { useParams } from 'react-router-dom';
import { TEMPLATE_BACKEND_URL } from '../AppConstants';
import SnackbarAlert from '../common/SnackbarAlert';
import PageEntityRender from '../renders/PageEntityRender';



export default function TemplateTaskDetails() {
  const targetTemplate = useParams();

  const taskId: string | undefined = targetTemplate.taskId;
  if (!taskId) {
    throw new Error("TaskId is required");
  }

  const [propertyMetadata, setPropertyMetadata] = React.useState<Array<PropertyMetadata>>([
    {
      propName: 'outputReportText',
      propLabel: 'Output content',
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
        height: "700px",
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

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href='/tasks'>
      Tasks
    </Link>,
    <Typography key="3" color="text.primary">
      {taskId}
    </Typography>
  ];

  const loadTemplateAsync = async (templateId: string) => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Accept": "text/plain"
      }
    }

    const targetURL = `${TEMPLATE_BACKEND_URL}/download/${taskId}`;
    await restClient.sendRequest(requestOptions, targetURL, async (response) => {
      let templateOutput = await response.text() as string;
      setPropertyMetadata(onChangeProperty("outputReportText", templateOutput));
      return { 'message': 'Load template report successfully!!', key: new Date().getTime() } as SnackbarMessage;
    }, async (response: Response) => {
      let responseJSON = await response.json();
      return { 'message': responseJSON['message'], key: new Date().getTime() } as SnackbarMessage;
    });
  }
  React.useEffect(() => {
    loadTemplateAsync(taskId);
  }, [])

  let pageEntityMetadata: PageEntityMetadata = {
    pageName: 'template-details',
    breadcumbsMeta: breadcrumbs,
    pageEntityActions: [
      {
        actionIcon: <ContentCopyIcon />,
        properties: { sx: { color: green[800] } },
        actionLabel: "Copy to clipboard",
        actionName: "copyToClipboard",
        onClick: ()  => {
          let outputReportText = findPropertyMetadata("outputReportText")
          navigator.clipboard.writeText(outputReportText?.propValue);
          setMessageInfo({ 'message': 'Content is copied', key: new Date().getTime() } as SnackbarMessage);
          setOpenSuccess(true)
        }
      },
      {
        actionIcon: <RefreshIcon />,
        actionLabel: "Refresh",
        actionName: "refreshAction",
        onClick: ()  => loadTemplateAsync(taskId)
      }
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