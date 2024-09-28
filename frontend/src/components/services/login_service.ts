class login_service {
	public async getLoginService(zipCode: string | null = "10001") {
      
		return fetch(
			process.env.NEXT_PUBLIC_BACKEND_URI! +
				`/register/authenticate`
		)
			.then((res) => res.json())
			.then((data) => {
				// console.log(data.data)
				return data;
			});
	}
}

export default new login_service();