export const TEMPLATE_BACKEND_URL: string = `${process.env.REACT_APP_TEMPLATE_MANAGER_BACKEND_URL}/template-manager-backend/templates`
export const TEMPLATE_REPORT_BACKEND_URL: string = `${process.env.REACT_APP_TEMPLATE_MANAGER_BACKEND_URL}/template-manager-backend/templates/reports`

export const ROOT_BREADCRUMB: string = 'Templates'

export interface TemplateOverview {
    uuid: string
    templateName: string
    dataTemplateJSON: string
    templateText: string
    createdAt: number
    updatedAt: number
}

export interface TemplateMetadata {
    templateName: string,
    templateText: string,
    dataTemplateJSON: string
}

export interface TemplateReportOverview {
    uuid: string
    status: string
    outputReportText: string
    startedAt: number
    endedAt: number
    elapsedTime: string
}

export interface TemplateReportMetadata {
    templateName: string,
    templateData: string
    templateEngine: string

}