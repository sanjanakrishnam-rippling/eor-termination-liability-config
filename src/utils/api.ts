import type { UnderwritingFormData, SubmissionResponse } from '../types/underwriting';

export async function submitUnderwritingApplication(
  data: UnderwritingFormData,
): Promise<SubmissionResponse> {
  console.log('[Risk API Stub] Submitting underwriting application:', {
    companyInfo: data.companyInfo,
    avgMonthlyPayroll: data.avgMonthlyPayroll,
    productType: data.productType,
    eorCensusCsv: data.eorCensusCsv.map((f) => f.name),
    corCensusCsv: data.corCensusCsv.map((f) => f.name),
    bankStatementCount: data.financialDetails.bankStatements.length,
    otherDocsCount: data.financialDetails.otherFinancialDocs.length,
    censusFileCount: data.financialDetails.censusFile.length,
    additionalConsiderations: data.additionalConsiderations,
  });

  await new Promise((resolve) => setTimeout(resolve, 1500));

  return { status: 'pending' };
}
