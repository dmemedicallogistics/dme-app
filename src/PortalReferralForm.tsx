import { useState, FormEvent, useEffect } from 'react';
import { Send, CheckCircle, ArrowLeft, Shield, Clock, Lock, Loader2 } from 'lucide-react';
import { supabase } from './lib/supabase';
import Header from './Header';
import { formatPersonName, formatCompanyName } from './lib/formatters';

interface UserProfile {
  company_name: string;
  contact_name: string;
  contact_phone: string;
  email: string;
}

export default function PortalReferralForm() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    patientFirstName: '',
    patientLastName: '',
    patientDob: '',
    patientAddress: '',
    patientPhone: '',
    equipmentNeeded: '',
    diagnosisNotes: '',
    initialComment: ''
  });

  const [files, setFiles] = useState({
    prescription: null as File | null,
    chartNotes: null as File | null,
    insurance: null as File | null
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = '/login';
        return;
      }

      const { data: profileData, error } = await supabase
        .from('user_profiles')
        .select('company_name, contact_name, contact_phone, email, approved')
        .eq('id', user.id)
        .maybeSingle();

      if (error || !profileData) {
        await supabase.auth.signOut();
        window.location.href = '/login';
        return;
      }

      if (!profileData.approved) {
        window.location.href = '/pending-approval';
        return;
      }

      setProfile(profileData);
      setLoading(false);
    } catch (err) {
      console.error('Auth check error:', err);
      window.location.href = '/login';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNameBlur = (e: React.FocusEvent<HTMLInputElement>, fieldName: string) => {
    const value = e.target.value;
    if (!value) return;

    let formattedValue = value;

    // Apply appropriate formatting based on field type
    if (['patientFirstName', 'patientLastName'].includes(fieldName)) {
      formattedValue = formatPersonName(value);
    }

    setFormData({
      ...formData,
      [fieldName]: formattedValue
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files[0]) {
      setFiles({
        ...files,
        [fieldName]: e.target.files[0]
      });
    }
  };

  const triggerFileInput = (inputId: string) => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (input) {
      input.click();
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/png;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    if (!profile) {
      setError('User profile not loaded');
      setSubmitting(false);
      return;
    }

    try {
      // Format patient name fields before submission
      const formattedData = {
        ...formData,
        patientFirstName: formatPersonName(formData.patientFirstName),
        patientLastName: formatPersonName(formData.patientLastName),
      };

      const fileUploads: Record<string, { name: string; data: string; type: string }> = {};

      for (const [key, file] of Object.entries(files)) {
        if (file) {
          try {
            const base64Data = await fileToBase64(file);
            fileUploads[key] = {
              name: file.name,
              data: base64Data,
              type: file.type,
            };
          } catch (err) {
            console.error(`Failed to convert ${key}:`, err);
            throw new Error(`Failed to process ${key} file`);
          }
        }
      }

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-referral`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          agencyName: profile.company_name,
          contactName: profile.contact_name,
          contactPhone: profile.contact_phone,
          contactEmail: profile.email,
          patientFirstName: formattedData.patientFirstName,
          patientLastName: formattedData.patientLastName,
          patientDob: formattedData.patientDob,
          patientAddress: formattedData.patientAddress,
          patientPhone: formattedData.patientPhone,
          equipmentNeeded: formattedData.equipmentNeeded,
          diagnosisNotes: formattedData.diagnosisNotes,
          initialComment: formattedData.initialComment,
          prescriptionFile: fileUploads.prescription,
          chartNotesFile: fileUploads.chartNotes,
          insuranceFile: fileUploads.insurance,
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        console.error('Submission failed:', result);
        throw new Error(result.error || 'Failed to submit referral');
      }

      setSubmitted(true);
      setFormData({
        patientFirstName: '',
        patientLastName: '',
        patientDob: '',
        patientAddress: '',
        patientPhone: '',
        equipmentNeeded: '',
        diagnosisNotes: '',
        initialComment: ''
      });
      setFiles({
        prescription: null,
        chartNotes: null,
        insurance: null
      });
    } catch (err) {
      console.error('Submission error:', err);
      setError('Failed to submit referral. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-red-600 animate-spin" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center border-2 border-green-100">
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 rounded-full p-4">
                  <CheckCircle className="h-20 w-20 text-green-600" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Referral submitted successfully.</h2>
              <p className="text-xl text-gray-700 mb-2 font-semibold">
                Our team will contact you shortly.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                We've received your submission and will begin processing your order promptly.
                You'll hear from us if we need any additional information.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Submit Another Referral
                </button>
                <a
                  href="/portal"
                  className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors inline-flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Portal
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <a
              href="/portal"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Portal
            </a>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Submit a Referral</h1>
            <p className="text-xl text-gray-600 mb-3">
              Submit a referral below. Our team will review the information and begin processing your order promptly.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-left max-w-2xl mx-auto">
              <p className="text-sm text-blue-900">
                <strong>Submitting as:</strong> {profile?.contact_name} from {profile?.company_name}
              </p>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-red-600" />
                <span className="font-medium">Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-red-600" />
                <span className="font-medium">HIPAA-conscious</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-red-600" />
                <span className="font-medium">Fast turnaround</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-red-600">
                Patient Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="patientFirstName"
                    value={formData.patientFirstName}
                    onChange={handleInputChange}
                    onBlur={(e) => handleNameBlur(e, 'patientFirstName')}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="patientLastName"
                    value={formData.patientLastName}
                    onChange={handleInputChange}
                    onBlur={(e) => handleNameBlur(e, 'patientLastName')}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="patientDob"
                    value={formData.patientDob}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="patientPhone"
                    value={formData.patientPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="patientAddress"
                    value={formData.patientAddress}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-red-600">
                Order Details
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Equipment Needed
                  </label>
                  <input
                    type="text"
                    name="equipmentNeeded"
                    value={formData.equipmentNeeded}
                    onChange={handleInputChange}
                    placeholder="e.g., Wheelchair, Hospital Bed, Walker"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Diagnosis / Notes
                  </label>
                  <textarea
                    name="diagnosisNotes"
                    value={formData.diagnosisNotes}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Please provide any relevant diagnosis information or additional notes"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-red-600">
                Comments / Special Instructions
              </h2>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Comments (Optional)
                </label>
                <textarea
                  name="initialComment"
                  value={formData.initialComment}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Any special instructions, questions, or additional information you'd like to share..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none"
                />
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 pb-3 border-b-2 border-red-600">
                Document Uploads
              </h2>
              <p className="text-sm text-gray-600 mb-4 flex items-start gap-2">
                <Shield className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>Please upload all required documents to avoid processing delays.</span>
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-6">
                <p className="text-xs text-blue-900">
                  <strong>Privacy Notice:</strong> Please submit only the information and documents necessary to process this referral. All materials are reviewed by authorized personnel only.
                </p>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="block text-sm font-semibold text-gray-700 mb-2">
                    Prescription
                  </p>
                  <div
                    onClick={() => triggerFileInput('prescription-upload')}
                    className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 hover:border-red-400 transition-colors"
                  >
                    <div className="text-center pointer-events-none">
                      <p className="text-sm text-gray-600">
                        {files.prescription ? (
                          <span className="font-medium text-green-600">✓ {files.prescription.name}</span>
                        ) : (
                          <>
                            <span className="font-semibold text-red-600">Click to upload</span>
                            <span className="text-gray-500"> or drag and drop</span>
                          </>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG, DOC, DOCX</p>
                    </div>
                  </div>
                  <input
                    id="prescription-upload"
                    type="file"
                    onChange={(e) => handleFileChange(e, 'prescription')}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    style={{ display: 'none' }}
                  />
                </div>
                <div>
                  <p className="block text-sm font-semibold text-gray-700 mb-2">
                    Chart Notes
                  </p>
                  <div
                    onClick={() => triggerFileInput('chart-notes-upload')}
                    className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 hover:border-red-400 transition-colors"
                  >
                    <div className="text-center pointer-events-none">
                      <p className="text-sm text-gray-600">
                        {files.chartNotes ? (
                          <span className="font-medium text-green-600">✓ {files.chartNotes.name}</span>
                        ) : (
                          <>
                            <span className="font-semibold text-red-600">Click to upload</span>
                            <span className="text-gray-500"> or drag and drop</span>
                          </>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG, DOC, DOCX</p>
                    </div>
                  </div>
                  <input
                    id="chart-notes-upload"
                    type="file"
                    onChange={(e) => handleFileChange(e, 'chartNotes')}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    style={{ display: 'none' }}
                  />
                </div>
                <div>
                  <p className="block text-sm font-semibold text-gray-700 mb-2">
                    Insurance
                  </p>
                  <div
                    onClick={() => triggerFileInput('insurance-upload')}
                    className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 hover:border-red-400 transition-colors"
                  >
                    <div className="text-center pointer-events-none">
                      <p className="text-sm text-gray-600">
                        {files.insurance ? (
                          <span className="font-medium text-green-600">✓ {files.insurance.name}</span>
                        ) : (
                          <>
                            <span className="font-semibold text-red-600">Click to upload</span>
                            <span className="text-gray-500"> or drag and drop</span>
                          </>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG, DOC, DOCX</p>
                    </div>
                  </div>
                  <input
                    id="insurance-upload"
                    type="file"
                    onChange={(e) => handleFileChange(e, 'insurance')}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="bg-red-600 text-white px-12 py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-3"
              >
                {submitting ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Submit Referral
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
