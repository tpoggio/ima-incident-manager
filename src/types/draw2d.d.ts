declare module '@sarhanalaa/draw2d' {
  export class Canvas {
    constructor(id: string, width: number, height: number);
    add(figure: Figure, x?: number, y?: number): void;
    destroy(): void;
  }

  export class Figure {
    add(child: Figure, locator: Locator): void;
    on(event: string, callback: () => void): void;
    createPort(type: string, locator: Locator): Port;
  }

  export class Port {
    setLocator(locator: Locator): void;
  }

  export class Locator {}

  export class Connection extends Figure {
    constructor(options?: {
      router?: Router;
      stroke?: number;
      color?: string;
    });
    setSource(port: Port): void;
    setTarget(port: Port): void;
    setTargetDecorator(decorator: Decorator): void;
  }

  export class Router {}
  export class Decorator {}

  export namespace shape {
    namespace basic {
      class Rectangle extends Figure {
        constructor(options?: {
          width?: number;
          height?: number;
          radius?: number;
          bgColor?: string;
          stroke?: number;
          color?: string;
          cssClass?: string;
        });
      }

      class Label extends Figure {
        constructor(options?: {
          text?: string;
          stroke?: number;
          fontColor?: string;
          fontSize?: number;
        });
      }
    }
  }

  export namespace layout {
    namespace locator {
      class CenterLocator extends Locator {}
      class RightLocator extends Locator {}
      class LeftLocator extends Locator {}
      class TopLocator extends Locator {}
      class BottomLocator extends Locator {}
    }

    namespace connection {
      class DirectRouter extends Router {}
    }
  }

  export namespace decoration {
    namespace connection {
      class ArrowDecorator extends Decorator {}
    }
  }

  const draw2d: {
    Canvas: typeof Canvas;
    Connection: typeof Connection;
    shape: typeof shape;
    layout: typeof layout;
    decoration: typeof decoration;
  };

  export default draw2d;
}
