/* eslint-disable no-undef */
import React from 'react';
import PropTypes from 'prop-types';
import { Global, css } from '@emotion/core';
import ThemeProvider from '@chakra-ui/core/dist/ThemeProvider';
import CSSReset from '@chakra-ui/core/dist/CSSReset';
import originalTheme from '@chakra-ui/core/dist/theme';
import colors from './colors';
import fonts from './fonts';
import Analytics from './_analytics';
import Chatra from './_chatra';

export const codedayTheme = {
  ...originalTheme,
  colors,
  fonts,
  cognito: {
    // eslint-disable-next-line no-secrets/no-secrets
    id: '7hYXr3TPxk6yIpJxjqVoFQ',
  },
  chatra: {
    id: '5wsfeENwi3WqHrn3n',
  },
  analytics: {
    base: 'https://polarbear.codeday.org',
  },
};

const customCss = css`
  @import url(https://f1.srnd.org/topo/fonts/all.css);
`;

const Provider = ({
  analyticsId, brandColor, withChat, children,
}) => (
  <ThemeProvider
    theme={{
      ...codedayTheme,
      analytics: { ...codedayTheme.analytics, siteId: analyticsId },
      colors: { ...colors, brand: codedayTheme.colors[brandColor] || colors.brand },
    }}
  >
    <CSSReset config={(theme) => theme.colors.modes} />
    <Global styles={customCss} />
    { withChat && <Chatra /> }
    { analyticsId && <Analytics /> }
    {children}
  </ThemeProvider>
);
Provider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]).isRequired,
  analyticsId: PropTypes.string,
  brandColor: PropTypes.string,
  withChat: PropTypes.bool,
};
Provider.defaultProps = {
  analyticsId: null,
  brandColor: null,
  withChat: false,
};
export default Provider;
