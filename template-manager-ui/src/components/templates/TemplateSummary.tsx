
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddTaskIcon from '@mui/icons-material/AddTask';
import DeleteIcon from '@mui/icons-material/Delete';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import RefreshIcon from '@mui/icons-material/Refresh';

import { Stack } from '@mui/material';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { green, red } from '@mui/material/colors';
import React from 'react';
import {
  ColumnMetadata,
  DataTypeDisplayer,
  DialogMetadata,
  LocalStorageService,
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
import { ROOT_BREADCRUMB, TEMPLATE_BACKEND_URL, TemplateOverview } from '../AppConstants';

import ConfirmationDialog from '../common/ConfirmationDialog';
import TextTruncate from '../common/TextTruncate';
import PageEntityRender from '../renders/PageEntityRender';



const pageIndexStorageKey = "template-manager-template-table-page-index"
const pageSizeStorageKey = "template-manager-template-table-page-size"
const orderByStorageKey = "template-manager-template-table-order"

export default function TemplateSummary() {
  const navigate = useNavigate();
  const [processTracking, setCircleProcessOpen] = React.useState(false);
  let initialPagingResult: PagingResult = { totalElements: 0, content: [] };
  const [pagingResult, setPagingResult] = React.useState(initialPagingResult);
  const [pageIndex, setPageIndex] = React.useState(parseInt(LocalStorageService.getOrDefault(pageIndexStorageKey, 0)))
  const [pageSize, setPageSize] = React.useState(parseInt(LocalStorageService.getOrDefault(pageSizeStorageKey, 10)))
  const [orderBy, setOrderBy] = React.useState(LocalStorageService.getOrDefault(orderByStorageKey, '-updatedAt'));

  const restClient = React.useMemo(() =>  new RestClient(setCircleProcessOpen), [setCircleProcessOpen]);
  const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = React.useState(false);
  const [confirmationDialogContent, setConfirmationDialogContent] = React.useState(<p></p>);
  const [confirmationDialogTitle, setConfirmationDialogTitle] = React.useState("");
  const [confirmationDialogPositiveAction, setConfirmationDialogPositiveAction] = React.useState(() => () => { });

  let confirmationDeleteDialogMeta: DialogMetadata = {
    open: deleteConfirmationDialogOpen,
    title: confirmationDialogTitle,
    content: confirmationDialogContent,
    positiveText: "Yes",
    negativeText: "No",
    negativeAction() {
      setDeleteConfirmationDialogOpen(false);
    },
    positiveAction: confirmationDialogPositiveAction
  }
  
  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href='#'>
      {ROOT_BREADCRUMB}
    </Link>,
    <Typography key="3" color="text.primary">
      Summary
    </Typography>
  ];

  const columns: ColumnMetadata[] = [
    { 
      id: 'uuid', 
      label: 'Template ID', 
      isHidden: true, 
      minWidth: 100, 
      isKeyColumn: true },
    { 
      id: 'templateName', 
      label: 'Name', 
      isSortable: true,
      minWidth: 100 
    },
    {
      id: 'templateText',
      label: 'Text',
      minWidth: 100,
      format: (value: string) => (<TextTruncate text={value} maxTextLength={100} tooltipVisiable={false} />)
    },
    {
      id: 'createdAt',
      label: 'Created at',
      isSortable: true,
      minWidth: 170,
      align: 'left',
      format: DataTypeDisplayer.formatDate
    },
    {
      id: 'updatedAt',
      label: 'Updated at',
      isSortable: true,
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
          actionIcon: <FileCopyIcon />,
          actionLabel: "Clone",
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
          actionIcon: <AddTaskIcon />,
          properties: { sx: { color: green[800] } },
          actionLabel: "Add Task",
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
          actionIcon: <DeleteIcon />,
          properties: { sx: { color: red[800] } },
          actionLabel: "Delete",
          actionName: "deleteAction",
          onClick: (row: TemplateOverview) => () => {
            setConfirmationDialogTitle("Delete")
            setConfirmationDialogContent(previous => <p>Are you sure you want to delete <b>{row.templateName}</b> template?</p>)
            setConfirmationDialogPositiveAction(previous => () => {
              deleteTemplate(row.uuid)
              setDeleteConfirmationDialogOpen(previous => !previous)
            })
            setDeleteConfirmationDialogOpen(previous => !previous)
          }
        },
        {
          actionIcon: <ReadMoreIcon />,
          actionLabel: "Action details",
          actionName: "gotoActionDetail",
          onClick: (row: TemplateOverview) => {
            return () => navigate(`/templates/${row.templateName}`)
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
      loadTemplateSummaryAsync(pagingOptions.pageIndex, pagingOptions.pageSize, orderBy);
      return undefined;
    });
  }

  const loadTemplateSummaryAsync = async (pageIndex: number, pageSize: number, orderBy: string) => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    }

    const targetURL = `${TEMPLATE_BACKEND_URL}?pageIndex=${pageIndex}&pageSize=${pageSize}&orderBy=${orderBy}`;
    await restClient.sendRequest(requestOptions, targetURL, async (response) => {
      let templatePagingResult = await response.json() as PagingResult;
      setPagingResult(templatePagingResult);
      return { 'message': 'Load templates successfully!!', key: new Date().getTime() } as SnackbarMessage;
    });
  }

  React.useEffect(() => {
    loadTemplateSummaryAsync(pageIndex, pageSize, orderBy);
  }, [pageIndex, pageSize, orderBy, restClient])

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
    orderBy,
    component: 'div',
    rowsPerPageOptions: [5, 10, 20],
    onPageChange: (pageIndex: number, pageSize: number, orderBy: string) => {
      setPageIndex(pageIndex);
      setPageSize(pageSize);
      setOrderBy(orderBy);
      LocalStorageService.put(pageIndexStorageKey, pageIndex)
      LocalStorageService.put(pageSizeStorageKey, pageSize)
      LocalStorageService.put(orderByStorageKey, orderBy)
      loadTemplateSummaryAsync(pageIndex, pageSize, orderBy);
    }
  }

  let tableMetadata: TableMetadata = {
    columns,
    name: 'Overview',
    pagingOptions: pagingOptions,
    onRowClickCallback: (row: TemplateOverview) => navigate(`/templates/${row.templateName}`),
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
        onClick: () => loadTemplateSummaryAsync(pageIndex, pageSize, orderBy)
      }
    ]
  }

  return (
    <Stack spacing={2}>
      <PageEntityRender {...pageEntityMetadata}></PageEntityRender>
      <ProcessTracking isLoading={processTracking}></ProcessTracking>
      <ConfirmationDialog {...confirmationDeleteDialogMeta}></ConfirmationDialog>
    </Stack>
  );
}