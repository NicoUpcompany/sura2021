export function minLengthValidation(inputData, minLength) {
	const { value } = inputData;

	if (value.trim().length >= minLength) {
		inputData.value = value;
		return true;
	} else {
		inputData.value = value.trim();
		return false;
	}
}

export function emailValidation(inputData) {
	// eslint-disable-next-line no-useless-escape
	const emailValid = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	const { value } = inputData;

	const resultValidation = emailValid.test(value);
	if (resultValidation) {
		return true;
	} else {
		return false;
	}
}

export function phoneValidation(inputData) {
	const phoneValid = /^[0-9\b]+$/;
	const { value } = inputData;

	const resultValidation = phoneValid.test(value);
	if (resultValidation) {
		return true;
	} else {
		return false;
	}
}

export function uppercaseValidation(inputData, minLength) {
	const { value } = inputData;

	if (value.trim().length >= minLength) {
		inputData.value = value.toString().toUpperCase();
		return true;
	} else {
		inputData.value = value.trim().toString().toUpperCase();
		return false;
	}
}

export function rutValidation(inputData) {
	let value = inputData.value.replace(".", "");
	value = value.replace("-", "");

	const body = value.slice(0, -1);
	let dv = value.slice(-1).toUpperCase();

	inputData.value = body + "-" + dv;

	let rut = inputData.value;
	if (rut.toString().trim() !== "" && rut.toString().indexOf("-") > 0) {
		const characters = [];
		const serie = [2, 3, 4, 5, 6, 7];
		const dig = rut.toString().substr(rut.toString().length - 1, 1);
		rut = rut.toString().substr(0, rut.toString().length - 2);

		for (let i = 0; i < rut.length; i++) {
			characters[i] = parseInt(rut.charAt(rut.length - (i + 1)));
		}

		let summation = 0;
		let k = 0;
		let rest = 0;

		for (let j = 0; j < characters.length; j++) {
			if (k === 6) {
				k = 0;
			}
			summation += parseInt(characters[j]) * parseInt(serie[k]);
			k++;
		}

		rest = summation % 11;
		dv = 11 - rest;

		if (dv === 10) {
			dv = "K";
		} else if (dv === 11) {
			dv = 0;
		}

		if (
			dv.toString().trim().toUpperCase() ===
			dig.toString().trim().toUpperCase()
		)
			return true;
		else return false;
	} else {
		return false;
	}
}
