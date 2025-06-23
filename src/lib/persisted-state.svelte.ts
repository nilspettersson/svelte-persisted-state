//Overloads
export function persistedState<T>(
	key: string,
	defaultValue: T,
	options: { persistedType: 'localstorage' | 'sessionstorage'; manualUpdate: true }
): { value: T; updateStorage: () => void };

export function persistedState<T>(
	key: string,
	defaultValue: T,
	options?: { persistedType: 'localstorage' | 'sessionstorage'; manualUpdate?: false | undefined }
): { value: T };

//Implementation
export function persistedState<T>(
	key: string,
	defaultValue: T,
	options: { persistedType: 'localstorage' | 'sessionstorage'; manualUpdate?: boolean } = {
		persistedType: 'localstorage',
		manualUpdate: false
	}
) {
	if (typeof localStorage === 'undefined') {
		if (options.manualUpdate === true) {
			return { value: defaultValue, updateStorage: () => {} };
		} else {
			return { value: defaultValue };
		}
	}

	let value = $state(defaultValue);

	const storage = options.persistedType === 'localstorage' ? localStorage : sessionStorage;

	try {
		sessionStorage;
		let valueInLocalStorage = storage.getItem(key);
		if (valueInLocalStorage) {
			if (typeof value === 'string') {
				value = valueInLocalStorage as T;
			} else if (typeof value === 'number') {
				value = parseFloat(valueInLocalStorage) as T;
			} else if (typeof value === 'object') {
				value = JSON.parse(valueInLocalStorage) as T;
			} else if (typeof value === 'boolean') {
				value = (valueInLocalStorage === 'true') as T;
			}
		}
	} catch (e) {
		storage.removeItem(key);
	}
	if (!options.manualUpdate) {
		$effect(() => {
			updateStorage();
		});
	}

	function updateStorage() {
		console.log('Update localStorage With value: ', value);

		if (typeof value === 'string') {
			storage.setItem(key, value as string);
		} else if (typeof value === 'number') {
			storage.setItem(key, String(value as number));
		} else if (typeof value === 'object') {
			storage.setItem(key, JSON.stringify(value));
		}
	}
	if (options.manualUpdate) {
		return {
			get value() {
				return value;
			},
			set value(v) {
				value = v;
			},
			updateStorage
		};
	} else {
		return {
			get value() {
				return value;
			},
			set value(v) {
				value = v;
			}
		};
	}
}
