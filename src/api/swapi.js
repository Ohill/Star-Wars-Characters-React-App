import axios from 'axios';

const baseUrl = process.env.REACT_APP_SWAPI_URL_API;

export const swapi = {
    getCharacters(page) {
		return new Promise((resolve, reject) => {
            axios({
                method: 'get',
                url: `${baseUrl}/people/?page=${page}`,
            })
                .then(response => {
                    if (response.status === 200 && response.data.results) {
                        resolve({
                            success: true,
                            characters: response.data.results,
                            next: response.data.next,
                        });
                    } else {
                        resolve({
                            success: false,
                            error: 'Unable to retrieve characters.',
                        });
                    }
                })
                .catch(err => {
					if (err && err.response && err.response.data && err.response.data.message) {
						reject({ success: false, error: err.response.data.message, });
					} else {
						reject({ success: false, error: 'Something went wrong, please try again.' });
					}
				});
		});
	},
    getFilms() {
		return new Promise((resolve, reject) => {
            axios({
                method: 'get',
                url: `${baseUrl}/films/`,
            })
                .then(response => {
                    if (response.status === 200 && response.data.results) {
                        resolve({
                            success: true,
                            films: response.data.results,
                        });
                    } else {
                        resolve({
                            success: false,
                            error: 'Unable to retrieve films.',
                        });
                    }
                })
                .catch(err => {
					if (err && err.response && err.response.data && err.response.data.message) {
						reject({ success: false, error: err.response.data.message, });
					} else {
						reject({ success: false, error: 'Something went wrong, please try again.' });
					}
				});
		});
	},
    getSpecies(id) {
		return new Promise((resolve, reject) => {
            axios({
                method: 'get',
                url: `${baseUrl}/species/${id}/`,
            })
                .then(response => {
                    if (response.status === 200 && response.data) {
                        resolve({
                            success: true,
                            species: response.data,
                        });
                    } else {
                        resolve({
                            success: false,
                            error: 'Unable to retrieve species.',
                        });
                    }
                })
                .catch(err => {
					if (err && err.response && err.response.data && err.response.data.message) {
						reject({ success: false, error: err.response.data.message, });
					} else {
						reject({ success: false, error: 'Something went wrong, please try again.' });
					}
				});
		});
	},
    getStarShip(id) {
		return new Promise((resolve, reject) => {
            axios({
                method: 'get',
                url: `${baseUrl}/starships/${id}/`,
            })
                .then(response => {
                    if (response.status === 200 && response.data) {
                        resolve({
                            success: true,
                            starShip: response.data,
                        });
                    } else {
                        resolve({
                            success: false,
                            error: 'Unable to retrieve star ship.',
                        });
                    }
                })
                .catch(err => {
					if (err && err.response && err.response.data && err.response.data.message) {
						reject({ success: false, error: err.response.data.message, });
					} else {
						reject({ success: false, error: 'Something went wrong, please try again.' });
					}
				});
		});
	},
};
