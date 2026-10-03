import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  EntitySummaryTemplate,
  ConfirmationDialog,
  TextTruncate,
  ColumnMetadata,
  GenericActionMetadata,
  SpeedDialActionMetadata,
  PagingResult,
} from '@hvantran/ui-component-library';
import { Copy, PlusCircle, Trash2, Eye, RefreshCw } from 'lucide-react';
import {
  DataTypeDisplayer,
  LocalStorageService,
  RestClient,
  SnackbarMessage,
} from '../GenericConstants';
import { ROOT_BREADCRUMB, TEMPLATE_BACKEND_URL, TemplateOverview } from '../AppConstants';

const pageIndexStorageKey = 'template-manager-template-table-page-index';
const pageSizeStorageKey = 'template-manager-template-table-page-size';
const orderByStorageKey = 'template-manager-template-table-order';

export default function TemplateSummary() {
  const navigate = useNavigate();
  const [processTracking, setCircleProcessOpen] = useState(false);
  const initialPagingResult: PagingResult<TemplateOverview> = { totalElements: 0, content: [] };
  const [pagingResult, setPagingResult] = useState<PagingResult<TemplateOverview>>(initialPagingResult);

  const [searchText, setSearchText] = useState('');
  const [pageIndex, setPageIndex] = useState(parseInt(LocalStorageService.getOrDefault(pageIndexStorageKey, 0), 10));
  const [pageSize, setPageSize] = useState(parseInt(LocalStorageService.getOrDefault(pageSizeStorageKey, 10), 10));
  const [orderBy, setOrderBy] = useState(LocalStorageService.getOrDefault(orderByStorageKey, '-updatedAt'));

  const restClient = useMemo(() => new RestClient(setCircleProcessOpen), [setCircleProcessOpen]);
  const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false);
  const [confirmationDialogContent, setConfirmationDialogContent] = useState<React.ReactNode>(<p />);
  const [confirmationDialogTitle, setConfirmationDialogTitle] = useState('');
  const [confirmationDialogPositiveAction, setConfirmationDialogPositiveAction] = useState<() => void>(() => () => {});

  const breadcrumbs = [
    { label: ROOT_BREADCRUMB, href: '#' },
    { label: 'Summary' },
  ];

  const deleteTemplate = async (templateId: string) => {
    const requestOptions = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    };
    const targetURL = `${TEMPLATE_BACKEND_URL}/${templateId}`;
    await restClient.sendRequest(requestOptions, targetURL, () => {
      loadTemplateSummaryAsync(pageIndex, pageSize, orderBy);
      return undefined;
    });
  };

  const loadTemplateSummaryAsync = async (pIndex: number, pSize: number, pOrderBy: string) => {
    const requestOptions = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    };

    const targetURL = `${TEMPLATE_BACKEND_URL}?pageIndex=${pIndex}&pageSize=${pSize}&orderBy=${pOrderBy}`;
    await restClient.sendRequest(requestOptions, targetURL, async (response) => {
      const templatePagingResult = (await response.json()) as PagingResult<TemplateOverview>;
      setPagingResult(templatePagingResult);
      return { message: 'Load templates successfully!!', key: new Date().getTime() } as SnackbarMessage;
    });
  };

  useEffect(() => {
    loadTemplateSummaryAsync(pageIndex, pageSize, orderBy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize, orderBy, searchText, restClient]);

  const columns: ColumnMetadata<TemplateOverview>[] = [
    {
      id: 'uuid',
      label: 'Template ID',
      isHidden: true,
      minWidth: 100,
      isKeyColumn: true,
    },
    {
      id: 'templateName',
      label: 'Name',
      isSortable: true,
      minWidth: 100,
    },
    {
      id: 'templateText',
      label: 'Text',
      minWidth: 100,
      renderCell: (row: TemplateOverview) => (
        <TextTruncate text={row.templateText} maxTextLength={100} tooltipVisiable={false} />
      ),
    },
    {
      id: 'createdAt',
      label: 'Created at',
      isSortable: true,
      minWidth: 170,
      align: 'left',
      format: (val: number) => DataTypeDisplayer.formatDate(val),
    },
    {
      id: 'updatedAt',
      label: 'Updated at',
      isSortable: true,
      minWidth: 170,
      align: 'left',
      format: (val: number) => DataTypeDisplayer.formatDate(val),
    },
    {
      id: 'actions',
      label: '',
      minWidth: 200,
      align: 'right',
      actions: [
        {
          actionIcon: <Copy className="w-4 h-4" />,
          actionLabel: 'Clone',
          actionName: 'cloneTemplate',
          onClick: (row: TemplateOverview) => () => {
            navigate('/templates/new', {
              state: {
                template: {
                  templateName: `${row.templateName}-Copy`,
                  dataTemplateJSON: row.dataTemplateJSON,
                  templateContent: row.templateText,
                },
              },
            });
          },
        },
        {
          actionIcon: <PlusCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
          actionLabel: 'Add Task',
          actionName: 'addTaskAction',
          onClick: (row: TemplateOverview) => () => {
            navigate('/tasks/new', {
              state: {
                template: {
                  templateName: row.templateName,
                  dataTemplateJSON: row.dataTemplateJSON,
                  dsiableTemplateNameProp: true,
                },
              },
            });
          },
        },
        {
          actionIcon: <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />,
          actionLabel: 'Delete',
          actionName: 'deleteAction',
          onClick: (row: TemplateOverview) => () => {
            setConfirmationDialogTitle('Delete');
            setConfirmationDialogContent(
              <p>
                Are you sure you want to delete <b>{row.templateName}</b> template?
              </p>
            );
            setConfirmationDialogPositiveAction(() => () => {
              deleteTemplate(row.uuid);
              setDeleteConfirmationDialogOpen(false);
            });
            setDeleteConfirmationDialogOpen(true);
          },
        },
        {
          actionIcon: <Eye className="w-4 h-4" />,
          actionLabel: 'Action details',
          actionName: 'gotoActionDetail',
          onClick: (row: TemplateOverview) => () => {
            navigate(`/templates/${row.templateName}`);
          },
        },
      ],
    },
  ];

  const floatingActions: SpeedDialActionMetadata[] = [
    {
      actionIcon: <PlusCircle className="w-5 h-5" />,
      actionName: 'create',
      actionLabel: 'New Template',
      onClick: () => navigate('/templates/new'),
    },
  ];

  const headerActions: GenericActionMetadata[] = [
    {
      actionIcon: <RefreshCw className="w-4 h-4" />,
      actionLabel: 'Refresh templates',
      actionName: 'refreshAction',
      onClick: () => loadTemplateSummaryAsync(pageIndex, pageSize, orderBy),
    },
  ];

  return (
    <>
      <EntitySummaryTemplate<TemplateOverview>
        pageTitle="Templates"
        breadcrumbs={breadcrumbs}
        headerActions={headerActions}
        floatingActions={floatingActions}
        tableProps={{
          name: 'Dashboard',
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
              loadTemplateSummaryAsync(pIndex, pSize, pOrderBy);
            },
          },
          onRowClickCallback: (row: TemplateOverview) => navigate(`/templates/${row.templateName}`),
        }}
      />
      <ConfirmationDialog
        open={deleteConfirmationDialogOpen}
        title={confirmationDialogTitle}
        content={confirmationDialogContent}
        positiveText="Yes"
        negativeText="No"
        negativeAction={() => setDeleteConfirmationDialogOpen(false)}
        positiveAction={confirmationDialogPositiveAction}
      />
    </>
  );
}