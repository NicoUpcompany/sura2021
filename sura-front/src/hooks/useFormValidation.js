import { useState } from "react";
import { minLengthValidation } from "../utils/formValidation";

export const useFormValidation = (initialState = {}) => {
	const [formValid, setFormValid] = useState(initialState);

	const inputValidation = async (e) => {
		const { name } = e.target;

		setFormValid({
			...formValid,
			[name]: minLengthValidation(e.target, 2),
		});
	};

	return [formValid, inputValidation, setFormValid];
};
