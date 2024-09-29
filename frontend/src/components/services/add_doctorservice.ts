class add_doctorservice {
	public async addthedoc(doctorName: string | null = "d") {
        console.log(doctorName)
        console.log(JSON.stringify(doctorName))
      
		return fetch(
			process.env.NEXT_PUBLIC_BACKEND_URI! +
				`register/addPatientToDoctor`,{
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ doctorName : doctorName })
                }
                
		)
			.then((res) => res.json())
			.then((data) => {
				return data;
			});
	}
}

export default new add_doctorservice();