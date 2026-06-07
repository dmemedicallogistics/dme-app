import { useState, useRef } from 'react';
import Header from './Header';
import { CheckCircle, Upload, AlertCircle, Loader2, FileText, X } from 'lucide-react';
import { supabase } from './lib/supabase';

interface FileState {
  file: File | null;
  name: string;
}

const CHECKLIST = [
  { label: 'Completed referral form (below)', required: true },
  { label: 'Signed prescription / order from physician', required: true },
  { label: 'Insurance card (front & back)', required: true },
  { label: 'Relevant chart notes or clinical documentation', required: false },
  { label: 'Face sheet (for facility referrals)', required: false },
];

export default function ReferralForm() {
  const [form, setForm] = useState({
    agencyName: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    patientFirstName: '',
    patientLastName: '',
    patientDob: '',
    patientAddress: '',
    patientPhone: '',
    equipmentNeeded: '',
    diagnosisNotes: '',
  });

  const [prescription, setPrescription] = useState<FileState>({ file: null, name: '' });
  const [insurance, setInsurance] = useState<FileState[]>([]);
  const [chartNotes, setChartNotes] = useState<FileState>({ file: null, name: '' });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const prescriptionRef = useRef<HTMLInputElement>(null);
  const insuranceRef = useRef<HTMLInputElement>(null);
  const chartNotesRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handlePrescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPrescription({ file, name: file?.name || '' });
  };

  const handleInsuranceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setInsurance(files.map(f => ({ file: f, name: f.name })));
  };

  const handleChartNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setChartNotes({ file, name: file?.name || '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!prescription.file) {
      setError('A signed prescription is required.');
      return;
    }
    if (insurance.length === 0) {
      setError('Insurance card is required.');
      return;
    }

    setSubmitting(true);

    try {
      // Convert files to base64
      const prescriptionB64 = await fileToBase64(prescription.file);
      const insuranceB64s = await Promise.all(insurance.map(i => fileToBase64(i.file!)));
      const chartNotesB64 = chartNotes.file ? await fileToBase64(chartNotes.file) : null;

      const payload = {
        agency_name: form.agencyName,
        contact_name: form.contactName,
        contact_phone: form.contactPhone,
        contact_email: form.contactEmail,
        patient_first_name: form.patientFirstName,
        patient_last_name: form.patientLastName,
        patient_dob: form.patientDob,
        patient_address: form.patientAddress,
        patient_phone: form.patientPhone,
        equipment_needed: form.equipmentNeeded,
        diagnosis_notes: form.diagnosisNotes,
        prescription: {
          name: prescription.file.name,
          type: prescription.file.type,
          data: prescriptionB64,
        },
        insurance_cards: insurance.map((ins, i) => ({
          name: ins.file!.name,
          type: ins.file!.type,
          data: insuranceB64s[i],
        })),
        chart_notes: chartNotes.file ? {
          name: chartNotes.file.name,
          type: chartNotes.file.type,
          data: chartNotesB64,
        } : null,
      };

      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/submit-referral`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Submission failed. Please try again.');
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again or call (630) 885-0414.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white font-['Inter',sans-serif]">
        <Header />
        <div className="pt-32 pb-20 px-4 flex items-center justify-center">
          <div className="max-w-lg text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Referral Submitted</h1>
            <p className="text-gray-600 leading-relaxed mb-4">
              We've received your referral and will contact the patient's insurance to verify eligibility.
              You'll hear from us within <strong>up to 48 hours</strong> of receiving all required documentation.
            </p>
            <p className="text-gray-500 text-sm mb-8">
              Questions? Call us at <a href="tel:+16308850414" className="text-red-600 font-semibold">(630) 885-0414</a> or email{' '}
              <a href="mailto:dmemedicallogistics@gmail.com" className="text-red-600 font-semibold">dmemedicallogistics@gmail.com</a>.
            </p>
            <a href="/" className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors inline-block">
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter',sans-serif]">
      <Header />
      <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Submit a Referral</h1>
            <p className="text-lg text-gray-600">
              Complete the form below. We'll verify insurance and reach out to your patient within 48 hours.
            </p>
          </div>

          <div className="grid lg:grid-cols-[340px_1fr] gap-10 items-start">
            {/* ── CHECKLIST SIDEBAR ── */}
            <div className="lg:sticky lg:top-28 bg-white rounded-2xl border border-gray-200 p-7 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-1">What to Include</h2>
              <p className="text-sm text-gray-500 mb-5">Attach required documents below. Missing items will delay processing.</p>
              <ul className="space-y-3">
                {CHECKLIST.map(({ label, required }) => (
                  <li key={label} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center ${required ? 'bg-red-100' : 'bg-gray-100'}`}>
                      <div className={`w-2 h-2 rounded-full ${required ? 'bg-red-500' : 'bg-gray-400'}`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-700 leading-snug">{label}</p>
                      <p className={`text-xs mt-0.5 font-medium ${required ? 'text-red-500' : 'text-gray-400'}`}>
                        {required ? 'Required' : 'If available'}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-5 border-t border-gray-100 text-sm text-gray-500">
                <p className="font-semibold text-gray-700 mb-1">Need help?</p>
                <p><a href="tel:+16308850414" className="text-red-600 hover:underline">(630) 885-0414</a></p>
                <p><a href="mailto:dmemedicallogistics@gmail.com" className="text-red-600 hover:underline text-xs">dmemedicallogistics@gmail.com</a></p>
              </div>
            </div>

            {/* ── FORM ── */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Referral Source */}
              <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Referral Source</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Agency / Practice Name</label>
                    <input name="agencyName" value={form.agencyName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="e.g. Northwestern Medicine" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Name <span className="text-red-500">*</span></label>
                    <input required name="contactName" value={form.contactName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Phone <span className="text-red-500">*</span></label>
                    <input required name="contactPhone" value={form.contactPhone} onChange={handleChange} type="tel" className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="(555) 000-0000" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Email</label>
                    <input name="contactEmail" value={form.contactEmail} onChange={handleChange} type="email" className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="you@example.com" />
                  </div>
                </div>
              </div>

              {/* Patient Info */}
              <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Patient Information</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name <span className="text-red-500">*</span></label>
                    <input required name="patientFirstName" value={form.patientFirstName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="First name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name <span className="text-red-500">*</span></label>
                    <input required name="patientLastName" value={form.patientLastName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Last name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth <span className="text-red-500">*</span></label>
                    <input required name="patientDob" value={form.patientDob} onChange={handleChange} type="date" className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Patient Phone</label>
                    <input name="patientPhone" value={form.patientPhone} onChange={handleChange} type="tel" className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="(555) 000-0000" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Home Address <span className="text-red-500">*</span></label>
                    <input required name="patientAddress" value={form.patientAddress} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Street, City, State, ZIP" />
                  </div>
                </div>
              </div>

              {/* Clinical Info */}
              <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Clinical Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Equipment Needed <span className="text-red-500">*</span></label>
                    <textarea required name="equipmentNeeded" value={form.equipmentNeeded} onChange={handleChange} rows={3} className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none" placeholder="e.g. Shower chair, raised toilet seat, adult briefs (medium)" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Diagnosis / Clinical Notes</label>
                    <textarea name="diagnosisNotes" value={form.diagnosisNotes} onChange={handleChange} rows={3} className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none" placeholder="Relevant diagnosis codes, functional limitations, or notes for insurance" />
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Documents</h2>
                <div className="space-y-5">

                  {/* Prescription */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Signed Prescription <span className="text-red-500">*</span>
                    </label>
                    <input ref={prescriptionRef} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handlePrescriptionChange} className="hidden" />
                    <button type="button" onClick={() => prescriptionRef.current?.click()} className={`w-full border-2 border-dashed rounded-xl p-5 text-center transition-colors ${prescription.file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-red-400 hover:bg-red-50'}`}>
                      {prescription.file ? (
                        <div className="flex items-center justify-center gap-2 text-green-700">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm font-medium">{prescription.name}</span>
                          <button type="button" onClick={(e) => { e.stopPropagation(); setPrescription({ file: null, name: '' }); }} className="ml-1 text-gray-400 hover:text-red-500">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-gray-500">
                          <Upload className="h-5 w-5 text-gray-400" />
                          <span className="text-sm">Click to upload prescription</span>
                          <span className="text-xs text-gray-400">PDF, JPG, or PNG</span>
                        </div>
                      )}
                    </button>
                  </div>

                  {/* Insurance */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Insurance Card (front &amp; back) <span className="text-red-500">*</span>
                    </label>
                    <input ref={insuranceRef} type="file" accept=".pdf,.jpg,.jpeg,.png" multiple onChange={handleInsuranceChange} className="hidden" />
                    <button type="button" onClick={() => insuranceRef.current?.click()} className={`w-full border-2 border-dashed rounded-xl p-5 text-center transition-colors ${insurance.length > 0 ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-red-400 hover:bg-red-50'}`}>
                      {insurance.length > 0 ? (
                        <div className="flex flex-col items-center gap-1 text-green-700">
                          {insurance.map((ins, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm font-medium">
                              <FileText className="h-4 w-4" />
                              {ins.name}
                            </div>
                          ))}
                          <span className="text-xs text-gray-500 mt-1">Click to change</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-gray-500">
                          <Upload className="h-5 w-5 text-gray-400" />
                          <span className="text-sm">Click to upload insurance card(s)</span>
                          <span className="text-xs text-gray-400">You can select multiple files</span>
                        </div>
                      )}
                    </button>
                  </div>

                  {/* Chart Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Chart Notes <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input ref={chartNotesRef} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChartNotesChange} className="hidden" />
                    <button type="button" onClick={() => chartNotesRef.current?.click()} className={`w-full border-2 border-dashed rounded-xl p-5 text-center transition-colors ${chartNotes.file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-red-400 hover:bg-red-50'}`}>
                      {chartNotes.file ? (
                        <div className="flex items-center justify-center gap-2 text-green-700">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm font-medium">{chartNotes.name}</span>
                          <button type="button" onClick={(e) => { e.stopPropagation(); setChartNotes({ file: null, name: '' }); }} className="ml-1 text-gray-400 hover:text-red-500">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-gray-500">
                          <Upload className="h-5 w-5 text-gray-400" />
                          <span className="text-sm">Click to upload chart notes</span>
                          <span className="text-xs text-gray-400">PDF, JPG, or PNG</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting Referral…
                  </>
                ) : (
                  'Submit Referral'
                )}
              </button>

              <p className="text-center text-xs text-gray-400 pb-4">
                By submitting this form you confirm you have authorization to share the patient's information per HIPAA guidelines.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
