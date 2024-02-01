/* eslint-disable @typescript-eslint/ban-types */
function testFn(name: string) {
  return (target: Object, key: string, decorator: any) => {
    // getName
    const fn = decorator.value;

    console.log(name, key, decorator.value);
    console.log(target.hasOwnProperty(key));

    fn();
  };
}

class A {
  @testFn('hello')
  getName() {}
}
