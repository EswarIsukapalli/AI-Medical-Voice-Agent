import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

import type { doctorAgent } from './DoctorAgentCard'
import { Button } from '@/components/ui/button'
import ViewReportDialog from './ViewReportDialog'

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
    }
}

type Props = { historyList: SessionDetail[] }

function HistoryTable({ historyList }: Props) {
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
    const recentHistory = [...historyList]
      .sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime())
      .slice(0, 2)
    return (
        <div>
            <Table>
  <TableCaption>Previous Consultations Reports</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[00px]">AI Medical Specialist</TableHead>
      <TableHead>Description</TableHead>
      <TableHead>Date</TableHead>
      <TableHead className="text-right">Action</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {recentHistory.map((item) => (
      <TableRow key={item.id}>
        <TableCell className="font-medium">{item.selectedDoctor.specialist}</TableCell>
        <TableCell className="truncate max-w-[360px]">{item.selectedDoctor.description}</TableCell>
        <TableCell>{timeAgo(item.createdOn)}</TableCell>
        <TableCell className="text-right"> < ViewReportDialog record={item}  /> </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
        </div>
    )
}

export default HistoryTable