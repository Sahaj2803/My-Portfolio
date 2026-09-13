import React, { useRef, useEffect, isValidElement, cloneElement } from 'react';
import { createMagneticEffect } from '../lib/animations';

/**
 * MagneticButton
 *
 * A non-invasive magnetic wrapper. It never renders its own interactive
 * element on top of another one - that produces invalid, inaccessible
 * markup like <button><a>...</a></button>.
 *
 * - If it wraps a single native interactive element (<a> or <button>),
 *   the magnetic ref + physics are attached directly to that element via
 *   cloneElement, so the DOM only ever contains the one real element.
 * - Otherwise (e.g. plain text/nodes, as used for the nav links), it
 *   renders its own polymorphic element ("as" prop, default "button") and
 *   forwards any handlers/props it was given.
 *
 * Keyboard accessibility, focus rings, and click behavior all belong to
 * the single real element - nothing here hijacks them.
 */
const MagneticButton = ({
  children,
  className,
  as: Tag = 'button',
  strength,
  radius,
  ...props
}) => {
  const ownRef = useRef(null);
  const childRef = useRef(null);

  const onlyChild = React.Children.count(children) === 1 ? children : null;
  const wrapsInteractiveChild =
    isValidElement(onlyChild) &&
    (onlyChild.type === 'a' || onlyChild.type === 'button');

  const activeRef = wrapsInteractiveChild ? childRef : ownRef;

  useEffect(() => {
    const el = activeRef.current;
    if (!el) return;

    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const cleanup = createMagneticEffect(el, {
      ...(strength !== undefined ? { strength } : {}),
      ...(radius !== undefined ? { radius } : {}),
    });
    return () => {
      if (cleanup) cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wrapsInteractiveChild]);

  if (wrapsInteractiveChild) {
    const existingRef = onlyChild.props.ref ?? onlyChild.ref;

    return cloneElement(onlyChild, {
      ref: (node) => {
        childRef.current = node;
        if (typeof existingRef === 'function') existingRef(node);
        else if (existingRef && typeof existingRef === 'object') {
          existingRef.current = node;
        }
      },
      className: [onlyChild.props.className, className].filter(Boolean).join(' '),
    });
  }

  return (
    <Tag ref={ownRef} className={className} {...props}>
      {children}
    </Tag>
  );
};

export default MagneticButton;
