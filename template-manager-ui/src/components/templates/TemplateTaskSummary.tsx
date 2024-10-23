
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import RefreshIcon from '@mui/icons-material/Refresh';

import { Stack } from '@mui/material';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { green } from '@mui/material/colors';
import React from 'react';
import {
  ColumnMetadata,
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
import { TEMPLATE_REPORT_BACKEND_URL, TemplateReportOverview } from '../AppConstants';

import TextTruncate from '../common/TextTruncate';
import PageEntityRender from '../renders/PageEntityRender';


const pageIndexStorageKey = "template-manager-template-task-table-page-index"
const pageSizeStorageKey = "template-manager-template-task-table-page-size"
const orderByStorageKey = "template-manager-template-task-table-order"

export default function TemplateTaskSummary() {
  const navigate = useNavigate();
  const [processTracking, setCircleProcessOpen] = React.useState(false);
  let initialPagingResult: PagingResult = { totalElements: 0, content: [] };
  const [pagingResult, setPagingResult] = React.useState(initialPagingResult);
  const [pageIndex, setPageIndex] = React.useState(parseInt(LocalStorageService.getOrDefault(pageIndexStorageKey, 0)))
  const [pageSize, setPageSize] = React.useState(parseInt(LocalStorageService.getOrDefault(pageSizeStorageKey, 10)))
  const [orderBy, setOrderBy] = React.useState(LocalStorageService.getOrDefault(orderByStorageKey, '-startedAt'))

  const restClient = React.useMemo(() =>  new RestClient(setCircleProcessOpen), [setCircleProcessOpen]);

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href='#'>
      Tasks
    </Link>,
    <Typography key="3" color="text.primary">
      Summary
    </Typography>
  ];

  const columns: ColumnMetadata[] = [
    {
      id: 'uuid',
      label: 'Task ID',
      isSortable: true,
      minWidth: 100,
      isKeyColumn: true
    },
    {
      id: 'status',
      label: 'Status',
      isSortable: true,
      minWidth: 100
    },
    {
      id: 'outputReportText',
      label: 'Text',
      minWidth: 100,
      format: (value: string) => (<TextTruncate text={value} maxTextLength={100} tooltipVisiable={false} />)
    },
    {
      id: 'startedAt',
      label: 'Start time',
      isSortable: true,
      minWidth: 170,
      align: 'left',
      format: (value: number) => {

        if (!value) {
          return "";
        }

        let createdAtDate = new Date(value);
        return createdAtDate.toString();
      }
    },
    {
      id: 'endedAt',
      label: 'End time',
      minWidth: 170,
      isSortable: true,
      align: 'left',
      format: (value: number) => {

        if (!value) {
          return "";
        }

        let createdAtDate = new Date(value);
        return createdAtDate.toString();
      }
    },
    {
      id: 'elapsedTime',
      label: 'Elapsed time',
      minWidth: 170,
      isSortable: true,
      align: 'left',
      format: (value: string) => value
    },
    {
      id: 'actions',
      label: '',
      minWidth: 100,
      align: 'right',
      actions: [
        {
          actionIcon: <ReadMoreIcon />,
          actionLabel: "Go to details",
          actionName: "gotoActionDetail",
          onClick: (row: TemplateReportOverview) => {
            return () => navigate(`/tasks/${row.uuid}`)
          }
        }
      ]
    }
  ];

  const loadTemplateReportSummaryAsync = async (pageIndex: number, pageSize: number, orderBy: string) => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    }

    const targetURL = `${TEMPLATE_REPORT_BACKEND_URL}?pageIndex=${pageIndex}&pageSize=${pageSize}&orderBy=${orderBy}`;
    await restClient.sendRequest(requestOptions, targetURL, async (response) => {
      let templatePagingResult = await response.json() as PagingResult;
      setPagingResult(templatePagingResult);
      return { 'message': 'Load templates successfully!!', key: new Date().getTime() } as SnackbarMessage;
    });
  }

  React.useEffect(() => {
    loadTemplateReportSummaryAsync(pageIndex, pageSize, orderBy);
  }, [pageIndex, pageSize, orderBy, restClient])

  const templates: Array<SpeedDialActionMetadata> = [
    {
      actionIcon: WithLink('/tasks/new', <AddCircleOutlineIcon />), actionName: 'create', actionLabel: 'New Template Task', properties: {
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
    }
  }

  let tableMetadata: TableMetadata = {
    columns,
    tableContainerCssProps: {maxHeight: '100%'},
    name: 'Overview',
    onRowClickCallback: (row: TemplateReportOverview) => navigate(`/tasks/${row.uuid}`),
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
        actionLabel: "Refresh",
        actionName: "refreshAction",
        onClick: () => loadTemplateReportSummaryAsync(pageIndex, pageSize, orderBy)
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