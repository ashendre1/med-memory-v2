'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogOut, BarChart, Upload, FileText, UserPlus } from 'lucide-react'
import getReports from '@/components/services/getReports'
import { checkSession, user_logout } from '../../../API';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import getdoctorService from '@/components/services/getdoctorService'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import add_doctorservice from '@/components/services/add_doctorservice'

export default function PatientHome() {

  const[doctors_list, setDoctorsList] = useState([])
const [selectedDoctor, setSelectedDoctor] = useState("")
  
    const [activeSection, setActiveSection] = useState('graph');
    const [showUpload, setShowUpload] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<any>(null); // Store user details
    const router = useRouter();
    const api_plot= "http://localhost:8501?username=" + user
    const [formData, setFormData] = useState({
      hemoglobin: '',
      RBC: '',
      platelets: '',
      date: '',
      medicines_taken:'',
      username:''
    });
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
            router.push('/Login'); // Redirect to login if not authenticated
          }
        } catch (error) {
          console.error('Error checking session:', error);
          router.push('/Login'); // Redirect to login on error
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
        setFormData({
        hemoglobin: response.data.Hemoglobin || '',
        RBC: response.data.RBC || '',
        platelets: response.data.Platelet || '',
        date: new Date().toISOString().split('T')[0],
        medicines_taken:'',
        username: user
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
      const response = await axios.post('http://localhost:9090/reports/addReportForMe', formData);
      console.log('Edits submitted successfully:', response.data);
    } catch (error) {
      console.error('Error submitting edits:', error);
    }
  };

 
    const [doctorName, setDoctorName] = useState('');
    const [doctorSpecialty, setDoctorSpecialty] = useState('');
    const [doctorPhone, setDoctorPhone] = useState('');
    const [doctorEmail, setDoctorEmail] = useState('');
  
  
    const handleSubmitadddoc = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (selectedDoctor != ""){
        try {
            add_doctorservice.addthedoc(selectedDoctor).then((dumy_data: any) => {
                console.log(dumy_data);
              });

          } catch (error) {
            console.error('Error adding doctor:', error);
          }
      }
    };

    const handleLogout = () => {
        const logout = async () => {
            try {
                const result = await user_logout();
                if (result.status === 200) {
                    console.log(result.data.message); // Log the JSON response message
                    window.location.reload(); // Reload the page after successful logout
                }
            } catch (error) {
                console.error('Error logging out:', error);
            }
        };

        logout();
    };

    fetch('http://localhost:9090/prescription/getMyPrescription?user='+user)
            .then(response => response.json())
            .then(data => {
                const imgElement = document.getElementById('prescriptionImage');
                imgElement.src = data.imageUrl;  // Set the image source
                console.log(data.imageUrl);
            })
            .catch(err => console.error('Error fetching image:', err));






    useEffect(() => {
        getdoctorService.getdocs().then((doc_data: any) => {
            setDoctorsList(doc_data.names);
          });
          console.log("doctorslist call")

    },[])

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
                  name="platelets"
                  value={formData.platelets}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="medicines">Medicines (separated by commas)</Label>
                <Input
                  id="medicines"
                  type="text"
                  name="medicines_taken"
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
                  name="date"
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
              
              <img id="prescriptionImage" alt="Prescription Image" />
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
              <Label htmlFor="doctor-select">Doctor's Name</Label>
              <Select onValueChange={setSelectedDoctor} value={selectedDoctor}>
                  <SelectTrigger id="doctor-select" className="w-full">
                  <SelectValue placeholder="Select a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                  {doctors_list.map((doctor) => (
                      <SelectItem key={doctor} value={doctor}>
                      {doctor}
                      </SelectItem>
                  ))}
                  </SelectContent>
              </Select>
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