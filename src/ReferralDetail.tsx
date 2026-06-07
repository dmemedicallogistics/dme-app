import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { X, ClipboardList, Building2, User, Phone, Mail, Calendar, Package, FileText, Download, Eye, AlertCircle, Loader2 } from 'lucide-react';
import CommentsSection from './CommentsSection';

interface ReferralDetailProps {
  referralId: string;
  onClose: () => void;
}

interface ReferralData {
  id: string;
  referral_id: string;
  created_at: string;
  agency_name: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  patient_first_name: string;
  patient_last_name: string;
  patient_dob: string;
  patient_address: string;
  patient_phone: string;
  equipment_needed: string;
  diagnosis_notes: string;
  status: string;
  prescription_url: string;
  chart_notes_url: string;
  insurance_url: string;
}

interface DocumentInfo {
  name: string;
  path: string | null;
  label: string;
}

export default function ReferralDetail({ referralId, onClose }: ReferralDetailProps) {
  const [referral, setReferral] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documentLoading, setDocumentLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchReferralDetails();
  }, [referralId]);

  const fetchReferralDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('id', referralId)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Referral not found');

      setReferral(data);
    } catch (err) {
      console.error('Failed to fetch referral details:', err);
      setError(err instanceof Error ? err.message : 'Failed to load referral details');
    } finally {
      setLoading(false);
    }
  };

  const normalizeStoragePath = (pathOrUrl: string): string => {
    // If it's already a full URL, extract the relative path
    if (pathOrUrl.includes('supabase.co/storage/v1/object/public/referral-documents/')) {
      const parts = pathOrUrl.split('referral-documents/');
      return parts[1];
    }
    // Otherwise it's already a relative path
    return pathOrUrl;
  };

  const getDocumentUrl = async (pathOrUrl: string) => {
    try {
      const relativePath = normalizeStoragePath(pathOrUrl);

      // Bucket is private, use signed URL with 1 hour expiry
      const { data, error } = await supabase
        .storage
        .from('referral-documents')
        .createSignedUrl(relativePath, 3600);

      if (error) {
        console.error('Failed to create signed URL:', error);
        throw new Error(`Storage error: ${error.message}`);
      }

      if (!data?.signedUrl) {
        throw new Error('No signed URL returned from storage');
      }

      return data.signedUrl;
    } catch (err) {
      console.error('Failed to generate document URL:', err);
      throw err;
    }
  };

  const getDocumentViewUrl = (docName: string): string => {
    const docTypeMap: Record<string, string> = {
      'Prescription': 'prescription',
      'Chart Notes': 'chart_notes',
      'Insurance': 'insurance'
    };
    const docType = docTypeMap[docName] || docName.toLowerCase().replace(/\s+/g, '_');
    return `/dashboard/view-document?referralId=${referralId}&type=${docType}`;
  };

  const handleDownloadDocument = async (path: string, label: string) => {
    try {
      setDocumentLoading(label);

      const documentUrl = await getDocumentUrl(path);
      const response = await fetch(documentUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch document: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      // Try to get file extension from the path
      const relativePath = normalizeStoragePath(path);
      const fileExt = relativePath.split('.').pop() || 'pdf';
      const fileName = `${label.replace(/\s+/g, '_')}_${referral?.referral_id}.${fileExt}`;
      a.download = fileName;

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to download document:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      alert(`Failed to download ${label}: ${errorMessage}`);
    } finally {
      setDocumentLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatStatus = (status: string) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const documents: DocumentInfo[] = [
    { name: 'prescription', path: referral?.prescription_url || null, label: 'Prescription' },
    { name: 'chartNotes', path: referral?.chart_notes_url || null, label: 'Chart Notes' },
    { name: 'insurance', path: referral?.insurance_url || null, label: 'Insurance' }
  ];

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-3 text-slate-600">Loading referral details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !referral) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-8">
          <div className="flex items-start gap-3 text-red-600 mb-6">
            <AlertCircle className="h-6 w-6 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg">Error</h3>
              <p className="text-sm text-red-700">{error || 'Referral not found'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-slate-600 hover:bg-slate-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
        <div className="bg-white border-b border-slate-200 px-8 py-6 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ClipboardList className="h-7 w-7 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Referral Details</h2>
              <p className="text-sm text-slate-600">{referral.referral_id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-slate-600" />
          </button>
        </div>

        <div className="px-8 py-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  Agency Information
                </h3>
                <div className="space-y-3 bg-slate-50 rounded-lg p-4">
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase">Agency/Company</label>
                    <p className="text-sm text-slate-900 font-medium mt-1">{referral.agency_name}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase">Contact Name</label>
                    <p className="text-sm text-slate-900 mt-1">{referral.contact_name}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase flex items-center gap-1">
                      <Phone className="h-3 w-3" /> Phone
                    </label>
                    <p className="text-sm text-slate-900 mt-1">{referral.contact_phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase flex items-center gap-1">
                      <Mail className="h-3 w-3" /> Email
                    </label>
                    <p className="text-sm text-slate-900 mt-1">{referral.contact_email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Patient Information
                </h3>
                <div className="space-y-3 bg-slate-50 rounded-lg p-4">
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase">Patient Name</label>
                    <p className="text-sm text-slate-900 font-medium mt-1">
                      {referral.patient_first_name} {referral.patient_last_name}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase">Date of Birth</label>
                    <p className="text-sm text-slate-900 mt-1">{referral.patient_dob || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase">Address</label>
                    <p className="text-sm text-slate-900 mt-1">{referral.patient_address || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase flex items-center gap-1">
                      <Phone className="h-3 w-3" /> Phone
                    </label>
                    <p className="text-sm text-slate-900 mt-1">{referral.patient_phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              Order Details
            </h3>
            <div className="space-y-3 bg-slate-50 rounded-lg p-4">
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase">Equipment Needed</label>
                <p className="text-sm text-slate-900 mt-1">{referral.equipment_needed || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase">Diagnosis / Notes</label>
                <p className="text-sm text-slate-900 mt-1 whitespace-pre-wrap">
                  {referral.diagnosis_notes || 'No notes provided'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Submitted
                  </label>
                  <p className="text-sm text-slate-900 mt-1">{formatDate(referral.created_at)}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Status</label>
                  <p className="text-sm text-slate-900 font-medium mt-1">{formatStatus(referral.status)}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Documents
            </h3>
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.name}
                  className="bg-slate-50 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{doc.label}</p>
                      <p className="text-xs text-slate-500">
                        {doc.path ? 'Available' : 'Not uploaded'}
                      </p>
                    </div>
                  </div>
                  {doc.path && (
                    <div className="flex gap-2">
                      <a
                        href={getDocumentViewUrl(doc.label)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </a>
                      <button
                        onClick={() => handleDownloadDocument(doc.path!, doc.label)}
                        disabled={documentLoading === doc.label}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 disabled:bg-slate-400 text-white text-sm rounded-lg transition-colors"
                      >
                        {documentLoading === doc.label ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                        Download
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {!documents.some(doc => doc.path) && (
                <p className="text-sm text-slate-500 text-center py-4">No documents uploaded</p>
              )}
            </div>
          </div>

          <CommentsSection referralId={referral.id} isAdmin={true} />
        </div>

        <div className="bg-slate-50 border-t border-slate-200 px-8 py-4 rounded-b-xl">
          <button
            onClick={onClose}
            className="w-full bg-slate-600 hover:bg-slate-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
