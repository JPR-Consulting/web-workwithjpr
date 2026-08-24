import React from 'react';
import { useMagnetic } from '../hooks/useMagnetic';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  as?: 'button';
}
interface AnchorProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  as: 'a';
}
type Props = ButtonProps | AnchorProps;

/** Magnetischer Button/Link — Wrapper um useMagnetic für Nav/Hero/CTA-Buttons. */
const MagneticButton: React.FC<Props> = (props) => {
  const ref = useMagnetic<HTMLButtonElement | HTMLAnchorElement>();

  if (props.as === 'a') {
    const { as: _as, ...rest } = props;
    return <a ref={ref as React.RefObject<HTMLAnchorElement>} {...rest} />;
  }
  const { as: _as, ...rest } = props as ButtonProps;
  return <button ref={ref as React.RefObject<HTMLButtonElement>} {...rest} />;
};

export default MagneticButton;
