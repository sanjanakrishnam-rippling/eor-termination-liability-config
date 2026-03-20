import type { UnderwritingFormData, SubmissionResponse } from '../types/underwriting';
import { v4 as uuidv4 } from 'uuid';

export async function submitUnderwritingApplication(
  data: UnderwritingFormData,
): Promise<SubmissionResponse> {
  // Log the payload for development visibility
  console.log('[Risk API Stub] Submitting underwriting application:', {
    accountType: data.accountType,
    companyInfo: data.companyInfo,
    avgMonthlyPayroll: data.avgMonthlyPayroll,
    submissionRequestType: data.submissionRequestType,
    countryRequests: data.countryRequests,
    bankStatementCount: data.financialDetails.bankStatements.length,
    otherDocsCount: data.financialDetails.otherFinancialDocs.length,
    censusFileCount: data.financialDetails.censusFile.length,
    additionalConsiderations: data.additionalConsiderations,
  });

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    caseId: uuidv4(),
    status: 'pending',
  };
}
