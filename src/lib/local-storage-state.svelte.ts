export function localStorageState<T>(key: string, defaultValue: T) {
	if (typeof localStorage === 'undefined') return { value: defaultValue };

	let value = $state(defaultValue);

	try {
		let valueInLocalStorage = localStorage.getItem(key);
		if (valueInLocalStorage) {
			if (typeof value === 'string') {
				value = valueInLocalStorage as T;
			} else if (typeof value === 'number') {
				value = parseFloat(valueInLocalStorage) as T;
			} else if (typeof value === 'object') {
				value = JSON.parse(valueInLocalStorage) as T;
			}
		}
	} catch (e) {
		localStorage.removeItem(key);
	}

	$effect(() => {
		console.log('Update localStorage  With value: ', value);

		if (typeof value === 'string') {
			localStorage.setItem(key, value as string);
		} else if (typeof value === 'number') {
			localStorage.setItem(key, String(value as number));
		} else if (typeof value === 'object') {
			localStorage.setItem(key, JSON.stringify(value));
		}
	});

	return {
		get value() {
			return value;
		},
		set value(v) {
			value = v;
		}
	};
}
