'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { loginUser, signupUser } from '../../../API'; // Adjust the import path according to your project structure

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('');
    const [gender, setGender] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isLogin) {
            const data = { username: email, password };
            try {
                const result = await loginUser(data);
                if (result.additionalData.status === 200) {
                    if (result.additionalData.type === 'patient') {
                        router.push('/patienthome');
                    } else {
                        console.log("normal doctor");
                    }
                } else {
                    alert('Invalid credentials');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        } else {
            const data = { username: email, password, type:userType, gender:gender, dob:dateOfBirth, blood_group:bloodGroup };
            try {
                const result = await signupUser(data);
                if (result.status === 200) {
                    alert('Signup successful! Please login.');
                    setIsLogin(true);
                } else {
                    alert('Signup failed. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-[350px]">
                <CardHeader>
                    <div className="flex justify-center space-x-2 mb-4">
                        <Button 
                            variant={isLogin ? "default" : "outline"}
                            onClick={() => setIsLogin(true)}
                        >
                            Login
                        </Button>
                        <Button 
                            variant={!isLogin ? "default" : "outline"}
                            onClick={() => setIsLogin(false)}
                        >
                            Signup
                        </Button>
                    </div>
                    <CardTitle>{isLogin ? 'Login' : 'Signup'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            {!isLogin && (
                                <>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="userType">User Type</Label>
                                        <Select onValueChange={setUserType}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="patient">Patient</SelectItem>
                                                <SelectItem value="doctor">Doctor</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="gender">Gender</Label>
                                        <Input
                                            id="gender"
                                            type="text"
                                            placeholder="Gender"
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="dob">Date of Birth</Label>
                                        <Input
                                            id="dob"
                                            type="date"
                                            value={dateOfBirth}
                                            onChange={(e) => setDateOfBirth(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="bloodGroup">Blood Group</Label>
                                        <Input
                                            id="bloodGroup"
                                            type="text"
                                            placeholder="Blood Group"
                                            value={bloodGroup}
                                            onChange={(e) => setBloodGroup(e.target.value)}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button type="submit" onClick={handleSubmit}>
                        {isLogin ? 'Login' : 'Signup'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}