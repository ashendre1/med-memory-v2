'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LogOut, Users, Search, UserPlus, Calendar } from 'lucide-react'
import { getPatientDetails, checkSession } from '../../../API';
import { useRouter } from 'next/navigation';

// Mock patient data


export default function DoctorDashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [patients, setPatients] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null); // Store user details
  const router = useRouter();

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


  

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const retrievePatients =await getPatientDetails();
        console.log(retrievePatients)
        setPatients(retrievePatients);
      } catch (error){
        console.error(' failed to retreive patients', error);
      }
    }
    
    fetchPatients();
  }, []);

  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logout clicked')
  }
  const handleViewDetails = (username: any) => {
    router.push(`/doctor_patient?patient=${username}`);
  };



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
            <Button variant="secondary" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Patients
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              Appointments
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Patient
            </Button>
          </nav>
        </aside>
        <main className="flex-1 p-6">
          <div className="mb-6">
            <Input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
              icon={<Search className="h-4 w-4 text-gray-400" />}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients.map(patient => (
              <Card  onClick={() => handleViewDetails(patient.username)} key={patient.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
                  <CardTitle>{patient.username}</CardTitle>
                  <CardDescription className="text-gray-100">Date of Birth: {patient.dob}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <p><strong>Gender:</strong> {patient.gender}</p>
                  <p><strong>Blood Group:</strong> {patient.blood_group}</p>
                  <Button className="mt-4 w-full" variant="outline">View Details</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}