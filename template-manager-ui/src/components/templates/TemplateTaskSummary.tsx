import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  EntitySummaryTemplate,
  TextTruncate,
  ColumnMetadata,
  GenericActionMetadata,
  SpeedDialActionMetadata,
  PagingResult,
} from '@hvantran/ui-component-library';
import { Eye, PlusCircle, RefreshCw } from 'lucide-react';
import {
  DataTypeDisplayer,
  LocalStorageService,
  RestClient,
  SnackbarMessage,
} from '../GenericConstants';
import { TEMPLATE_REPORT_BACKEND_URL, TemplateReportOverview } from '../AppConstants';

const pageIndexStorageKey = 'template-manager-template-task-table-page-index';
const pageSizeStorageKey = 'template-manager-template-task-table-page-size';
const orderByStorageKey = 'template-manager-template-task-table-order';

export default function TemplateTaskSummary() {
  const navigate = useNavigate();
  const [processTracking, setCircleProcessOpen] = useState(false);
  const initialPagingResult: PagingResult<TemplateReportOverview> = { totalElements: 0, content: [] };
  const [pagingResult, setPagingResult] = useState<PagingResult<TemplateReportOverview>>(initialPagingResult);

  const [searchText, setSearchText] = useState('');
  const [pageIndex, setPageIndex] = useState(parseInt(LocalStorageService.getOrDefault(pageIndexStorageKey, 0), 10));
  const [pageSize, setPageSize] = useState(parseInt(LocalStorageService.getOrDefault(pageSizeStorageKey, 10), 10));
  const [orderBy, setOrderBy] = useState(LocalStorageService.getOrDefault(orderByStorageKey, '-startedAt'));

  const restClient = useMemo(() => new RestClient(setCircleProcessOpen), [setCircleProcessOpen]);

  const breadcrumbs = [
    { label: 'Tasks', href: '#' },
    { label: 'Summary' },
  ];

  const loadTemplateReportSummaryAsync = async (pIndex: number, pSize: number, pOrderBy: string) => {
    const requestOptions = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    };

    const targetURL = `${TEMPLATE_REPORT_BACKEND_URL}?pageIndex=${pIndex}&pageSize=${pSize}&orderBy=${pOrderBy}`;
    await restClient.sendRequest(requestOptions, targetURL, async (response) => {
      const templatePagingResult = (await response.json()) as PagingResult<TemplateReportOverview>;
      setPagingResult(templatePagingResult);
      return { message: 'Load templates successfully!!', key: new Date().getTime() } as SnackbarMessage;
    });
  };

  useEffect(() => {
    loadTemplateReportSummaryAsync(pageIndex, pageSize, orderBy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize, orderBy, searchText, restClient]);

  const columns: ColumnMetadata<TemplateReportOverview>[] = [
    {
      id: 'uuid',
      label: 'Task ID',
      isSortable: true,
      minWidth: 100,
      isKeyColumn: true,
    },
    {
      id: 'status',
      label: 'Status',
      isSortable: true,
      minWidth: 100,
    },
    {
      id: 'outputReportText',
      label: 'Text',
      minWidth: 100,
      renderCell: (row: TemplateReportOverview) => (
        <TextTruncate text={row.outputReportText} maxTextLength={100} tooltipVisiable={false} />
      ),
    },
    {
      id: 'startedAt',
      label: 'Start time',
      isSortable: true,
      minWidth: 170,
      align: 'left',
      format: (val: number) => DataTypeDisplayer.formatDate(val),
    },
    {
      id: 'endedAt',
      label: 'End time',
      isSortable: true,
      minWidth: 170,
      align: 'left',
      format: (val: number) => DataTypeDisplayer.formatDate(val),
    },
    {
      id: 'elapsedTime',
      label: 'Elapsed time',
      isSortable: true,
      minWidth: 170,
      align: 'left',
      format: (val: string) => val,
    },
    {
      id: 'actions',
      label: '',
      minWidth: 100,
      align: 'right',
      actions: [
        {
          actionIcon: <Eye className="w-4 h-4" />,
          actionLabel: 'Go to details',
          actionName: 'gotoActionDetail',
          onClick: (row: TemplateReportOverview) => () => {
            navigate(`/tasks/${row.uuid}`);
          },
        },
      ],
    },
  ];

  const floatingActions: SpeedDialActionMetadata[] = [
    {
      actionIcon: <PlusCircle className="w-5 h-5" />,
      actionName: 'create',
      actionLabel: 'New Template Task',
      onClick: () => navigate('/tasks/new'),
    },
  ];

  const headerActions: GenericActionMetadata[] = [
    {
      actionIcon: <RefreshCw className="w-4 h-4" />,
      actionLabel: 'Refresh',
      actionName: 'refreshAction',
      onClick: () => loadTemplateReportSummaryAsync(pageIndex, pageSize, orderBy),
    },
  ];

  return (
    <EntitySummaryTemplate<TemplateReportOverview>
      pageTitle="Tasks"
      breadcrumbs={breadcrumbs}
      headerActions={headerActions}
      floatingActions={floatingActions}
      tableProps={{
        name: 'Overview',
        columns,
        keyColumn: 'uuid',
        loading: processTracking,
        pagingResult,
        pagingOptions: {
          pageIndex,
          pageSize,
          orderBy,
          searchText,
          rowsPerPageOptions: [5, 10, 20],
          onPageChange: (pIndex, pSize, pOrderBy, pSearch) => {
            setPageIndex(pIndex);
            setPageSize(pSize);
            setOrderBy(pOrderBy);
            setSearchText(pSearch);
            LocalStorageService.put(pageIndexStorageKey, pIndex);
            LocalStorageService.put(pageSizeStorageKey, pSize);
            LocalStorageService.put(orderByStorageKey, pOrderBy);
            loadTemplateReportSummaryAsync(pIndex, pSize, pOrderBy);
          },
        },
        onRowClickCallback: (row: TemplateReportOverview) => navigate(`/tasks/${row.uuid}`),
      }}
    />
  );
}