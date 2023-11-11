// Avoid TS check in this file
// @ts-nocheck

import React, {Ref, PropsWithChildren} from 'react';
import ReactDOM from 'react-dom';
import {cx, css} from '@emotion/css';
import {Box, useColorMode} from '@chakra-ui/react';

interface BaseProps {
  className: string;
  [key: string]: unknown;
}
type OrNull<T> = T | null;

const Button = React.forwardRef(
  (
    {
      className,
      active,
      reversed,
      ...props
    }: PropsWithChildren<
      {
        active: boolean;
        reversed: boolean;
      } & BaseProps
    >,
    ref: Ref<OrNull<HTMLSpanElement>>
  ) => {
    const {colorMode} = useColorMode();
    const bgColor = {light: 'white', dark: 'gray.800'};

    return (
      <Box
        as="span"
        bgColor={active ? bgColor[colorMode] : 'transparent'}
        cursor="pointer"
        _hover={colorMode === 'light' ? {bgColor: 'gray.200'} : {bgColor: 'gray.700'}}
        p={{base: '0rem', md: '0.4rem'}}
        m={{base: '0.2rem', md: '0.2rem'}}
        {...props}
        ref={ref}
      />
    );
  }
);

const Icon = React.forwardRef(
  (
    {className, ...props}: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLSpanElement>>
  ) => (
    <span
      {...props}
      ref={ref}
      className={cx(
        'material-icons',
        className,
        css`
          font-size: 18px;
          vertical-align: text-bottom;
        `
      )}
    />
  )
);

const Instruction = React.forwardRef(
  (
    {className, ...props}: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLDivElement>>
  ) => (
    <div
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          white-space: pre-wrap;
          margin: 0 -20px 10px;
          padding: 10px 20px;
          font-size: 14px;
          background: #f8f8e8;
        `
      )}
    />
  )
);

const Menu = React.forwardRef(
  (
    {className, colorMode, ...props}: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLDivElement>>
  ) => {
    const colorConfig = useColorMode();
    colorMode = colorMode || colorConfig.colorMode;
    const bgColor = {light: 'white', dark: 'gray.800'};
    const color = {light: 'black', dark: 'white'};

    return (
      <Box
        bgColor={bgColor[colorMode]}
        color={color[colorMode]}
        {...props}
        ref={ref}
        _style={{
          '&>*': {
            display: 'inline-block'
          }
        }}
        className={cx(
          className,
          css`
            & > * {
              display: inline-block;
            }

            & > * + * {
              margin-left: 15px;
            }
          `
        )}
      />
    );
  }
);

const Portal = ({children}) => {
  return typeof document === 'object'
    ? ReactDOM.createPortal(children, document.body)
    : null;
};

const Toolbar = React.forwardRef(
  (
    {className, ...props}: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLDivElement>>
  ) => (
    <Menu
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          position: relative;
          padding: 1px 18px 17px;
          margin: 0 -20px;
          border-bottom: 2px solid #eee;
          margin-bottom: 20px;
        `
      )}
    />
  )
);

Button.displayName = 'SlateButton';
Icon.displayName = 'SlateIcon';
Instruction.displayName = 'SlateInstruction';
Menu.displayName = 'SlateMenu';
Portal.displayName = 'SlatePortal';
Toolbar.displayName = 'SlateToolbar';

export {Button, Icon, Instruction, Menu, Portal, Toolbar};
