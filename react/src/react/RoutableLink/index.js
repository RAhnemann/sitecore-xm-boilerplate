import React from 'react';
import classNames from 'classnames';
import { Link, isEditorActive } from '@sitecore-jss/sitecore-jss-react';
// note we're aliasing the router's link component name, since it conflicts with JSS' link component
import { Link as RouterLink } from 'react-router-dom';

/** React component that turns Sitecore INTERNAL links into react-router route links */
const RoutableLink = ({ children, field, className, ariaLabel, ...props }) => {
  const customClass = classNames(field?.value?.class, className);

  // we are in Experience Editor mode
  // we render a normal link to properly support EE
  if (isEditorActive()) {
    return <Link field={field} className={customClass} />;
  }

  // we're NOT in Experience Editor mode
  // we check if this is an INTERNAL Sitecore link
  const value = field?.value;

  if (value?.linktype?.toLowerCase() === 'internal') {
    return (
      <RouterLink
        to={value.href}
        aria-label={ariaLabel}
        target="_self"
        {...props}
        className={customClass}
      >
        {children || value?.text || value?.href}
      </RouterLink>
    );
  }

  // we are NOT in Experience Editor
  // AND
  // we are NOT dealing with an INTERNAL link
  // in this case, we render a normal link
  // so that the browser does whatever the link is configured to make the browser do
  // e.g. EXTERNAL: full page load to target URL
  // e.g. MEDIA: full page load to target URL, or, download file
  // e.g. EMAIL: open default mail client
  return <Link field={field} className={customClass} />;
};

// usage - drop-in replacement for JSS' Link component
export { RoutableLink };
