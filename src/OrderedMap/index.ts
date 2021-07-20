type MapLike<T = any> = Record<string, T> | OrderedMap<T>;

/**
 * 持久化数据结构 OrderedMap
 */
class OrderedMap<T = any> {
	// The form of content is similar with [key1, value1, key2, value2, ..., ].
	content: (T | string)[] = [];

	constructor(content: (T | string)[]) {
		this.content = content;
	}

	/**
	 * Find the key index in this.content. 
	 */
	private find = (key: string): number => {
		for (let i = 0; i < this.content.length; i += 2) {
			if (this.content[i] === key) {
				return i;
			}
		}
		return -1;
	}

	/**
	 * Create a new map by replacing the value of `key` with a 
	 * new value, or adding a binding to the end of the OrderedMap.
	 * If `newKey` is given, the key of the binding will be replaced with that key.
	 */
	update = (key: string, value: T, newKey?: string) => {
		const self = (newKey && newKey !== key) ? this.remove(newKey) : this;
		const found = self.find(key);
		const content = self.content.slice();
		if (found === -1) {
			content.push(newKey || key, value);
		} else {
			content[found + 1] = value;
			if (newKey) {
				content[found] = newKey;
			}
		}
		return new OrderedMap(content);
	}

	/**
	 * Return a OrderedMap with the given key removed, if it existed.
	 */
	remove = (key: string): OrderedMap<T> => {
		const found = this.find(key);
		if (found === -1) {
			return this;
		} else {
			let content = this.content.slice();
			content.splice(found, 2);
			return new OrderedMap(content);
		}
	}

	/**
	 * Add a new key to the start of the OrderedMap
	 */
	addToStart = (key: string, value : T): OrderedMap<T> => 
		new OrderedMap([key, value].concat(this.remove(key).content));

	/**
	 * Add a new key to the end of the OrderedMap.
	 */
	addToEnd = (key: string, value: T): OrderedMap<T> => {
		const content = this.remove(key).content.slice();
		content.push(key, value);
		return new OrderedMap(content);
	}

	/**
	 * Add a key after the given key. 
	 * If `place` is not found, the new key is added to the end.
	 */
	addBefore = (place: string, key: string, value: string) => {
		const without = this.remove(key);
		const content = without.content.slice();
		const found = without.find(place);
		if (found === -1) {
			content.push(key, value);
		} else {
			content.splice(found, 0, key, value);
		}
		return new OrderedMap(content)
	}

	/**
	 * Call the given function for each key/value pair in the map, in
	 * order.
	 */
	forEach = (f: (key: string, value: T) => any): void => {
		for (let i = 0; i < this.content.length; i += 2) {
			f(this.content[i] as string, this.content[i + 1] as T);
		}
	}

	/**
	 * Create a map containing all the keys in this OrderedMap that don't
	 * appear in `map`.
	 */
	subtract = (map: MapLike<T>) => {
		const m = OrderedMap.from(map);
		let result = this as OrderedMap<T>;
		for (let i = 0; i < m.content.length; i += 2) {
			result = result.remove(m.content[i] as string);
		}
		return result;
	}

	/**
	 * Create a new OrderedMap by prepending the keys in this map
	 * that don't appear in `map` before the keys in `map`. 
	 */
	prepend = (map: MapLike): OrderedMap<T> => {
		const m = OrderedMap.from(map);
		if (!m.size) {
			return this;
		} else {
			return new OrderedMap(m.content.concat(this.subtract(m).content))
		}
	}

	/**
	 * Create a new map by appending the keys in this OrderedMap that don't
	 * appear in `map` after the keys in `map`.
	 */
	append = (map: MapLike<T>) => {
		const m = OrderedMap.from(map);
		if (!m.size) {
			return this;
		} else {
			return new OrderedMap(this.subtract(m).content.concat(m.content));
		}
	}

	/**
	 * The amount of keys in the OrderedMap
	 */
	get size() {
		return this.content.length >> 1;
	}

	static from<T>(map: MapLike<T>): OrderedMap<T> {
		if (map instanceof OrderedMap) {
			return map;
		} else {
			const content = [];
			for (let key in map) {
				content.push(key, map[key]);
			}
			return new OrderedMap(content);
		}
	}
}

export default OrderedMap;
