#!/usr/bin/env deno test
import { assertEquals } from "https://deno.land/std@0.102.0/testing/asserts.ts";
import OrderedMap from './index.ts';

// immutable value.
const m = OrderedMap.from({a: 1, b: 2});

Deno.test("remove", () => {
	const removeNotExisted = m.remove('c');
	assertEquals(removeNotExisted, m);

	const removeExisted = m.remove('a');
	assertEquals(removeExisted.content, ['b', 2]);
})

Deno.test('update', () => {
	const m2 = m.update('a', 3);
	assertEquals(m2.content, ['a', 3, 'b',2]);
	const m3 = m.update('a', 4, 'c');
	assertEquals(m3.content, ['c', 4, 'b',2]);
	const m4 = m.update('d', 5);
	assertEquals(m4.content, ['a', 1, 'b',2, 'd', 5]);
	const m5 = m.update('e', 6, 'f');
	assertEquals(m5.content, ['a', 1, 'b',2, 'f', 6]);
})

Deno.test("addToStart", () => {
	const m2 = m.addToStart('c', 3)
	assertEquals(m2.content, ['c',3, 'a', 1, 'b',2]);
})

Deno.test("addToEnd", () => {
	const m2 = m.addToEnd('c', 3)
	assertEquals(m2.content, ['a', 1, 'b',2,'c',3]);
})

Deno.test("addBefore", () => {
	const m2 = m.addBefore('c', 'd', 3);
	assertEquals(m2.content, ['a', 1, 'b', 2, 'd', 3]);

	const m3 = m.addBefore('b', 'e', 4);
	assertEquals(m3.content, ['a', 1, 'e', 4, 'b',2]);
})

Deno.test('size', () => {
	assertEquals(m.size, 2)
})

Deno.test('subtract', () => {
	const m2 = m.subtract({a: 2, c: 3});
	assertEquals(m2.content, ['b', 2]);
})

Deno.test('prepend', () => {
	assertEquals(m, m.prepend({}));
	const m2 = m.prepend({a:3, c:4});
	assertEquals(m2.content, ['a', 3, 'c', 4, 'b', 2]);
})

Deno.test('append', () => {
	assertEquals(m, m.append({}));
	const m2 = m.append({a:3, c:4});
	assertEquals(m2.content, ['b', 2, 'a', 3, 'c', 4]);
})