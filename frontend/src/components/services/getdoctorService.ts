class getallDoctors {
	public async getdocs(zipCode: string | null = "10001") {
      
		return fetch(
			process.env.NEXT_PUBLIC_BACKEND_URI! +
				`doctorlist/getAllDoctors`
		)
			.then((res) => res.json())
			.then((data) => {
				return data;
			});
	}
}

export default new getallDoctors();