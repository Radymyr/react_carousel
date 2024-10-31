import React from 'react';
import './App.scss';
import Carousel from './components/Carousel/Carousel';
import Inputs from './components/Inputs/Inputs';
import { getShiftedArrayLeft, getShiftedArrayRight } from './utils';

interface State {
  images: string[];
  frameSize: number;
  itemWidth: number;
  step: number;
  animationDuration: number;
  infinity: boolean;
  position: number;
  activeIndex: number;
}

class App extends React.Component<{}, State> {
  state = {
    images: [
      './img/1.png',
      './img/2.png',
      './img/3.png',
      './img/4.png',
      './img/5.png',
      './img/6.png',
      './img/7.png',
      './img/8.png',
      './img/9.png',
      './img/10.png',
    ],

    frameSize: 3,
    itemWidth: 130,
    step: 3,
    animationDuration: 1000,
    infinity: false,

    position: 0,
    activeIndex: 0,
  };

  getInfinity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const turn = e.target.checked;

    this.setState({ infinity: turn });
  };

  setWidth = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value, 10);

    const MAX_WIDTH = screen.width / 4;
    const MIN_WIDTH = 10;

    if (!isNaN(newWidth)) {
      this.setState({ itemWidth: newWidth });
    }

    if (newWidth > MAX_WIDTH) {
      this.setState({ itemWidth: MAX_WIDTH });
    }

    if (newWidth < MIN_WIDTH) {
      this.setState({ itemWidth: MIN_WIDTH });
    }
  };

  setFrameSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value, 10);
    const MAX_SIZE = this.state.images.length;
    const MIN_SIZE = 1;

    if (!isNaN(newSize)) {
      this.setState({ frameSize: newSize });
    }

    if (newSize > MAX_SIZE) {
      this.setState({ frameSize: MAX_SIZE });
    }

    if (newSize < MIN_SIZE) {
      this.setState({ frameSize: MIN_SIZE });
    }
  };

  setStep = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStep = parseInt(e.target.value, 10);
    const MAX_STEP = this.state.images.length;
    const MIN_STEP = 1;

    if (!isNaN(newStep)) {
      this.setState({ step: newStep });
    }

    if (newStep > MAX_STEP) {
      this.setState({ step: MAX_STEP });
    }

    if (newStep < MIN_STEP) {
      this.setState({ step: MIN_STEP });
    }
  };

  setAnimationDuration = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDuration = parseInt(e.target.value, 10);
    const MAX_DURATION = 10000;
    const MIN_DURATION = 200;

    if (!isNaN(newDuration)) {
      this.setState({ animationDuration: newDuration });
    }

    if (newDuration > MAX_DURATION) {
      this.setState({ animationDuration: MAX_DURATION });
    }

    if (newDuration < MIN_DURATION) {
      this.setState({ animationDuration: MIN_DURATION });
    }
  };

  getNextSlide = () => {
    this.setState(preState => {
      const {
        itemWidth,
        step,
        position,
        activeIndex,
        frameSize,
        images,
        infinity,
      } = preState;

      const lastElementsIndex = images.length - (activeIndex + frameSize);

      const newPosition =
        position -
        itemWidth * (step > lastElementsIndex ? lastElementsIndex : step);

      return {
        images: getShiftedArrayRight(infinity, step, images),
        position: newPosition,
        activeIndex:
          activeIndex + (step > lastElementsIndex ? lastElementsIndex : step),
      };
    });
  };

  getPrevSlide = () => {
    this.setState(preState => {
      const { itemWidth, images, position, activeIndex, step, infinity } =
        preState;

      const newPosition =
        position + itemWidth * (step > activeIndex ? activeIndex : step);

      const newIndex = activeIndex - step < 0 ? 0 : activeIndex - step;
      const newImages = getShiftedArrayLeft(infinity, step, images);

      if (newPosition >= itemWidth * (images.length - step)) {
        return {
          images: newImages,
          position: itemWidth * (images.length - step),
          activeIndex: newIndex,
        };
      }

      return {
        position: newPosition,
        activeIndex: newIndex,
        images: newImages,
      };
    });
  };

  render() {
    const { images, itemWidth, frameSize, step, animationDuration, position } =
      this.state;

    return (
      <div className="App">
        {/* eslint-disable-next-line */}
        <h1 data-cy="title" className="title">
          Carousel with {images.length} images
        </h1>

        <Inputs
          setWidth={this.setWidth}
          itemWidth={itemWidth}
          setFrameSize={this.setFrameSize}
          frameSize={frameSize}
          setStep={this.setStep}
          step={step}
          getInfinity={this.getInfinity}
          setAnimationDuration={this.setAnimationDuration}
          animationDuration={animationDuration}
        />

        <Carousel
          images={images}
          itemWidth={itemWidth}
          frameSize={frameSize}
          nextButton={this.getNextSlide}
          prevButton={this.getPrevSlide}
          position={position}
          duration={animationDuration}
        />
      </div>
    );
  }
}

export default App;
