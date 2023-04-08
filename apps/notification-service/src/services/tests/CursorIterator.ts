export class CursorIterator<T> {
  elements: T[];
  index = 0;

  constructor(elements: T[]) {
    this.elements = elements;
  }

  public next() {
    return this.elements[this.index++];
  }
}
