class getReports {
	public async getLinePts(zipCode: string | null = "10001") {
      
		return fetch(
			process.env.NEXT_PUBLIC_BACKEND_URI! +
				`reports/getiReports`
		)
			.then((res) => res.json())
			.then((data) => {
				// console.log(data.data)
				return data;
			});
	}
}

export default new getReports();