'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogOut, BarChart, Upload, FileText, UserPlus } from 'lucide-react'
import getReports from '@/components/services/getReports'
import { checkSession } from '../../../API';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function PatientHome() {
  
    const [activeSection, setActiveSection] = useState('graph')

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<any>(null); // Store user details
    const router = useRouter();
    const api_plot= "http://localhost:8501?username=" + user
    // Check session on component load
    useEffect(() => {
      const verifySession = async () => {
        try {
          const result = await checkSession();
          if (result.status === 200) {
            setIsAuthenticated(true);
            console.log("is Authenticated" + result.user)
            setUser(result.user); // Store user details
          } else {
            router.push('/login'); // Redirect to login if not authenticated
          }
        } catch (error) {
          console.error('Error checking session:', error);
          router.push('/login'); // Redirect to login on error
        }
      };
  
      verifySession();
    }, [router]);

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
  
      } catch (error) {
        console.error('Error uploading file:', error);
      }
  };










 
    const [doctorName, setDoctorName] = useState('');
    const [doctorSpecialty, setDoctorSpecialty] = useState('');
    const [doctorPhone, setDoctorPhone] = useState('');
    const [doctorEmail, setDoctorEmail] = useState('');
  
    const handleSubmitadddoc = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      const doctorDetails = {
        name: doctorName,
        specialty: doctorSpecialty,
        phone: doctorPhone,
        email: doctorEmail,
      };
  
      try {
        getReports.getLinePts().then((dumy_data: any) => {
            console.log(dumy_data);
          });

      } catch (error) {
        console.error('Error adding doctor:', error);
      }
    };

  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logout clicked')
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
      case 'uploadReports':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Upload Medical Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="report-type">Report Type</Label>
                  <Input id="report-type" placeholder="e.g., Blood Test, X-Ray" />
                </div>
                <div>
                  <Label htmlFor="report-date">Report Date</Label>
                  <Input id="report-date" type="date" />
                </div>
                <div>
                  <Label htmlFor="report-file" >Upload File</Label>
                  <Input id="report-file" type="file" onChange={handleFileChange}/>
                </div>
                <Button type="submit" >Upload Report</Button>
              </form>
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
      default:
        return <div>Graph Content</div>
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <span className="text-lg font-semibold">Welcome, User</span>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 bg-muted p-4">
          <nav className="space-y-2">
            <Button
              variant={activeSection === 'graph' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveSection('graph')}
            >
              <BarChart className="mr-2 h-4 w-4" />
              Graph
            </Button>
            <Button
              variant={activeSection === 'uploadReports' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveSection('uploadReports')}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Reports
            </Button>
            <Button
              variant={activeSection === 'currentPrescription' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveSection('currentPrescription')}
            >
              <FileText className="mr-2 h-4 w-4" />
              Current Prescription
            </Button>
            <Button
              variant={activeSection === 'addDoctors' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveSection('addDoctors')}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add Doctors
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