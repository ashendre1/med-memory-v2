'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LogOut, BarChart2, Upload, FileText, MessageSquare } from 'lucide-react'
import { useRouter } from 'next/router'
import { useSearchParams } from 'next/navigation'

// Mock data for the graph
const graphData = [
  { name: 'Jan', patients: 40 },
  { name: 'Feb', patients: 30 },
  { name: 'Mar', patients: 45 },
  { name: 'Apr', patients: 50 },
  { name: 'May', patients: 65 },
  { name: 'Jun', patients: 60 },
]

export default function DoctorPage() {

    const searchParams = useSearchParams()
    const patient = searchParams.get('patient')
    console.log(patient)

  const [activeSection, setActiveSection] = useState('graph')
  const [chatInput, setChatInput] = useState('')
  
  const [chatMessages, setChatMessages] = useState([
    { role: 'system', content: 'Hello! I\'m your medical assistant. How can I help you today?' }
  ])

  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logout clicked')
  }

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (chatInput.trim()) {
      setChatMessages([...chatMessages, { role: 'user', content: chatInput }])
      // Here you would typically send the message to your LLM model and get a response
      // For this example, we'll just echo the message back
      setTimeout(() => {
        setChatMessages(prev => [...prev, { role: 'system', content: `You said: ${chatInput}` }])
      }, 1000)
      setChatInput('')
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'graph':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Patient Visits Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64 flex items-end justify-between">
                {graphData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="w-8 bg-blue-500 rounded-t"
                      style={{ height: `${data.patients * 2}px` }}
                    ></div>
                    <span className="text-sm mt-2">{data.name}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between">
                <span>0</span>
                <span>Number of Patients</span>
                <span>70</span>
              </div>
            </CardContent>
          </Card>
        )
      case 'uploadReport':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Upload Medical Report</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">Patient Name</label>
                  <Input id="patientName" placeholder="Enter patient name" />
                </div>
                <div>
                  <label htmlFor="reportType" className="block text-sm font-medium text-gray-700">Report Type</label>
                  <Input id="reportType" placeholder="e.g., Blood Test, X-Ray, MRI" />
                </div>
                <div>
                  <label htmlFor="reportFile" className="block text-sm font-medium text-gray-700">Upload File</label>
                  <Input id="reportFile" type="file" accept=".pdf,.doc,.docx,.jpg,.png" />
                </div>
                <Button type="submit">Upload Report</Button>
              </form>
            </CardContent>
          </Card>
        )
      case 'uploadPrescription':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Upload Prescription</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">Patient Name</label>
                  <Input id="patientName" placeholder="Enter patient name" />
                </div>
                <div>
                  <label htmlFor="medication" className="block text-sm font-medium text-gray-700">Medication</label>
                  <Input id="medication" placeholder="Enter medication name" />
                </div>
                <div>
                  <label htmlFor="dosage" className="block text-sm font-medium text-gray-700">Dosage</label>
                  <Input id="dosage" placeholder="e.g., 500mg twice daily" />
                </div>
                <div>
                  <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">Special Instructions</label>
                  <Textarea id="instructions" placeholder="Enter any special instructions" />
                </div>
                <Button type="submit">Upload Prescription</Button>
              </form>
            </CardContent>
          </Card>
        )
      case 'chat':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Medical Assistant Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] overflow-y-auto mb-4 p-4 border rounded">
                {chatMessages.map((message, index) => (
                  <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <span className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      {message.content}
                    </span>
                  </div>
                ))}
              </div>
              <form onSubmit={handleChatSubmit} className="flex gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-grow"
                />
                <Button type="submit">Send</Button>
              </form>
            </CardContent>
          </Card>
        )
      default:
        return <div>Select a section</div>
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <span className="text-lg font-semibold">Welcome, Dr. Smith</span>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 bg-white p-4 shadow-md">
          <nav className="space-y-2">
            <Button
              variant={activeSection === 'graph' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveSection('graph')}
            >
              <BarChart2 className="mr-2 h-4 w-4" />
              Patient Graph
            </Button>
            <Button
              variant={activeSection === 'uploadReport' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveSection('uploadReport')}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Report
            </Button>
            <Button
              variant={activeSection === 'uploadPrescription' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveSection('uploadPrescription')}
            >
              <FileText className="mr-2 h-4 w-4" />
              Upload Prescription
            </Button>
            <Button
              variant={activeSection === 'chat' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveSection('chat')}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Medical Assistant
            </Button>
          </nav>
        </aside>
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}