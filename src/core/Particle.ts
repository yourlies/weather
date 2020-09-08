interface particle {
  say: Function;
}

class Particle implements particle {
  say() {
    console.log(2);
  }
}
export default Particle;
