import * as React from 'react';
import { Link } from "react-router-dom";
import { ViewUpdate } from "@codemirror/view";
import { LanguageSupport } from '@codemirror/language';
import { SelectChangeEvent, createTheme } from '@mui/material';

export const DEFAULT_THEME = createTheme({
  typography: {
    fontSize: 13,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

export function WithLink(to: any, children: any) {
    return <Link to={to}>{children}</Link>
};

export function onchangeStepDefault(propName: string, propValue: any, stepMetadataCallback?: (stepMetadata: StepMetadata) => void,
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

export function onChangeProperty(propName: string, propValue: any, propertyCallback?: (property: PropertyMetadata) => void): React.SetStateAction<PropertyMetadata[]> {
  return previous => {
    return [...previous].map((prop) => {
      if (prop.propName === propName) {
        prop.propValue = propValue;
      }
      if (propertyCallback) {
          propertyCallback(prop);
      }
      return prop;
    });
  };
}

export class DataTypeDisplayer {

    static formatDate(value: number) {

        if (!value) {
          return "";
        }

        let createdAtDate = new Date(value);
        return createdAtDate.toString();

    }
}

export class RestClient {
    setCircleProcessOpen: (value: boolean) => void
    setMessageInfo: (message: SnackbarMessage) => void
    setOpenError: (value: boolean) => void
    setOpenSuccess: (value: boolean) => void

    constructor(setCircleProcessOpen: (value: boolean) => void,
        setMessageInfo: (message: SnackbarMessage) => void,
        setOpenError: (value: boolean) => void,
        setOpenSuccess: (value: boolean) => void
    ) {
        this.setCircleProcessOpen = setCircleProcessOpen;
        this.setMessageInfo = setMessageInfo;
        this.setOpenError = setOpenError;
        this.setOpenSuccess = setOpenSuccess;
    }

    async defaultErrorCallback(response: Response) : Promise<SnackbarMessage> {
        let responseJSON = await response.json();
        return { 'message': responseJSON['message'], key: new Date().getTime() } as SnackbarMessage;

    }

    async sendRequest(requestOptions: any, targetURL: string,
        successCallback: (response: Response) => Promise<SnackbarMessage | undefined> | undefined,
        errorCallback?: (response: Response) => Promise<SnackbarMessage> | undefined) {

        try {
            this.setCircleProcessOpen(true);
            let response = await fetch(targetURL, requestOptions);
            if (response.status >= 400) {

                if (!errorCallback) {
                    errorCallback = this.defaultErrorCallback
                }

                let errorSnackbarMessage = errorCallback(response);
                if (errorSnackbarMessage) {
                    this.setMessageInfo(await errorSnackbarMessage);
                    this.setOpenError(true);
                }
                return;
            }

            let successSnackbarMessage = successCallback(response);
            if (successSnackbarMessage) {
                let snackbarMessage = await successSnackbarMessage;
                if (snackbarMessage) {
                    this.setMessageInfo(snackbarMessage);
                    this.setOpenSuccess(true);
                }
            }
        } catch (error: any) {
            let messageInfo = { 'message': "An interal error occurred during your request!", key: new Date().getTime() } as SnackbarMessage;
            this.setMessageInfo(messageInfo);
            this.setOpenError(true);
        } finally {
            this.setCircleProcessOpen(false);
        }
    }
}

export interface SnackbarAlertMetadata {
    openError: boolean
    openSuccess: boolean
    setOpenError: (previous: any) => void
    setOpenSuccess: (previous: any) => void
    messageInfo: SnackbarMessage | undefined
}

export interface SnackbarMessage {
    message: string;
    key: number;
}

export enum PropType {
    InputText,
    Textarea,
    Selection,
    CodeEditor,
    Switcher
}

export interface TextFieldMetadata {
    placeholder?: string
    onChangeEvent: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement > | undefined | any
}

export interface CodeEditorMetadata {
    height?: string
    codeLanguges: Array<LanguageSupport>
    onChangeEvent: (propertyName: string) => (value: string, viewUpdate: ViewUpdate) => void
}

export interface SwitcherFieldMeta {
    onChangeEvent: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void
}

export interface SelectionData {
    label: string
    value: any
}

export interface SelectionMetadata {
    selections: Array<SelectionData>
    isMultiple?: boolean
    onChangeEvent: (event: SelectChangeEvent, child: React.ReactNode) => void
}

export interface PropertyMetadata {
    propName: string
    propValue: any
    propDefaultValue?: any
    propExtraProperties?: any
    propType: PropType
    propLabel?: string
    isRequired?: boolean
    disabled?: boolean
    propDescription?: string
    layoutProperties?: any
    labelElementProperties?: any
    valueElementProperties?: any

    codeEditorMeta?: CodeEditorMetadata
    selectionMeta?: SelectionMetadata
    textFieldMeta?: TextFieldMetadata
    textareaFieldMeta?: TextFieldMetadata
    switcherFieldMeta?: SwitcherFieldMeta

}

export interface EntityMetadata {
    properties: Array<PropertyMetadata>
}

export interface ActionMetadata {
    actionName: string
    actionLabel: string
    actionLabelContent?: any
    actionIcon: any
    visible?: (row: any) => boolean | boolean
    disable?: boolean
    properties?: any
}

export interface GenericActionMetadata extends ActionMetadata {
    onClick?: (data?: any) => void
}

export interface ColumnActionMetadata extends ActionMetadata {
    onClick: (row: any) => (event: any) => void
}

export interface SpeedDialActionMetadata extends ActionMetadata {
    onClick?: React.MouseEventHandler<HTMLDivElement>
}

export interface ColumnMetadata {
    label: string
    id: string
    isHidden?: boolean
    minWidth?: number
    isKeyColumn?: boolean
    align?: "center" | "right" | "left" | "inherit" | "justify" | undefined
    format?: any
    actions?: Array<ColumnActionMetadata>
}

export interface PagingOptionMetadata {

    rowsPerPageOptions: Array<number | { value: number; label: string }>
    component: string | "div"
    pageSize: number
    pageIndex: number
    onPageChange: (pageIndex: number, pageSize: number) => void
}

export interface PagingResult {
    totalElements: number
    content: Array<any>
    elementTransformCallback?: (record: any) => any
    pageable?: any
}

export interface TableMetadata {
    columns: Array<ColumnMetadata>
    pagingOptions: PagingOptionMetadata
    pagingResult: PagingResult
    onRowClickCallback?: (record: any) => any
}


export interface PageEntityMetadata {
    pageName: string
    floatingActions?: Array<SpeedDialActionMetadata>
    stepMetadatas?: Array<StepMetadata>
    tableMetadata?: TableMetadata
    breadcumbsMeta?: Array<React.ReactNode>
    pageEntityActions?: Array<GenericActionMetadata>
    properties?: Array<PropertyMetadata>
}

export interface StepMetadata extends EntityMetadata {
    name: string
    label: string
    isOptional?: boolean
    description?: string
    onFinishStepClick?: (currentStepMetadata: Array<StepMetadata>) => void
}

export interface DialogMetadata {
    open: boolean
    title?: string,
    content?: string,
    negativeText: string
    positiveText: string
    negativeAction?: () => void
    positiveAction?: () => void
}