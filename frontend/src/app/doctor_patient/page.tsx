'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LogOut, BarChart2, Upload, FileText, MessageSquare } from 'lucide-react'
import { useRouter } from 'next/router'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'

// Mock data for the graph


export default function DoctorPage() {

    const searchParams = useSearchParams()
    const patient = searchParams.get('patient')
    console.log(patient)
    const api_plot= "http://localhost:8501?username=" + patient
    const chat_plot= "http://localhost:8502?username=" + patient
  const [activeSection, setActiveSection] = useState('graph')
  const [chatInput, setChatInput] = useState('')
  const [formData, setFormData] = useState({
    hemoglobin: '',
    RBC: '',
    platelets: '',
    date: '',
    username:'',
    medicines_taken:''
  })
  
  const [chatMessages, setChatMessages] = useState([
    { role: 'system', content: 'Hello! I\'m your medical assistant. How can I help you today?' }
  ])

  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logout clicked')
  }
  const uploadFile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior

    const formData = new FormData(event.currentTarget); // Automatically capture all form fields
    formData.append('username' , patient)
    console.log('yellow', formData)
    try {
      console.log('Start');
      const response = await axios.post('http://127.0.0.1:9090/prescription/uploadPrescriptionForUser', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Make sure this is set for file uploads
        },
      });
      console.log('Upload response:', response);
      alert('Upload successful!');
    } catch (error) {
      console.error('Error uploading prescription:', error);
    }
  }
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event)
    const file = event.target.files[0];
    if (!file) {
        console.error("No file selected.");
        return;
    }

    console.log('Selected file:', file);

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      console.log('Start');
      const response = await axios.post('http://127.0.0.1:8000/upload', uploadFormData);

      console.log('Upload response:', response);
      setFormData({
        hemoglobin: response.data.Hemoglobin || '',
        RBC: response.data.RBC || '',
        platelets: response.data.Platelet || '200',
        date: new Date().toISOString().split('T')[0],
        username: '',
        medicines_taken:'Paracitamol'
      });
    } catch (error) {
      console.error('Error uploading file:', error);
    }
};

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData({
    ...formData,
    [name]: value,
  });
};

const handleFormSubmit = async (e) => {
  e.preventDefault();
  console.log('Edited data to submit:', formData);

  try {

    formData['username']=patient;

    const response = await axios.post('http://localhost:9090/reports/addReportForUser', formData);
    alert('Upload successful!');
  } catch (error) {
    console.error('Error submitting edits:', error);
  }
};


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
        <iframe
            src= {api_plot}
            width="100%"
            height="600px"
            frameBorder="0"
            title="Visualization"
          ></iframe>
      )
      case 'uploadReport':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Upload Medical Reports</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="space-y-2">
          <Label htmlFor="file-upload">Upload File</Label>
          <Input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
          />
        </div>

        {formData && (<form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hemoglobin">Hemoglobin</Label>
                <Input
                  id="hemoglobin"
                  type="text"
                  name="Hemoglobin"
                  value={formData.hemoglobin}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rbc">RBC</Label>
                <Input
                  id="rbc"
                  type="text"
                  name="RBC"
                  value={formData.RBC}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="platelet">Platelet</Label>
                <Input
                  id="platelet"
                  type="text"
                  name="Platelet"
                  value={formData.platelets}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="medicines">Medicines (separated by commas)</Label>
                <Input
                  id="medicines"
                  type="text"
                  name="Medicines"
                  value={formData.medicines_taken}
                  placeholder="e.g., Paracetamol, Ibuprofen"
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="testDate">Test Date</Label>
                <Input
                  id="testDate"
                  type="date"
                  name="TestDate"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>
              
              <Button type="submit" className="w-full">Submit Edits</Button>
            </form>
            )}
          </CardContent>
          </Card>
        )
      case 'currentPrescription':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Current Prescription</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Lisinopril 10mg - 1 tablet daily</li>
                <li>Metformin 500mg - 1 tablet twice daily with meals</li>
                <li>Atorvastatin 20mg - 1 tablet at bedtime</li>
                <li>Aspirin 81mg - 1 tablet daily</li>
              </ul>
            </CardContent>
          </Card>
        )
      case 'addDoctors':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Add New Doctor</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="doctor-name">Doctor's Name</Label>
                  <Input id="doctor-name" placeholder="Dr. John Doe" />
                </div>
                <div>
                  <Label htmlFor="doctor-specialty">Specialty</Label>
                  <Input id="doctor-specialty" placeholder="e.g., Cardiologist, Neurologist" />
                </div>
                <div>
                  <Label htmlFor="doctor-phone">Phone Number</Label>
                  <Input id="doctor-phone" type="tel" placeholder="(123) 456-7890" />
                </div>
                <div>
                  <Label htmlFor="doctor-email">Email</Label>
                  <Input id="doctor-email" type="email" placeholder="doctor@example.com" />
                </div>
                <Button type="submit" onClick={handleSubmitadddoc}>Add Doctor</Button>
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
            <form className="space-y-4" onSubmit={uploadFile} encType="multipart/form-data">
              <div>
                <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">Upload File</label>
                <input
                  id="file-upload"
                  name="image" // Ensure the name matches the backend's expected parameter for the image
                  type="file"
                  className="mt-1"
                  required // Make the file selection required
                />
              </div>
              <div>
                <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">Special Instructions</label>
                <textarea
                  id="instructions"
                  name="diagnosis" // Ensure this matches the expected text input
                  placeholder="Enter Description"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
                Upload Prescription
              </button>
            </form>

            </CardContent>
          </Card>
        )
      case 'chat':
        return (
          <iframe
              src= {chat_plot}
              width="100%"
              height="600px"
              frameBorder="0"
              title="Visualization"
            ></iframe>
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