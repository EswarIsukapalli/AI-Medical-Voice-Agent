import React from 'react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';

import type { doctorAgent } from './DoctorAgentCard'

type SessionDetail = {
    id: number,
    sessionId: string,
    notes: string,
    selectedDoctor: doctorAgent,
    createdOn: string,
    report?: {
        user?: string
        agent?: string
        chiefComplaint?: string
        summary?: string
        symptoms?: string[]
        duration?: string
        severity?: string
        conversationFlow?: Array<{timestamp: string, speaker: string, content: string}>
        medicalHistory?: string
        vitalSigns?: string
        recommendations?: string
        followUp?: string
        urgency?: string
        diagnosis?: string
        medications?: string
        nextSteps?: string
    }
}

type Props = {
    record: SessionDetail
}

function ViewReportDialog({ record }: Props) {
    const timeAgo = (isoDateString: string) => {
        const now = new Date().getTime()
        const then = new Date(isoDateString).getTime()
        const diffMs = Math.max(0, now - then)
        const sec = Math.floor(diffMs / 1000)
        if (sec < 60) return `${sec} second${sec !== 1 ? 's' : ''} ago`
        const min = Math.floor(sec / 60)
        if (min < 60) return `${min} minute${min !== 1 ? 's' : ''} ago`
        const hr = Math.floor(min / 60)
        if (hr < 24) return `${hr} hour${hr !== 1 ? 's' : ''} ago`
        const day = Math.floor(hr / 24)
        if (day < 30) return `${day} day${day !== 1 ? 's' : ''} ago`
        const month = Math.floor(day / 30)
        if (month < 12) return `${month} month${month !== 1 ? 's' : ''} ago`
        const year = Math.floor(month / 12)
        return `${year} year${year !== 1 ? 's' : ''} ago`
    }
    return (
        <div>
            <Dialog>
  <DialogTrigger asChild>
    <Button variant={'link'} size={'sm'}>View Report</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle className='text-center text-4xl'>
        Medical AI Voice Agent Report
      </DialogTitle>
      <DialogDescription asChild>
        <div className='mt-10'>
          <h3 className='font-semibold text-blue-600 text-base mb-3'>Video Info:</h3>
          <div className='flex flex-wrap items-center gap-x-8 gap-y-2 text-sm'>
            <div className='flex items-center gap-2'>
              <span className='font-semibold'>Doctor Specialization:</span>
              <span className='text-muted-foreground'>{record.selectedDoctor?.specialist}</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='font-semibold'>Consult Date:</span>
              <span className='text-muted-foreground'>{timeAgo(record.createdOn)}</span>
            </div>
          </div>
          <div className='mt-6 space-y-6'>
            <section>
              <h4 className='text-blue-600 font-semibold text-xl border-b border-blue-200 pb-2'>Session Info</h4>
              <div className='grid grid-cols-2 gap-x-8 gap-y-2 text-sm mt-3'>
                <div><span className='font-semibold'>Doctor:</span> <span className='text-muted-foreground'>{record.selectedDoctor?.specialist || 'N/A'}</span></div>
                <div><span className='font-semibold'>User:</span> <span className='text-muted-foreground'>{record.report?.user || 'Anonymous'}</span></div>
                <div><span className='font-semibold'>Consulted On:</span> <span className='text-muted-foreground'>{new Date(record.createdOn).toLocaleString()}</span></div>
                <div><span className='font-semibold'>Agent:</span> <span className='text-muted-foreground'>{record.report?.agent || `${record.selectedDoctor?.specialist} AI`}</span></div>
              </div>
            </section>
            <section>
              <h4 className='text-blue-600 font-semibold text-xl border-b border-blue-200 pb-2'>Chief Complaint</h4>
              <p className='text-muted-foreground mt-3'>{record.report?.chiefComplaint || record.notes || 'Not specified'}</p>
            </section>
            <section>
              <h4 className='text-blue-600 font-semibold text-xl border-b border-blue-200 pb-2'>Conversation Summary</h4>
              <p className='text-muted-foreground mt-3 whitespace-pre-wrap'>{record.report?.summary || 'No summary available yet.'}</p>
            </section>
            
            <section>
              <h4 className='text-blue-600 font-semibold text-xl border-b border-blue-200 pb-2'>Clinical Assessment</h4>
              <div className='grid grid-cols-2 gap-6 mt-3 text-sm'>
                <div><span className='font-semibold'>Urgency Level:</span> <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  record.report?.urgency === 'emergency' ? 'bg-red-100 text-red-800' :
                  record.report?.urgency === 'urgent' ? 'bg-orange-100 text-orange-800' :
                  'bg-green-100 text-green-800'
                }`}>{record.report?.urgency || 'Not specified'}</span></div>
                <div><span className='font-semibold'>Severity:</span> <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  record.report?.severity === 'critical' ? 'bg-red-100 text-red-800' :
                  record.report?.severity === 'severe' ? 'bg-orange-100 text-orange-800' :
                  record.report?.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>{record.report?.severity || 'Not specified'}</span></div>
                <div><span className='font-semibold'>Duration:</span> <span className='text-muted-foreground'>{record.report?.duration || 'Not specified'}</span></div>
                <div><span className='font-semibold'>Preliminary Diagnosis:</span> <span className='text-muted-foreground'>{record.report?.diagnosis || 'Not specified'}</span></div>
              </div>
            </section>

            <section>
              <h4 className='text-blue-600 font-semibold text-xl border-b border-blue-200 pb-2'>Symptoms Identified</h4>
              <ul className='list-disc pl-5 mt-3 text-muted-foreground'>
                {(record.report?.symptoms && record.report.symptoms.length>0 ? record.report.symptoms : []).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
                {(!record.report?.symptoms || record.report?.symptoms?.length===0) && <li>Not specified</li>}
              </ul>
            </section>

            {record.report?.medicalHistory && (
              <section>
                <h4 className='text-blue-600 font-semibold text-xl border-b border-blue-200 pb-2'>Medical History</h4>
                <p className='text-muted-foreground mt-3'>{record.report.medicalHistory}</p>
              </section>
            )}

            {record.report?.vitalSigns && (
              <section>
                <h4 className='text-blue-600 font-semibold text-xl border-b border-blue-200 pb-2'>Vital Signs</h4>
                <p className='text-muted-foreground mt-3'>{record.report.vitalSigns}</p>
              </section>
            )}

            {record.report?.recommendations && (
              <section>
                <h4 className='text-blue-600 font-semibold text-xl border-b border-blue-200 pb-2'>AI Recommendations</h4>
                <p className='text-muted-foreground mt-3 whitespace-pre-wrap'>{record.report.recommendations}</p>
              </section>
            )}

            {record.report?.medications && (
              <section>
                <h4 className='text-blue-600 font-semibold text-xl border-b border-blue-200 pb-2'>Medications Discussed</h4>
                <p className='text-muted-foreground mt-3'>{record.report.medications}</p>
              </section>
            )}

            {record.report?.followUp && (
              <section>
                <h4 className='text-blue-600 font-semibold text-xl border-b border-blue-200 pb-2'>Follow-up Actions</h4>
                <p className='text-muted-foreground mt-3 whitespace-pre-wrap'>{record.report.followUp}</p>
              </section>
            )}

            {record.report?.nextSteps && (
              <section>
                <h4 className='text-blue-600 font-semibold text-xl border-b border-blue-200 pb-2'>Next Steps</h4>
                <p className='text-muted-foreground mt-3 whitespace-pre-wrap'>{record.report.nextSteps}</p>
              </section>
            )}

            {record.report?.conversationFlow && record.report.conversationFlow.length > 0 && (
              <section>
                <h4 className='text-blue-600 font-semibold text-xl border-b border-blue-200 pb-2'>Conversation Flow</h4>
                <div className='mt-3 space-y-3 max-h-60 overflow-y-auto'>
                  {record.report.conversationFlow.map((point, i) => (
                    <div key={i} className='border-l-4 border-blue-200 pl-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-r'>
                      <div className='flex justify-between items-start mb-1'>
                        <span className='font-semibold text-sm text-blue-600'>{point.speaker}</span>
                        <span className='text-xs text-gray-500'>{point.timestamp}</span>
                      </div>
                      <p className='text-sm text-muted-foreground'>{point.content}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </DialogDescription>  
    </DialogHeader>
  </DialogContent>
</Dialog>
        </div>
    )
}

export default ViewReportDialog;