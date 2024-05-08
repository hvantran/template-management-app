
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddTaskIcon from '@mui/icons-material/AddTask';

import { Stack } from '@mui/material';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { green, red, grey } from '@mui/material/colors';
import React from 'react';
import {
  ColumnMetadata,
  DataTypeDisplayer,
  PageEntityMetadata,
  PagingOptionMetadata,
  PagingResult,
  RestClient,
  SnackbarMessage,
  SpeedDialActionMetadata,
  TableMetadata,
  WithLink
} from '../GenericConstants';
import ProcessTracking from '../common/ProcessTracking';

import { useNavigate } from 'react-router-dom';
import { TEMPLATE_BACKEND_URL, TemplateOverview, ROOT_BREADCRUMB } from '../AppConstants';

import TextTruncate from '../common/TextTruncate';
import PageEntityRender from '../renders/PageEntityRender';



export default function TemplateSummary() {
  const navigate = useNavigate();
  const [processTracking, setCircleProcessOpen] = React.useState(false);
  let initialPagingResult: PagingResult = { totalElements: 0, content: [] };
  const [pagingResult, setPagingResult] = React.useState(initialPagingResult);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);

  const restClient = new RestClient(setCircleProcessOpen);

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href='#'>
      {ROOT_BREADCRUMB}
    </Link>,
    <Typography key="3" color="text.primary">
      Summary
    </Typography>
  ];

  const columns: ColumnMetadata[] = [
    { id: 'uuid', label: 'Template ID', isHidden: true, minWidth: 100, isKeyColumn: true },
    { id: 'templateName', label: 'Name', minWidth: 100 },
    {
      id: 'templateText',
      label: 'Text',
      minWidth: 100,
      format: (value: string) => (<TextTruncate text={value} maxTextLength={100} tooltipVisiable={false} />)
    },
    {
      id: 'createdAt',
      label: 'Created at',
      minWidth: 170,
      align: 'left',
      format: DataTypeDisplayer.formatDate
    },
    {
      id: 'updatedAt',
      label: 'Updated at',
      minWidth: 170,
      align: 'left',
      format: DataTypeDisplayer.formatDate
    },
    {
      id: 'actions',
      label: '',
      minWidth: 200,
      align: 'right',
      actions: [
        {
          actionIcon: <ReadMoreIcon />,
          actionLabel: "Action details",
          actionName: "gotoActionDetail",
          onClick: (row: TemplateOverview) => {
            return () => navigate(`/templates/${row.templateName}`)
          }
        },
        {
          actionIcon: <AddTaskIcon />,
          properties: { sx: { color: green[800] } },
          actionLabel: "Add Template Task",
          actionName: "addTaskAction",
          onClick: (row: TemplateOverview) => {
            return () => {
              navigate("/tasks/new", {
                state: {
                  template: {
                    templateName: row.templateName,
                    dataTemplateJSON: row.dataTemplateJSON,
                    dsiableTemplateNameProp: true
                  }
                }
              })
            }
          }
        },
        {
          actionIcon: <FileCopyIcon />,
          properties: { sx: { color: grey[800] } },
          actionLabel: "Clone Temmplate",
          actionName: "cloneTemplate",
          onClick: (row: TemplateOverview) => {
            return () => {
              navigate("/templates/new", {
                state: {
                  template: {
                    templateName: row.templateName + "-Copy",
                    dataTemplateJSON: row.dataTemplateJSON,
                    templateContent: row.templateText
                  }
                }
              })
            }
          }
        },
        {
          actionIcon: <DeleteIcon />,
          properties: { sx: { color: red[800] } },
          actionLabel: "Delete template",
          actionName: "deleteAction",
          onClick: (row: TemplateOverview) => {
            return () => deleteTemplate(row.uuid)
          }
        }
      ]
    }
  ];


  const deleteTemplate = async (templateId: string) => {

    const requestOptions = {
      method: "DELETE",
      headers: {
        "Accept": "application/json"
      }
    }
    const targetURL = `${TEMPLATE_BACKEND_URL}/${templateId}`;
    await restClient.sendRequest(requestOptions, targetURL, () => {
      loadTemplateSummaryAsync(pagingOptions.pageIndex, pagingOptions.pageSize);
      return undefined;
    }, async (response: Response) => {
      let responseJSON = await response.json();
      return { 'message': responseJSON['message'], key: new Date().getTime() } as SnackbarMessage;
    });
  }

  const loadTemplateSummaryAsync = async (pageIndex: number, pageSize: number) => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    }

    const targetURL = `${TEMPLATE_BACKEND_URL}?pageIndex=${pageIndex}&pageSize=${pageSize}`;
    await restClient.sendRequest(requestOptions, targetURL, async (response) => {
      let templatePagingResult = await response.json() as PagingResult;
      setPagingResult(templatePagingResult);
      return { 'message': 'Load templates successfully!!', key: new Date().getTime() } as SnackbarMessage;
    }, async (response: Response) => {
      let responseJSON = await response.json();
      return { 'message': responseJSON['message'], key: new Date().getTime() } as SnackbarMessage;
    });
  }

  React.useEffect(() => {
    loadTemplateSummaryAsync(pageIndex, pageSize);
  }, [pageIndex, pageSize])

  const templates: Array<SpeedDialActionMetadata> = [
    {
      actionIcon: WithLink('/templates/new', <AddCircleOutlineIcon />), actionName: 'create', actionLabel: 'New Template', properties: {
        sx: {
          bgcolor: green[500],
          '&:hover': {
            bgcolor: green[800],
          }
        }
      }
    }
  ];

  let pagingOptions: PagingOptionMetadata = {
    pageIndex,
    pageSize,
    component: 'div',
    rowsPerPageOptions: [5, 10, 20],
    onPageChange: (pageIndex: number, pageSize: number) => {
      setPageIndex(pageIndex);
      setPageSize(pageSize);
    }
  }

  let tableMetadata: TableMetadata = {
    columns,
    pagingOptions: pagingOptions,
    pagingResult: pagingResult
  }

  let pageEntityMetadata: PageEntityMetadata = {
    pageName: 'template-summary',
    floatingActions: templates,
    tableMetadata: tableMetadata,
    breadcumbsMeta: breadcrumbs,
    pageEntityActions: [
      {
        actionIcon: <RefreshIcon />,
        actionLabel: "Refresh templates",
        actionName: "refreshAction",
        onClick: () => loadTemplateSummaryAsync(pageIndex, pageSize)
      }
    ]
  }

  return (
    <Stack spacing={2}>
      <PageEntityRender {...pageEntityMetadata}></PageEntityRender>
      <ProcessTracking isLoading={processTracking}></ProcessTracking>
    </Stack>
  );
}