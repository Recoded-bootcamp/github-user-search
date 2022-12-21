 const submit = document.querySelector('input[type="submit"]');

submit.addEventListener('click', (e) => {
	e.preventDefault();
	const searchTerm = document.querySelector('#search').value;
	const results = document.querySelector('#github-container');
	const userList = document.querySelector('#user-list');
	const repoList = document.querySelector('#repos-list');

	results.classList.remove('hidden')

	if (searchTerm === '') {
		userList.innerHTML = `<h2>Please enter a username in the search field</h2>`
		repoList.classList.add('hidden')
	} else {
		fetch(`https://api.github.com/search/users?q=${searchTerm}`)
			.then(res => res.json())
			.then(users => {
				const resultMessage = `
				<h2 class="text-3xl lg:ml-8">Users</h2>
				<h2 class="text-center lg:mr-8">Showing results for <strong>${searchTerm}</strong> • ${users.total_count} users</h2>
				`
				userList.insertAdjacentHTML('beforebegin', resultMessage)
				users.items.forEach(user => {
					const userProfile = `
						<li class="flex flex-col">
							<img src="${user.avatar_url}" alt="${user.login} avatar" width="48" height="48" class="w-48 h-48 rounded-lg">
							<h3 class="text-lg font-bold mt-4">${user.login}</h3>
							<a href="${user.html_url}" target="blank" class="underline decoration-transparent text-blue-600 dark:text-blue-400 hover:decoration-inherit transition duration-300 ease-in-out">View Profile</a>
							<a href="#repos-list" class="view-repos underline decoration-transparent text-blue-600 dark:text-blue-400 hover:decoration-inherit transition duration-300 ease-in-out" data-user="${user.login}">View Repositories</a>
						</li>
					`
					userList.insertAdjacentHTML('beforeend', userProfile)
				})

			})
			.then(() => {
				const viewRepos = document.querySelectorAll('.view-repos');
				viewRepos.forEach(repo => {
					repo.addEventListener('click', (e) => {
						const username = e.target.dataset.user;
						repoList.classList.remove('hidden')
						fetch(`https://api.github.com/users/${username}/repos`)
							.then(res => res.json())
							.then(repos => {
								const repoResults = `
								<h2 class="text-3xl lg:ml-8">Repositories</h2>
								<h2 class="text-center lg:mr-8">Showing ${repos.length} repositories of <strong>${username}</strong></h2>
								`
								repoList.insertAdjacentHTML('beforebegin', repoResults)	
								repos.forEach(repo => {
									const repoItem = `
										<li class="flex flex-col w-full">
												<h3 class="text-lg font-bold mt-4">${repo.name}</h3>
												<p class="text-gray-600 dark:text-gray-200">${repo.description ? `${repo.description}, and it ` : ''}has ${repo.stargazers_count} stars.</p>
												<p class="text-gray-600 dark:text-gray-200">Created on <span class="italic">${repo.created_at.slice(0, 10)}</span>, and last updated on <span class="italic">${repo.updated_at.slice(0, 10)}</span>.</p>
												<a href="${repo.html_url}" target="blank" class="underline decoration-transparent text-blue-600 dark:text-blue-400 hover:decoration-inherit transition duration-300 ease-in-out">View Repository</a>
										</li>
								`
									repoList.insertAdjacentHTML('beforeend', repoItem)
								})
							})
					})
				})
			})
	}
});
