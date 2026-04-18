export enum AnimationState {
  Running,
  Suspended
}

type AnimationInfo = {
  fn: () => void
  previousTimestamp: number
  allowedFrameTime?: number
  currentMode: AnimationState
}

class AnimationBatcher {
  handlerStates: Map<symbol, AnimationInfo> = new Map();
  masterHandler: number = 0;
  boundRun = this.run.bind(this)

  constructor() {}

  runAnimations() {
    if (this.masterHandler !== 0) {
      return;
    }
    this.masterHandler = this.run();
  }

  /**
   * @description An initial version of batch animation running at once.
   * @returns void
   */
  private run() {
    for (const [key, animationHandle] of this.handlerStates) {
      const currentTimestamp = performance.now();

      if (
        animationHandle.currentMode === AnimationState.Running &&
        (
          !animationHandle.allowedFrameTime || 
          (animationHandle.allowedFrameTime <= currentTimestamp - animationHandle.previousTimestamp)
        )
      ) {
        animationHandle.fn();

        // TODO: Optimize this do while loop in one operation.
        if (animationHandle.allowedFrameTime) {
          do {
            animationHandle.previousTimestamp += animationHandle.allowedFrameTime;
          } while (animationHandle.allowedFrameTime <= currentTimestamp - animationHandle.previousTimestamp);
        } else {
          animationHandle.previousTimestamp = currentTimestamp;
        }
      }
    }

    this.masterHandler = requestAnimationFrame(this.boundRun);
    return this.masterHandler;
  }

  stopAnimation() {
    if (this.masterHandler === 0) {
      return;
    }
    cancelAnimationFrame(this.masterHandler);
    this.masterHandler = 0;
  }

  /**
   * @description Adds animation handler to run
   * @param fn function to run on `requestAnimationFrame`
   * @returns unique identifier for this handler
   */
  addAnimationHandler(fn: () => void): symbol {
    const animationSymbolHandler = Symbol();

    this.handlerStates.set(animationSymbolHandler, {
      fn,
      previousTimestamp: performance.now(),
      currentMode: AnimationState.Running,
    });

    return animationSymbolHandler;
  }

  /**
   * @description Set animation frame rate.
   * @param handlerSymbol Unique identifier to set refresh rate
   * @param frame frame frequency in Hertz.
   */
  setAnimationFrameRate(handlerSymbol: symbol, frame: number) {
    const handler = this.handlerStates.get(handlerSymbol);

    if (handler) {
      handler.allowedFrameTime = 1000 / frame;
      this.handlerStates.set(handlerSymbol, handler);
    }
  }

  /**
   * @description Remove animation.
   * @param handlerSymbol Unique identifier
   */
  removeAnimationHandler(handlerSymbol: symbol) {
    this.handlerStates.delete(handlerSymbol);
  }

  /**
   * @description Suspend running animation, if already suspended, 
   * keeps suspended.
   * @param handlerSymbol animation handler.
   */
  suspendAnimation(handlerSymbol: symbol) {
    const handler = this.handlerStates.get(handlerSymbol);

    if (handler) {
      handler.currentMode = AnimationState.Suspended;
      this.handlerStates.set(handlerSymbol, handler);
    }
  }

  /**
   * @description Resumes running animation, if already resumed, 
   * does nothing.
   * @param handlerSymbol animation handler.
   */
  resumeAnimation(handlerSymbol: symbol) {
    const handler = this.handlerStates.get(handlerSymbol);

    if (handler) {
      handler.currentMode = AnimationState.Running;
      this.handlerStates.set(handlerSymbol, handler);
    }
  }
};

export const animationBatcher = new AnimationBatcher();
