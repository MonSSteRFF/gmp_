import { wrap } from '@motionone/utils';
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { useRef } from 'react';

function ParallaxText({ children, baseVelocity = 100 }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 2000], [0, 5], {
    clamp: false,
  });

  /**
   * This is a magic wrapping for the length of the text - you
   * have to replace for wrapping that works for you or dynamically
   * calculate
   */
  const l = children.length;
  const x = useTransform(baseX, (v) => `${wrap(-l, -l + 25, v)}%`);

  const directionFactor = useRef(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    /**
     * This is what changes the direction of the scroll once we
     * switch scrolling directions.
     */
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  /**
   * The number of times to repeat the child text should be dynamically calculated
   * based on the size of the text and viewport. Likewise, the x motion value is
   * currently wrapped between -20 and -45% - this 25% is derived from the fact
   * we have four children (100% / 4). This would also want deriving from the
   * dynamically generated number of children.
   */
  return (
    <div className='parallax'>
      <motion.div className='scroller' style={{ x }}>
        <span className='text-3xl md:text-7xl odd:text-blue-600  font-medium whitespace-nowrap mr-4'>{children}</span>
        <span className='text-3xl md:text-7xl odd:text-blue-600  font-medium whitespace-nowrap mr-4'>{children}</span>
        <span className='text-3xl md:text-7xl odd:text-blue-600  font-medium whitespace-nowrap mr-4'>{children}</span>
        <span className='text-3xl md:text-7xl odd:text-blue-600  font-medium whitespace-nowrap mr-4'>{children}</span>
      </motion.div>
    </div>
  );
}

const Values = ({ data }) => {
  return (
    <section className='section section--md'>
      <ParallaxText baseVelocity={-2}>Fitness Clarity Creativity Health Networking</ParallaxText>
      <ParallaxText baseVelocity={2}>Communication Stress reduction Adaptability Organization</ParallaxText>
      <ParallaxText baseVelocity={-2}>Growth Productivity Advancement Knowledge</ParallaxText>
      <ParallaxText baseVelocity={2}>Satisfaction Balance Empowerment Fulfillment</ParallaxText>
    </section>
  );
};

export default Values;
