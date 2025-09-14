type BaseOptions = {
	persistedType: StorageKind;
	onError?: (err: unknown) => void;
};

type StorageKind = 'localstorage' | 'sessionstorage';
function resolveStorage(spec: StorageKind | Storage | undefined): Storage | null {
	if (typeof globalThis === 'undefined') return null;
	if (!spec || spec === 'localstorage') return (globalThis as any).localStorage ?? null;
	if (spec === 'sessionstorage') return (globalThis as any).sessionStorage ?? null;
	return spec;
}

//Overloads
export function persistedState<T>(
	key: string,
	defaultValue: T,
	options: BaseOptions & {
		manualUpdate: true;
	}
): { value: T; updateStorage: () => void; cleanup: () => void };

export function persistedState<T>(
	key: string,
	defaultValue: T,
	options?: BaseOptions & {
		manualUpdate?: false | undefined;
	}
): { value: T; cleanup: () => void };

//Implementation
export function persistedState<T>(
	key: string,
	defaultValue: T,
	options: BaseOptions & { manualUpdate?: boolean } = {
		persistedType: 'localstorage'
	}
) {
	const parse = (s: string): T => /*options.parse ? options.parse(s) :*/ JSON.parse(s) as T;

	const serialize = (v: T): string =>
		/*options.serialize ? options.serialize(v) :*/ JSON.stringify(v);

	const safe = <R>(fn: () => R): R | undefined => {
		try {
			return fn();
		} catch (error) {
			options.onError?.(error);
			return undefined;
		}
	};

	const storage = resolveStorage(options.persistedType);

	let value = $state(defaultValue);

	let rootCleanup: () => void = () => {};
	if (storage) {
		let raw = safe(() => storage.getItem(key));
		if (raw !== null && raw !== undefined) {
			const parsed = safe(() => parse(raw));
			if (parsed !== undefined) value = parsed;
		}
	}

	if (!options.manualUpdate) {
		if ($effect.tracking()) {
			$effect(() => {
				updateStorage();
			});
		} else {
			rootCleanup = $effect.root(() => {
				$effect(() => {
					updateStorage();
				});
			});
		}
	}

	function updateStorage() {
		if (!storage) return;
		safe(() => storage.setItem(key, serialize(value)));
	}

	const base = { cleanup: rootCleanup } as { cleanup: typeof rootCleanup };

	if (options.manualUpdate) {
		return {
			...base,
			updateStorage,
			get value() {
				return value;
			},
			set value(v) {
				value = v;
			}
		};
	}
	return {
		...base,
		get value() {
			return value;
		},
		set value(v) {
			value = v;
		}
	};
}
