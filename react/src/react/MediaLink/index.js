import classNames from 'classnames';
import React from 'react';
import { Image, Link, Text, isEditorActive } from '@sitecore-jss/sitecore-jss-react';
import { Link as RouterLink } from 'react-router-dom';

/** React component that turns Sitecore link values that start with / into react-router route links
 * & also wraps link around specified image
 */
const GetLinkWithImage = (props, customClass) => {
  return (
    <Link field={props?.link} className={customClass}>
      <Image media={props?.image} />
      {(isEditorActive() || props?.text?.value) && <Text field={props?.text} />}
    </Link>
  );
};

const MediaLink = (props) => {
  const customClass = classNames(props?.link?.value?.class, props?.className);

  // we are in Experience Editor mode
  // we render a normal link with an image in it to properly support EE
  if (isEditorActive()) {
    return GetLinkWithImage(props, customClass);
  }

  const hasImage =
    props?.image?.value?.src !== undefined &&
    props?.image?.value?.src !== null &&
    props?.image?.value?.src !== '';

  const hasUrl =
    props?.link?.value?.href !== undefined &&
    props?.link?.value?.href !== null &&
    props?.link?.value?.href !== '';

  const hasText =
    props?.text?.value !== undefined && props?.text?.value !== null && props?.text?.value !== '';

  //if media link does not have image field populated in Sitecore, render a regular router link
  if (hasImage && hasUrl) {
    // we're NOT in Experience Editor mode
    // we check if this is an INTERNAL Sitecore link
    const { value, ...link } = props?.link;

    if (value?.linktype?.toLowerCase() === 'internal') {
      return (
        <RouterLink
          to={value.href}
          aria-label={link?.ariaLabel || ''}
          target="_self"
          {...link}
          className={customClass}
        >
          <Image media={props?.image} />
          {hasText
            ? (isEditorActive() || props?.text?.value) && <Text field={props?.text} />
            : props?.showLinkText && value?.text}
        </RouterLink>
      );
    }

    // we are NOT in Experience Editor
    // AND
    // we are NOT dealing with an INTERNAL link
    // in this case, we render a normal link with an image in it
    // so that the browser does whatever the link is configured to make the browser do
    // e.g. EXTERNAL: full page load to target URL
    // e.g. MEDIA: full page load to target URL, or, download file
    // e.g. EMAIL: open default mail client
    return GetLinkWithImage(props, customClass);
  }

  if (hasImage) {
    return <Image media={props?.image} />;
  }

  return <></>;
};

export default MediaLink;
