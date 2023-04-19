export const TEMPLATE_BACKEND_URL: string = 'http://templateman.local:6087/template-manager/templates'
export const TEMPLATE_REPORT_BACKEND_URL: string = 'http://templateman.local:6087/template-manager/templates/reports'
export const ROOT_BREADCRUMB: string = 'Templates'

export interface TemplateOverview {
    uuid: string
    templateName: string
    templateText: string
    createdAt: number
    updatedAt: number
}

export interface TemplateMetadata {
    templateName: string,
    templateText: string
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