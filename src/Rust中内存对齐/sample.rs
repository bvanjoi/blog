struct A {
	i: i32,
	u1: u8,
	j: i32,
	u2: u8,
}

#[repr(C)]
struct B {
	i: i32,
	u1: u8,
	j: i32,
	u2: u8,	
}

fn main() {
	println!("The size of struct A: {:?}", std::mem::size_of::<A>()); // 12 
	println!("The size of struct B: {:?}", std::mem::size_of::<B>()); // 16
}