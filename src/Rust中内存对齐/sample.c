#include <stdio.h>

struct ss {
 int i;
 char c;
 int j;
 char d;
} test = {
 1,
 'a',
 2,
 'b',
};

struct ss2 {
 int i;
 char c;
 char d;
 int j;
} test2 = {
 1,
 'a',
 'b',
 2,
};

int main() {
 printf("The size of test: %lu \n", sizeof(test)); // 16
 printf("The size of test2: %lu", sizeof(test2)); // 12
}